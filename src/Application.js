const Configuration = require('./config')
const Discord = require('./discord/discordManager')
class Application {
    async register() {
        this.config = new Configuration()
        this.discord = new Discord(this)
    }

    async init() {
        this.discord.connect()
    }
}

module.exports = new Application()