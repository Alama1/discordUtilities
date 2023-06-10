const {GatewayIntentBits, Client} = require('discord.js')

class DiscordManager {
    constructor(app) {
        this.app = app
    }

    connect() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        })

        this.client.on('ready', () => {
            console.log(`${this.client.user.tag} is ready!`)
        })

        this.client.on('messageCreate', message => this.onMessage(message))
        this.client.login(this.app.config.properties.discord.token)
            .catch(error => {
                this.app.log.error(error)

                process.exit(1)
            })

    }

    async onMessage(message) {
        if (!this.shouldReply(message)) return
        const content = message.content.replaceAll(/<@!*&*[0-9]+>/gm, '')
        if (!content) return
        const AIReply = await this.app.ai.getMessageFromAi(content)
        message.reply(AIReply.text.split('\n')[0])
    }

    shouldReply(message) {
        if(message.mentions.repliedUser) {
            if(message.mentions.repliedUser.id === this.client.user.id) return true
        }

        return message.content.includes(this.client.user.id)
    }
}

module.exports = DiscordManager
