const { Router } = require('express')

class expressRouter {
    constructor(server) {
        this.server = server
    }

    createRoutes() {
        const routes = Router()

        //get
        routes.get('/helloworld', this.helloWorld.bind(this))
        routes.get('/gifReaction')
        //TODO watched avatars
        //TODO reaction emojis
        
        //post
        //TODO gif reactions
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

    getGifReactions() {

    }

    addGifReaction(req, res) {
        const { url, user } = req.body
        if (!url || !user) {
            res.status(400)
            res.send({ success: false, message: 'Url or user is not specified.' })
        }
        if (user === 'everyone') {
            this.server.app.config.properties.gifReactions.push(url)
            this.server.app.config.properties.saveConfig()
            res.status(201)
            res.send({ success: true, message: 'Reaction added successfully!' })
            return
        }
        this.server.app.config.properties.personalReactions[user].push(url)
        this.server.app.config.properties.saveConfig()
    }
}

module.exports = expressRouter