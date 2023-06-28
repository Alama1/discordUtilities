const {GatewayIntentBits, Client, EmbedBuilder} = require('discord.js')
const InteractionHandler = require('./handlers/interactionHandler')

class DiscordManager {
    constructor(app) {
        this.app = app
    }

    connect() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        })

        this.client.on('ready', () => {
            console.log(`${this.client.user.tag} is ready!`)
            this.interactionHandler = new InteractionHandler(this)

            setInterval(async () => {
                await this.watchAvatars()
            }, 60000)
        })

        this.client.on('interactionCreate', interaction => {
            this.interactionHandler.onInteraction(interaction)
        })
        this.client.login(this.app.config.properties.discord.token)
            .catch(error => {
                this.app.log.error(error)

                process.exit(1)
            })

    }
    async watchAvatars() {
        const usersToCheck = this.app.config.properties.avatarWatchList
        const userIDs = Object.keys(usersToCheck)
        console.log(`Checking avatars ${Date.now().toString()} for users: ${userIDs.join(' ')}`)
        for (let userID of userIDs) {
            const currentUser = await this.client.users.fetch(userID)
            const oldAV = usersToCheck[userID].avatar

            if (currentUser.avatar === oldAV) continue

            this.app.config.properties.avatarWatchList[userID] = { avatar: currentUser.avatar }
            this.app.config.saveAvatarsToConfig()
            const newAVURL = `https://cdn.discordapp.com/avatars/${userID}/${currentUser.avatar}?size=4096`
            const channel = await this.client.channels.fetch(this.app.config.properties.discord.chatID)
            const avatarEmbed = new EmbedBuilder()
                .setTitle(currentUser.username)
                .setDescription(`<@${userID}> изменил аватарку!`)
                .setImage(newAVURL)
                .setColor('#2335ff');
            channel.send({ embeds: [avatarEmbed]})

        }
    }
}

module.exports = DiscordManager
