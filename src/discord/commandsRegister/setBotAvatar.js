const { SlashCommandBuilder } = require('@discordjs/builders');
class setBotAvatar {

    data = new SlashCommandBuilder()
        .setName('changeavatar')
        .setDescription('Update bot avatar')
        .addAttachmentOption(option =>
            option.setName('avatar')
                .setName('image')
                .setDescription('Новая аватарка')
                .setRequired(true)
        )
}

module.exports = setBotAvatar
