const { SlashCommandBuilder } = require('@discordjs/builders');
class Unwatchavatar {

    data = new SlashCommandBuilder()
        .setName('unwatchavatar')
        .setDescription('Remove user from watch list')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User that you want to remove')
                .setRequired(true)
        )
}

module.exports = Unwatchavatar
