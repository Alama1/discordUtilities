'use strict'

const app = require('./Application')

app
    .register()
    .then(() => {
        app.init()
    })