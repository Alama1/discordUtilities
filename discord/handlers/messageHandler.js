class MessageHandler {

    constructor(discord) {
        this.discord = discord
    }

    async onMessage(message) {
        if (Math.random() > this.discord.app.config.properties.discord.reactionChance) {
            this.reactToMessage(message)
        }
        if (message.content.toLowerCase().trim() == 'да') {
            if (Math.random() > 0.7) {
                message.reply('https://tenor.com/view/gifkusta-gif-24281133')
            }
        }
    }

    reactToMessage(message) {
        const emojisnop = this.discord.app.config.properties.emojisToUse;
        let emojirandom
        if (message) {
            emojirandom = emojisnop[Math.floor(Math.random() * emojisnop.length)]
            console.log(emojirandom)
            message.react(emojirandom)
        }
    }
}
module.exports = MessageHandler
