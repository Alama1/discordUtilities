const { Router } = require('express')

class expressRouter {
    constructor(server) {
        this.server = server
    }

    createRoutes() {
        const routes = Router()

        //get
        routes.get('/helloworld', this.helloWorld.bind(this))
        routes.get('/gifReaction', this.getGifReactions.bind(this))
        routes.get('/avatarWatchList', this.getWatchedAvatars.bind(this))
        routes.get('/reactionChance', this.getReactionChance.bind(this))
        
        //post
        routes.post('/gifReaction', this.addGifReaction.bind(this))
        routes.post('/reactionChance', this.setReactionChance.bind(this))
        //TODO change bot avatar

        //put

        //delete
        //TODO personal responses
        //TODO gif reactions
        return routes
    }

    helloWorld(req, res) {
        res.status(200)
        res.send({ success: true, message: 'Hello!' })
    }

    getReactionChance(req, res) {
        try {
            const gifChance = this.server.app.config.properties.discord.gifReactionChance
            const personalGifChance = this.server.app.config.properties.discord.personalGifReactionChance
            res.status(200)
            res.send({ success: true, message: { gifChance, personalGifChance } })
        } catch(e) {
            res.status(500)
            res.send({ success: false, message: 'Internal server error.' })
        }
    }

    setReactionChance(req, res) {
        try {
            const { gifChance, personalGifChance } = req.body
            if (!gifChance && !personalGifChance) {
                res.status(400)
                res.send({ success: false, message: 'Personal or global gif chance is not specified!' })
                return
            }

            if (gifChance) {
                this.server.app.config.properties.discord.gifReactionChance = gifChance
            }

            if (personalGifChance) {
                this.server.app.config.properties.discord.personalGifReactionChance = personalGifChance
            }

            res.status(201)
            res.send({ success: true, message: 'Chance updated!' })
        } catch(e) {
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
            res.status(500)
            res.send({ success: false, message: 'Internal server error.' })
        }
    }

    getGifReactions(req, res) {
        try {
            const gif = this.server.app.config.properties.gifReactions
            const personalGif = this.server.app.config.properties.personalReactions
            res.status(200)
            res.send({ success: true, message: { global: gif, personal: personalGif } })
        } catch(e) {
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
            console.log(e)
            res.status(500)
            res.send({ success: false, message: 'Something welt wrong...' })
        }
        
    }
}

module.exports = expressRouter