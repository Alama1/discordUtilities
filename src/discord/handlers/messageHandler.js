class MessageHandler {

    constructor(discord) {
        this.discord = discord
    }

    async onMessage(message) {
        if (message.author.bot) return
        
        this.emojiResponse(message)
        this.memeResponse(message)
    }

    emojiResponse(message) {
        if (this.random(this.discord.app.config.properties.discord.reactionChance)) {
            this.reactToMessage(message)
        }
    }

    memeResponse(message) {
        //Sonic response
        if (message.content.toLowerCase().trim() == 'да') {
            if (this.random(30)) {
                message.reply('https://tenor.com/view/gifkusta-gif-24281133')
            }
        }

        if (message.content.toLowerCase().trim() == 'нет') {
            if (this.random(30)) {
                message.reply('https://media.discordapp.net/attachments/867441545341698088/1103722324152287303/gifgit.gif?ex=662d2a04&is=662bd884&hm=6b327cff63db14d7ebc7534b983886edecd3ec0873e123be8921ca99395b551b&')
            }
        }

        //Random message gif react
        if (this.random(this.discord.app.config.properties.discord.gifReactionChance)) {
            const gifPool = this.discord.app.config.properties.gifReactions

            const gif = gifPool[Math.floor(Math.random()*gifPool.length)];

            if (!gif) return
            message.reply(gif)
        }
        
        //Personal responses
        for (const [key, value] of Object.entries(this.discord.app.config.properties.personalReactions)) {
            if (message.author.id === key) {
                if (this.random(this.discord.app.config.properties.discord.personalGifReactionChance)) {
                    const gif = value[Math.floor(Math.random()*value.length)];
                    if (!gif) return
                    message.reply(gif)
                }
            }
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

    random = (chance) => { return (chance / 100) > Math.random() } 
}
module.exports = MessageHandler
