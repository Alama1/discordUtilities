const { EmbedBuilder } = require('discord.js')
class unwatchAvatarCommand {

    constructor(discord) {
        this.discord = discord
        this.name = 'unwatchavatar'
    }

    async onCommand(interaction) {
        const userID = this.getDataFromInteraction(interaction)

        if (!this.discord.app.config.properties.avatarWatchList.hasOwnProperty(userID)) {
            const returnEmbed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription(`Аватарка этого пользователя не отслеживается.`)
                .setColor('#ff2222')
            interaction.editReply({
                embeds: [returnEmbed],
                ephemeral: false
            })
            return
        }

        delete this.discord.app.config.properties.avatarWatchList[userID]
        this.discord.app.config.saveConfig()
        const returnEmbed = new EmbedBuilder()
        returnEmbed
            .setTitle('Done!')
            .setDescription(`Аватар пользователя удален из отслеживаемых.`)
            .setColor('#00c2ff')
        interaction.editReply({
            embeds: [returnEmbed],
            ephemeral: false
        })
    }

    getDataFromInteraction(interaction) {
        const interactionData = interaction.options._hoistedOptions
        const userID = interactionData[0].value

        return userID
    }
}


module.exports = unwatchAvatarCommand