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
        emojisToUse: []
    }

    constructor() {
        this.properties = require('../config.json')
        this.properties.avatarWatchList = require('./avatarWatchList.json')
        this.properties.emojisToUse = require('../messageReactEmojiShop.json')
        this.properties.avatarsEmojisToUse = require('../avatarReactEmojiShop.json')
        this.properties.discord.token = process.env.DISCORD_TOKEN
        this.properties.express.secret = process.env.EXPRESS_SECRET
    }

    saveEmojisToConfig() {
        fs.writeFileSync(__dirname + '/messageReactEmojiShop.json', JSON.stringify(this.properties.emojisToUse),{encoding: "utf8"})
    }

    saveWholeConfig() {
        delete this.properties.discord.token
        fs.writeFileSync(__dirname + '/config.json', JSON.stringify(this.properties),{encoding: "utf8"})
    }

    saveAvatarsToConfig() {
        fs.writeFileSync(__dirname + '/avatarWatchList.json', JSON.stringify(this.properties.avatarWatchList),{encoding: "utf8"})
    }
}

module.exports = Config