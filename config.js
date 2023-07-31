const fs = require("fs");
require('dotenv').config()

class Config {
    properties = {
        discord: {
            token: process.env.DISCORD_TOKEN,
            chatID: "398082454532915201",
            guildID: "234041538617933824"
        },
        avatarWatchList: {

        }
    }

    constructor() {
        this.properties.avatarWatchList = require('./avatarWatchList.json')
    }

    saveAvatarsToConfig() {
        fs.writeFile('avatarWatchList.json', JSON.stringify(this.properties.avatarWatchList),{encoding: "utf8"}, (err) => {
            if (err) console.error(err)
        })
        console.log('Avatar to watch saved!')
    }
}

module.exports = Config