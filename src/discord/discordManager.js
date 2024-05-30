const {GatewayIntentBits, Client, EmbedBuilder, ActivityType} = require('discord.js')
const InteractionHandler = require('./handlers/interactionHandler')
const MessageHandler = require('./handlers/messageHandler')
const getColors = require('get-image-colors')

class DiscordManager {
    constructor(app) {
        this.app = app
        this.users = []
    }

    async connect() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        })

        this.client.on('ready', () => {
            console.log(`${this.client.user.tag} is ready!`)
            this.interactionHandler = new InteractionHandler(this)
            this.messageHandler = new MessageHandler(this)

            this.checkAvatars()
            setInterval(async () => {
                await this.checkAvatars()
            }, 60000)
            
            this.updateUserList()
            setInterval(() => {
                this.updateUserList()
            }, 24 * 60 * 60 * 100) //Once a day
        })

        this.client.on('interactionCreate', interaction => {
            this.interactionHandler.onInteraction(interaction)
        })

        this.client.on('messageCreate', message => {
            this.messageHandler.onMessage(message)
        })

        this.client.login(this.app.config.properties.discord.token)
            .catch(error => {
                console.error(error)

                process.exit(1)
            }).then((res) => {
                this.client.user.setActivity('на маму Димы', { type: ActivityType.Watching })
            })

    }

    async updateUserList() {
        const guild = await this.client.guilds.fetch(this.app.config.properties.discord.guildID)
        const members = await guild.members.fetch()
        console.log('Fetching users..')
        this.users = members.map((element) => {
            const username = element.nickname ? element.nickname : element.user.username
            return { [username]: element.id }
        })
    }
    
    async checkAvatars() {
        const usersToCheck = this.app.config.properties.avatarWatchList
        const userIDs = Object.keys(usersToCheck)
        console.log(`Checking avatars ${Date.now().toString()} for users: ${userIDs.join(' ')}`)
        for (let userID of userIDs) {
            const currentUser = await this.client.users.fetch(userID)
            const oldAV = usersToCheck[userID].avatar

            if (currentUser.avatar === oldAV) continue

            this.app.config.properties.avatarWatchList[userID] = { avatar: currentUser.avatar }
            this.app.config.saveConfig()
            const newAVURL = `https://cdn.discordapp.com/avatars/${userID}/${currentUser.avatar}?size=4096`
            const channel = await this.client.channels.fetch(this.app.config.properties.discord.chatID)
            const avatarEmbed = new EmbedBuilder()
                .setTitle(currentUser.username)
                .setDescription(`<@${userID}> изменил аватарку!`)
                .setImage(newAVURL)
                .setColor(await this.getAvatarColors(newAVURL));
            channel.send({ embeds: [avatarEmbed]})
            .then((message) => {
                const emojisnop = this.app.config.properties.avatarsEmojisToUse
                emojisnop.forEach(element => {
                    message.react(element)
                });
            })

        }
    }

    async getAvatarColors(url) {
        let colors
        try{
            colors = await getColors(url)
        } catch (e) {
            console.error(e)
            return '#1b59ff'
        }
        if (colors.length === 0 || !colors[0].hasOwnProperty('_rgb')) return '#1b59ff'
        return [colors[0]._rgb[0], colors[0]._rgb[1], colors[0]._rgb[2]]
    }

}

module.exports = DiscordManager
