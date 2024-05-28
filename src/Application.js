const Configuration = require('./config')
const Discord = require('./discord/discordManager')
const Express = require('./express/expressManager')

class Application {
    async register() {
        this.config = new Configuration()
        this.discord = new Discord(this)
        this.express = new Express(this)
    }

    async init() {
        this.discord.connect()
        this.express.start()
    }
}

module.exports = new Application()