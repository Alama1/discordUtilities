const Groq = require('groq-sdk')
const { GoogleGenerativeAI } = require("@google/generative-ai");

class MessageHandler {

    constructor(discord) {
        this.discord = discord
        this.initAI()
    }

    async initAI () {
        this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        this.googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
        this.googleAIModel = this.googleAI.getGenerativeModel({model: 'gemini-1.5-flash'})
        console.log(process.env.GOOGLE_AI_KEY)
    }

    async onMessage(message) {
        if (message.author.bot) return
        
        this.emojiResponse(message)
        this.memeResponse(message)
        this.aiResponse(message)
    }

    emojiResponse(message) {
        if (this.random(this.discord.app.config.properties.discord.reactionChance)) {
            this.reactToMessage(message)
        }
    }

    async aiResponse(message) {
        if (message.content.includes(this.discord.client.user.id)) {
            const messageContent = message.content.replace(`<@${this.discord.client.user.id}>`, '').trim()
            const aiResp = await this.getGoogleAIMessage(messageContent)
            message.reply(aiResp || 'Aga da')
        }

        if (message.mentions.repliedUser) {
            if (message.mentions.repliedUser.id === this.discord.client.user.id) {
                const aiReply = await this.getGoogleAIMessage(message)
                message.reply(aiReply || 'Aga da')
            }
        }
        
        if (this.random(this.discord.app.config.properties.discord.aiResponseChance)) {
            const aiReply = await this.getGoogleAIMessage(message)
            message.reply(aiReply || 'Aga da')
        }
    }

    async getGoogleAIMessage(message) {
        const messageContent = message.content
        console.log(messageContent)
        const resp = await this.googleAIModel.generateContent({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: messageContent,
                  }
                ],
                role: 'system',
                parts: [
                  {
                    text: this.discord.app.config.properties.ai.character,
                  }
                ]
              }
            ],
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.1,
            },
          });
        return resp.response.text()
    }

    async getAIMessage(message) {
        const resp = await this.groq.chat.completions.create({
            messages: [
                        {
                            role: "system",
                            content: this.discord.app.config.properties.ai.character
                        },
                        {
                            role: "user",
                            content: message,
                        },
                    ],
            model: "llama3-8b-8192",
          });
        return resp.choices[0].message.content
    }

    memeResponse(message) {
        //Sonic response
        if (message.content.toLowerCase().trim() == 'да') {
            if (this.random(30)) {
                message.reply('https://tenor.com/view/gifkusta-gif-24281133')
            }
        }

        if (message.content.toLowerCase().trim() == 'нет') {
            if (this.random(30)) {
                message.reply('https://media.discordapp.net/attachments/867441545341698088/1103722324152287303/gifgit.gif?ex=662d2a04&is=662bd884&hm=6b327cff63db14d7ebc7534b983886edecd3ec0873e123be8921ca99395b551b&')
            }
        }

        //Random message gif react
        if (this.random(this.discord.app.config.properties.discord.gifReactionChance)) {
            const gifPool = this.discord.app.config.properties.gifReactions

            const gif = gifPool[Math.floor(Math.random()*gifPool.length)];

            if (!gif) return
            message.reply(gif)
        }
        
        //Personal responses
        for (const [key, value] of Object.entries(this.discord.app.config.properties.personalReactions)) {
            if (message.author.id === key) {
                if (this.random(this.discord.app.config.properties.discord.personalGifReactionChance)) {
                    const gif = value[Math.floor(Math.random()*value.length)];
                    if (!gif) return
                    message.reply(gif)
                }
            }
        }
    }

    reactToMessage(message) {
        const emojisnop = this.discord.app.config.properties.emojisToUse;
        let emojirandom
        if (message) {
            emojirandom = emojisnop[Math.floor(Math.random() * emojisnop.length)]
            message.react(emojirandom)
        }
    }

    random = (chance) => { return (chance / 100) > Math.random() } 
}
module.exports = MessageHandler
