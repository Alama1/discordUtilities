'use strict'

const app = require('./src/Application')

app
    .register()
    .then(() => {
        app.init()
    })