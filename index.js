'use strict'
global.__base = __dirname + '/';
const app = require('./src/Application')

app
    .register()
    .then(() => {
        app.init()
    })