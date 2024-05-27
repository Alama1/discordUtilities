const { SlashCommandBuilder } = require('@discordjs/builders');
class addEmojiToReactionShop {

    data = new SlashCommandBuilder()
        .setName('addemoji')
        .setDescription('Add emoji to reaction pool')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Emoji to add')
                .setRequired(true)
        )
}

module.exports = addEmojiToReactionShop
