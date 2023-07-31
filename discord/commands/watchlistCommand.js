const { EmbedBuilder } = require('discord.js')
class watchlistCommand {

    constructor(discord) {
        this.discord = discord
        this.name = 'watchlist'
    }

    async onCommand(interaction) {

        const watchList = Object.keys(this.discord.app.config.properties.avatarWatchList)
        const embedDescription = watchList.reduce((arr, curr) => {
            return arr += `<@${curr}>`
        }, 'Сейчас отслеживаются:\n ')


        const returnEmbed = new EmbedBuilder()
        returnEmbed
            .setTitle('Done!')
            .setDescription(embedDescription)
            .setColor('#00c2ff')
        interaction.editReply({
            embeds: [returnEmbed],
            ephemeral: false
        })
    }
}


module.exports = watchlistCommand