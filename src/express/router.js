const { Router } = require('express')

class expressRouter {
    constructor(server) {
        this.server = server
    }

    createRoutes() {
        const routes = Router()

        //get
        routes.get('/helloworld', this.helloWorld.bind(this))
        routes.get('/')
        //post

        //put

        //delete

        return routes
    }

    helloWorld(req, res) {
        res.status(200)
        res.send({ success: true, message: 'Hello!' })
    }
}

module.exports = expressRouter