const { EmbedBuilder } = require('discord.js')
class messageReactionChanceCommand {
    constructor(discord) {
        this.discord = discord
        this.name = 'reactionchance'
    }

    async onCommand(interaction) {
        const newReactionChanceInPercents = this.getDataFromInteraction(interaction)

        const convertedChance = (100 - newReactionChanceInPercents) / 100

        this.discord.app.config.properties.discord.reactionChance = convertedChance
        this.discord.app.config.saveConfig()


        const returnEmbed = new EmbedBuilder()
        returnEmbed
            .setTitle('Done!')
            .setDescription(`Шанс на реакцию обновлен, теперь он составляет: ${newReactionChanceInPercents}%`)
            .setColor('#00c2ff')
        interaction.editReply({
            embeds: [returnEmbed],
            ephemeral: false
        })
    }

    getDataFromInteraction(interaction) {
        const interactionData = interaction.options._hoistedOptions
        const chance = interactionData[0].value

        return chance
    }
}


module.exports = messageReactionChanceCommand
