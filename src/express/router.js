const { Router } = require('express')

class expressRouter {
    constructor(server) {
        this.server = server
    }

    createRoutes() {
        const routes = Router()

        //get
        routes.get('/helloworld', this.helloWorld.bind(this))
        routes.get('/gif-reaction', this.getGifReactions.bind(this))
        routes.get('/avatar-watch-list', this.getWatchedAvatars.bind(this))
        routes.get('/reaction-chance', this.getReactionChance.bind(this))
        routes.get('/users', this.getUsers.bind(this))
        
        //post
        routes.post('/gif-reaction', this.addGifReaction.bind(this))
        routes.post('/reaction-chance', this.setReactionChance.bind(this))
        //TODO change bot avatar

        //put

        //delete
        routes.patch('/gif-reaction', this.deleteGif.bind(this))
        return routes
    }

    helloWorld(req, res) {
        res.status(200)
        res.send({ success: true, message: 'Hello!' })
    }

    deleteGif(req, res) {
        const { gifToDelete, user } = req.body

        try {
            if (user === 'everyone') {
                const index = this.server.app.config.properties.gifReactions.indexOf(gifToDelete)
                if (index > -1) {
                    this.server.app.config.properties.gifReactions.splice(index, 1)
                    this.server.app.config.saveConfig()
                }
            } else {
                const index = this.server.app.config.properties.personalReactions[user].indexOf(gifToDelete)
                if (index > -1) {
                    this.server.app.config.properties.personalReactions[user].splice(index, 1)
                    this.server.app.config.saveConfig()
                }
            }

            res.status(200)
            res.send({success: true, message: 'Gif was deleted!'})
        } catch(e) {
            console.error(e.message)
            res.status(400)
            res.send({ success: false, message: 'Something went wrong :(' })
        }
    }

    getUsers(req, res) {
        try {
            res.status(200)
            res.send({ success: true, message: this.server.app.discord.users })
        } catch(e) {
            console.error(e.message)
            res.status(500)
            res.send({ success: false, message: 'Something welt wrong...' })
        }
    }

    getReactionChance(req, res) {
        try {
            const gifChance = this.server.app.config.properties.discord.gifReactionChance
            const personalGifChance = this.server.app.config.properties.discord.personalGifReactionChance
            res.status(200)
            res.send({ success: true, message: { gifChance, personalGifChance } })
        } catch(e) {
            console.error(e.message)
            res.status(500)
            res.send({ success: false, message: 'Internal server error.' })
        }
    }

    setReactionChance(req, res) {
        try {
            const { gifChance, type } = req.body
            if (!gifChance && !type) {
                res.status(400)
                res.send({ success: false, message: 'Personal or global gif chance is not specified!' })
                return
            }

            if (type === 'global') {
                this.server.app.config.properties.discord.gifReactionChance = gifChance
            } else {
                this.server.app.config.properties.discord.personalGifReactionChance = gifChance
            }

            res.status(201)
            res.send({ success: true, message: 'Chance updated!' })
        } catch(e) {
            console.error(e.message)
            res.status(500)
            res.send({ success: false, message: 'Internal server error.' })
        }
    }

    getWatchedAvatars(req, res) {
        try {
            const avatars = this.server.app.config.properties.avatarWatchList
            const ids = Object.keys(avatars)
            let refactoredAvatars = []
            ids.forEach((id) => {
                refactoredAvatars.push({ [id]: `https://cdn.discordapp.com/avatars/${id}/${avatars[id].avatar}?size=4096` })
            })
            res.status(200)
            res.send({ success: true, message: refactoredAvatars })
        } catch(e) {
            console.error(e.message)
            res.status(500)
            res.send({ success: false, message: 'Internal server error.' })
        }
    }

    getGifReactions(req, res) {
        try {
            const users = this.server.app.discord.users
            const gif = this.server.app.config.properties.gifReactions
            const personalGif = this.server.app.config.properties.personalReactions

            let restructuredPersonalGifs = {}
            for (const [key, value] of Object.entries(personalGif)) {
                const username = users[key.toString()]
                restructuredPersonalGifs[`${username}<>${key}`] = value
            }

            res.status(200)
            res.send({ success: true, message: { global: gif, personal: restructuredPersonalGifs } })
        } catch(e) {
            console.error(e.message)
            res.status(500)
            res.send({ success: false, message: 'Internal server error.' })
        }
    }

    addGifReaction(req, res) {
        const { url, user } = req.body
        if (!url || !user) {
            res.status(400)
            res.send({ success: false, message: 'Url or user is not specified.' })
            return
        }
        try {
            if (user === 'everyone') {
                this.server.app.config.properties.gifReactions.push(url)
                this.server.app.config.saveConfig()
                res.status(201)
                res.send({ success: true, message: 'Reaction added successfully!' })
                return
            }
            if (Object.hasOwn(this.server.app.config.properties.personalReactions, user)) {
                this.server.app.config.properties.personalReactions[user].push(url)
                this.server.app.config.saveConfig()
            } else {
                this.server.app.config.properties.personalReactions[user] = []
                this.server.app.config.properties.personalReactions[user].push(url)
                this.server.app.config.saveConfig()
            }
            res.status(201)
            res.send({ success: true, message: 'Reaction added successfully!' })
        } catch(e) {
            console.error(e.message)
            res.status(500)
            res.send({ success: false, message: 'Something welt wrong...' })
        }
    }
}

module.exports = expressRouter