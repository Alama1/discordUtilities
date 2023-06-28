const { SlashCommandBuilder } = require('@discordjs/builders');
class watchAvatar {

    data = new SlashCommandBuilder()
        .setName('watchavatar')
        .setDescription('Add avatar to watch list and show whenever it changed')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User that you want to add to watch list')
                .setRequired(true)
        )
}

module.exports = watchAvatar
