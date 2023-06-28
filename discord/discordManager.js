const {GatewayIntentBits, Client, EmbedBuilder} = require('discord.js')
const InteractionHandler = require('./handlers/interactionHandler')
const schedule = require('node-schedule')

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
            this.watchAvatars()
            schedule.scheduleJob('*/1 * * * *', () => { this.watchAvatars() })
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
        const guild = await this.client.guilds.fetch(this.app.config.properties.discord.guildID)
        const usersToCheck = this.app.config.properties.avatarWatchList
        const userIDs = Object.keys(usersToCheck)
        console.log(`Checking avatars ${Date.now().toString()} for users: ${userIDs.join(' ')}`)
        for (let user of userIDs) {
            const currentUser = (await guild.members.fetch(user)).user
            const oldAV = usersToCheck[user].avatar

            if (currentUser.avatar === oldAV) continue

            this.app.config.properties.avatarWatchList[user] = { avatar: currentUser.avatar }
            this.app.config.saveAvatarsToConfig()
            const newAVURL = (await guild.members.fetch(user)).displayAvatarURL({ size: 4096, dynamic: true })
            const channel = await this.client.channels.fetch(this.app.config.properties.discord.chatID)
            const avatarEmbed = new EmbedBuilder()
                .setTitle(currentUser.username)
                .setDescription(`<@${user}> изменил аватарку!`)
                .setImage(newAVURL)
                .setColor('#2335ff');
            channel.send({ embeds: [avatarEmbed]})

        }
    }
}

module.exports = DiscordManager
