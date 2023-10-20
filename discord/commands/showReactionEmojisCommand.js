const { EmbedBuilder } = require('discord.js')
class showReactionEmojisCommand {
    constructor(discord) {
        this.discord = discord
        this.name = 'emojipull'
    }

    async onCommand(interaction) {
        const returnEmbed = new EmbedBuilder()
        returnEmbed
            .setTitle('Done!')
            .setDescription(`Вот все смайлики, которыми может реагировать бот`)
            .setColor('#00c2ff')
        const reply = await interaction.editReply({
            embeds: [returnEmbed],
            ephemeral: false
        })
        this.discord.app.config.properties.emojisToUse.forEach(emoji => {
            reply.react(emoji)
        })
    }
}


module.exports = showReactionEmojisCommand
