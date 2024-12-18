const { EmbedBuilder } = require('discord.js')

class voiceCommand {
    constructor(discord) {
        this.discord = discord
        this.name = 'voice'
    }

    async onCommand(interaction) {
        this.discord.voiceHandler.listenAndRespond(interaction)

        const returnEmbed = new EmbedBuilder()
        returnEmbed
            .setTitle('Ну давай!')
            .setColor('#00c2ff')
        interaction.editReply({
            embeds: [returnEmbed],
            ephemeral: false
        })
    }
}


module.exports = voiceCommand