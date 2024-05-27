const { EmbedBuilder } = require('discord.js')
class watchAvatarCommand {
    constructor(discord) {
        this.discord = discord
        this.name = 'watchavatar'
    }

    async onCommand(interaction) {
        const userID = this.getDataFromInteraction(interaction)
        const guild = await this.discord.client.guilds.fetch(this.discord.app.config.properties.discord.guildID)
        const user = await guild.members.fetch(userID)
        const userAV = user.user.avatar

        if (this.isAlreadyWatched(userID, interaction)) return

        this.discord.app.config.properties.avatarWatchList[userID] = { avatar: userAV }
        this.discord.app.config.saveAvatarsToConfig()


        const returnEmbed = new EmbedBuilder()
        returnEmbed
            .setTitle('Done!')
            .setDescription(`Аватар пользователя добавлен к отслеживаемым.`)
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

    isAlreadyWatched(userID, interaction) {
        if (this.discord.app.config.properties.avatarWatchList.hasOwnProperty(userID)) {
            const returnEmbed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription(`Аватарка этого пользователя уже отслеживается.`)
                .setColor('#ff2222')
            interaction.editReply({
                embeds: [returnEmbed],
                ephemeral: false
            })
            return true
        } return false
    }
}


module.exports = watchAvatarCommand
