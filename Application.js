const Configuration = require('./config')
const AI = require('./ai/aiManager')
const Discord = require('./discord/discordManager')
class Application {
    async register() {
        this.config = new Configuration()
        this.ai = new AI(this)
        this.discord = new Discord(this)
    }

    async init() {
        await this.ai.init()
        this.discord.connect()

    }
}

module.exports = new Application()