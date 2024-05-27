const { SlashCommandBuilder } = require('@discordjs/builders');
class watchList {

    data = new SlashCommandBuilder()
        .setName('watchlist')
        .setDescription('Shows an embed with all watched avatars')
}

module.exports = watchList
