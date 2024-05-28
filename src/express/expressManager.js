const express = require('express')
const cors = require('cors')
const expressRouter = require('./router')
require('dotenv').config()

class expressManager {
    constructor(app) {
        this.app = app
        this.server = express()
        this.configureRoutes()
    }

    configureRoutes() {
        const router = new expressRouter(this)
        this.server.use(express.json())
        this.server.use(cors())
        this.server.use(this.logger.bind(this))
        this.server.use(this.authCheck.bind(this))
        this.server.use('/', router.createRoutes()) 
        console.log('[express]: Routes configured!')
    }

    start() {
        this.server.listen(this.app.config.properties.express.port, () => {
            console.log(`[express]: Server started on port: ${this.app.config.properties.express.port}!`)
        })
    }

    logger(req, res, next) {
        console.log(`[express] New ${req.method} request for the route ${req.originalUrl}`)
        next()
    }

    authCheck(req, res, next) {
        const authToken = req.headers.authorization

        if (!authToken) {
            res.status(401)
            res.send({ success: false, message: 'Authorization failed.' })
            return
        }
        const token = authToken.split(' ')[1]

        if (token !== this.app.config.properties.express.secret) {
            res.status(403)
            res.send({ success: false, message: 'Auth failed.' })
            return
        }

        next()
    }


}

module.exports = expressManager