const { EmbedBuilder } = require('discord.js')
class addEmojiToReactionShopCommand {

    constructor(discord) {
        this.discord = discord
        this.name = 'addemoji'
    }

    async onCommand(interaction) {
        const emoji = this.getDataFromInteraction(interaction)
        const emojiRegEx = /:\w+:\d+/g
        const passedEmojis = emoji.match(emojiRegEx)

        if (passedEmojis === null) {
            interaction.editReply({
                embeds: [this.invalidEmojiResponse('Invalid emoji passed')],
                ephemeral: false
            })
            return
        }

        if (this.discord.app.config.properties.emojisToUse.includes(passedEmojis[0])) {
            interaction.editReply({
                embeds: [this.invalidEmojiResponse('Этот смайлик уже есть в пуле реакций')],
                ephemeral: false
            })
            return
        }

        this.discord.app.config.properties.emojisToUse.push(passedEmojis[0])
        this.discord.app.config.saveConfig()

        const returnEmbed = new EmbedBuilder()
        returnEmbed
            .setTitle('Done!')
            .setDescription(`Смайлик ${emoji} успешно добавлен в возможные реакции`)
            .setColor('#00c2ff')
        interaction.editReply({
            embeds: [returnEmbed],
            ephemeral: false
        })
    }

    invalidEmojiResponse(message) {
        const embed = new EmbedBuilder()
        embed
            .setTitle('Invalid emoji!')
            .setDescription(message)
            .setColor('#ff2626')
        return embed
    }

    getDataFromInteraction(interaction) {
        const interactionData = interaction.options._hoistedOptions
        const emoji = interactionData[0].value

        return emoji
    }
}


module.exports = addEmojiToReactionShopCommand