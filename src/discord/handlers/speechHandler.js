const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const prism = require('prism-media');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const axios = require('axios');

class VoiceHandler {
    constructor(discord) {
        this.discord = discord
        this.sttClient = new speech.SpeechClient();
        this.ttsClient = new textToSpeech.TextToSpeechClient();
        this.isSpeaking = false
    }

    async listenAndRespond(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            console.log('User is not in a voice channel.');
            await interaction.reply('You need to join a voice channel first!');
            return;
        }

        // Join the user's voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        connection.on('stateChange', (oldState, newState) => {
            console.log(`Connection state changed from ${oldState.status} to ${newState.status}`);
        });
    
        // Handle disconnections and attempt reconnection
        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            try {
                console.log('Attempting to reconnect...');
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
                console.log('Reconnected successfully.');
            } catch (error) {
                console.error('Reconnection failed. Destroying connection.', error);
                connection.destroy();
            }
        });

        const receiver = connection.receiver;
        const audioStreams = new Map();

        // Listen for when a user starts speaking
        receiver.speaking.on('start', (userId) => {
            console.log(`User ${userId} started speaking.`);
            const audioStream = receiver.subscribe(userId, { end: { behavior: 'manual' } });

            // Convert Opus audio to PCM format
            const pcmStream = audioStream.pipe(
                new prism.opus.Decoder({ rate: 48000, channels: 1, frameSize: 960 })
            );

            // Save PCM audio to a temporary file
            const fileName = `./temp_audio_${userId}.pcm`;
            const fileStream = fs.createWriteStream(fileName);
            pcmStream.pipe(fileStream);

            // Store the file stream for later use
            audioStreams.set(userId, { fileName, fileStream });
        });

        // Listen for when a user stops speaking
        receiver.speaking.on('end', async (userId) => {
            console.log(`User ${userId} stopped speaking.`);

            const userAudio = audioStreams.get(userId);
            if (userAudio) {
                const { fileName, fileStream } = userAudio;
                fileStream.end(); // Finalize the file

                // Wait for the file to finish saving
                fileStream.on('finish', async () => {
                    console.log(`Audio file saved: ${fileName}`);
                    const audioBuffer = fs.readFileSync(fileName);

                    // Transcribe the audio
                    await this.transcribeAudio(audioBuffer, async (text) => {
                        if (text.toLowerCase() === 'отключись') {
                            connection.destroy();
                            return
                        }
                        console.log(`Transcribed text: ${text}`);
                        if (text) {
                            const resp = await this.discord.messageHandler.getGoogleAIMessage({content: text})
                            await this.speakInVoiceChannel(voiceChannel, resp);
                        }
                    });

                    // Clean up the file
                    fs.unlinkSync(fileName);
                    audioStreams.delete(userId);
                });
            }
        });
    }
    
    

    async transcribeAudio(audioBuffer, callback) {
        const request = {
            audio: {
                content: audioBuffer.toString('base64'),
            },
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 48000,
                languageCode: 'ru-RU',
            },
        };

        try {
            const [response] = await this.sttClient.recognize(request);
            const transcription = response.results
                .map((result) => result.alternatives[0].transcript)
                .join('\n');

            callback(transcription);
        } catch (error) {
            console.error('Error during transcription:', error);
        }
    }
    

    async speakInVoiceChannel(voiceChannel, text) {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const request = {
            input: { text },
            voice: { languageCode: 'ru-RU', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        try {
            // Synthesize speech
            const [response] = await this.ttsClient.synthesizeSpeech(request);

            // Save the audio to a file
            const filePath = './output.mp3';
            const writeFile = util.promisify(fs.writeFile);
            await writeFile(filePath, response.audioContent, 'binary');

            // Play the audio in the voice channel
            const player = createAudioPlayer();
            const resource = createAudioResource(filePath);
            player.play(resource);
            connection.subscribe(player);

            // Clean up the file after playback
            player.on('idle', () => {
                fs.unlinkSync(filePath);
            });
        } catch (error) {
            console.error('Error during text-to-speech:', error);
        }
    }
    
}

module.exports = VoiceHandler;
