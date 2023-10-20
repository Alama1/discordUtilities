class MessageHandler {

    constructor(discord) {
        this.discord = discord
    }

    async onMessage(message) {
        if (Math.random() > this.discord.app.config.properties.discord.reactionChance) {
            this.reactToMessage(message)
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
}
module.exports = MessageHandler
