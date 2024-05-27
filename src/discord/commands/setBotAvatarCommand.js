const { EmbedBuilder } = require('discord.js')
class setBotAvatarCommand {
    constructor(discord) {
        this.discord = discord
        this.name = 'changeavatar'
    }

    async onCommand(interaction) {


        console.log(interaction.user.id)
        if (interaction.user.id !== '434784069180588032') {
            const returnEmbed = new EmbedBuilder()
            returnEmbed
                .setTitle('No.')
                .setDescription(`Только Дима может обновлять аватарку бота!`)
                .setColor('#f61d4f')
            await interaction.editReply({
                embeds: [returnEmbed],
                ephemeral: false
            })
            return
        }

        const newAvatar = await interaction.options.getAttachment("image")

        this.discord.client.user.setAvatar(newAvatar.url)

        const returnEmbed = new EmbedBuilder()
        returnEmbed
            .setTitle('Done!')
            .setDescription(`Аватарка обновлена!`)
            .setColor('#00c2ff')
        await interaction.editReply({
            embeds: [returnEmbed],
            ephemeral: false
        })
    }
}


module.exports = setBotAvatarCommand
