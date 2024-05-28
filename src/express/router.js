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
        //TODO personal responses
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
}

module.exports = expressRouter