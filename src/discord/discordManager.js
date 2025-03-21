const {GatewayIntentBits, Client, EmbedBuilder, ActivityType, ChannelType} = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const InteractionHandler = require('./handlers/interactionHandler')
const MessageHandler = require('./handlers/messageHandler')
const VoiceHandler = require('./handlers/speechHandler')
const getColors = require('get-image-colors')
const schedule = require('node-schedule');
const { join } = require('path')


class DiscordManager {
    constructor(app) {
        this.app = app
        this.users = {}
    }

    async connect() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
            ]
        })

        this.client.on('ready', () => {
            console.log(`${this.client.user.tag} is ready!`)
            this.interactionHandler = new InteractionHandler(this)
            this.messageHandler = new MessageHandler(this)
            this.voiceHandler = new VoiceHandler(this)

            this.checkAvatars()
            setInterval(async () => {
                await this.checkAvatars()
            }, 60000)
            
            this.updateUserList()
            setInterval(() => {
                this.updateUserList()
            }, 24 * 60 * 60 * 100) //Once a day
            schedule.scheduleJob('0 15 * * *', () => {this.bigBen()})
        })

        this.client.on('interactionCreate', interaction => {
            this.interactionHandler.onInteraction(interaction)
        })

        this.client.on('messageCreate', message => {
            this.messageHandler.onMessage(message)
        })

        this.client.login(this.app.config.properties.discord.token)
            .catch(error => {
                console.error(error)

                process.exit(1)
            }).then((res) => {
                this.client.user.setActivity('на маму Димы', { type: ActivityType.Watching })
            })

    }

    async updateUserList() {
        const guild = await this.client.guilds.fetch(this.app.config.properties.discord.guildID)
        const members = await guild.members.fetch()
        console.log('Fetching users..')

        members.forEach((element) => {
            const username = element.nickname ? element.nickname : element.user.username
            this.users[element.id] = username.trim()
        })
    }

    async bigBen() {
        const guild = await this.client.guilds.fetch(this.app.config.properties.discord.guildID)
        const channels = await guild.channels.fetch()
        const voiceChannels = channels.filter(channel => channel.type === ChannelType.GuildVoice);
        const activeVoiceChannels = voiceChannels.filter(channel => channel.members.size > 0)
        const mostPopulatedChannel = activeVoiceChannels.reduce((prev, curr) => {
            return (prev.members.size > curr.members.size) ? prev : curr;
        }, { members: { size: 0 } });
    
        if (mostPopulatedChannel.members.size > 0) {
            const connection = joinVoiceChannel({
                channelId: mostPopulatedChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });
            const player = createAudioPlayer();
            const resource = createAudioResource(join(__dirname, 'bigben.mp3'));

            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
                console.log('Left the voice channel.');
            });
        }
    }
    
    async checkAvatars() {
        const usersToCheck = this.app.config.properties.avatarWatchList
        const userIDs = Object.keys(usersToCheck)
        console.log(`Checking avatars ${Date.now().toString()} for users: ${userIDs.join(' ')}`)
        for (let userID of userIDs) {
            const currentUser = await this.client.users.fetch(userID)
            const oldAV = usersToCheck[userID].avatar

            if (currentUser.avatar === oldAV) continue

            this.app.config.properties.avatarWatchList[userID] = { avatar: currentUser.avatar }
            this.app.config.saveConfig()
            const newAVURL = `https://cdn.discordapp.com/avatars/${userID}/${currentUser.avatar}?size=4096`
            const channel = await this.client.channels.fetch(this.app.config.properties.discord.chatID)
            const avatarEmbed = new EmbedBuilder()
                .setTitle(currentUser.username)
                .setDescription(`<@${userID}> изменил аватарку!`)
                .setImage(newAVURL)
                .setColor(await this.getAvatarColors(newAVURL));
            channel.send({ embeds: [avatarEmbed]})
            .then((message) => {
                const emojisnop = this.app.config.properties.avatarsEmojisToUse
                emojisnop.forEach(element => {
                    message.react(element)
                });
            })

        }
    }

    async getAvatarColors(url) {
        let colors
        try{
            colors = await getColors(url)
        } catch (e) {
            console.error(e)
            return '#1b59ff'
        }
        if (colors.length === 0 || !colors[0].hasOwnProperty('_rgb')) return '#1b59ff'
        return [colors[0]._rgb[0], colors[0]._rgb[1], colors[0]._rgb[2]]
    }

}

module.exports = DiscordManager
