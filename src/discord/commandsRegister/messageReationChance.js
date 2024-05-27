const { SlashCommandBuilder } = require('@discordjs/builders');
class messageReactionChance {

    data = new SlashCommandBuilder()
        .setName('reactionchance')
        .setDescription('Chance to react to message')
        .addNumberOption(option =>
            option.setName('chance')
                .setDescription('Chance to react (0-100)%')
                .setRequired(true)
                .setMaxValue(100)
                .setMinValue(0)
        )
}

module.exports = messageReactionChance
