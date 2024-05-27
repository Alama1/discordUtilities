const { SlashCommandBuilder } = require('@discordjs/builders');
class showReactionEmojis {

    data = new SlashCommandBuilder()
        .setName('emojipull')
        .setDescription('Shows add available reaction emojis')
}

module.exports = showReactionEmojis
