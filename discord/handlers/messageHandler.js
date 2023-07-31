class MessageHandler {

    constructor(discord) {
        this.discord = discord
    }

    async onMessage(message) {
        if (Math.random() > 0.995) {
            this.reactToMessage(message)
        }
    }

    reactToMessage(message) {
        const emojisnop = [":tulpa:1113099152390377523", ":ok:1113101186824933457", "<:rofl:1130622489098207413>"];
        let emojirandom
        if (message) {
            emojirandom = emojisnop[Math.floor(Math.random() * emojisnop.length)]
            message.react(emojirandom)
        }
    }
}
module.exports = MessageHandler
