const fs = require("fs");
require('dotenv').config()

class Config {
    properties = {
        express: { 
            port: 3003,
            secret: ''
         },
        discord: {},
        avatarWatchList: {},
        emojisToUse: [],
        gifReactions: [],
        personalReactions: {},
        ai: {}
    }

    constructor() {
        this.properties = require(`${__base}config.json`)
        this.properties.discord.token = process.env.DISCORD_TOKEN
        this.properties.express.secret = process.env.EXPRESS_SECRET
        this.properties.express.port = process.env.PORT
    }

    saveConfig() {
        delete this.properties.discord.token
        fs.writeFileSync(`${__base}config.json`, JSON.stringify(this.properties),{encoding: "utf8"})
    }
}

module.exports = Config