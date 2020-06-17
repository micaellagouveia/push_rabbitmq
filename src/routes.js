const routes = require('express').Router()
const receiver = require('./receiver.js')

routes.get('/', (req, res) => {
    return res.json({ Hello: "World" })
})

routes.get('/rabbitmq', (req, res) => {
    const msg = receiver 

    console.log('MENSAGEM NA ROTA **********')
    console.log(msg)
    //console.log(msg.project.default_branch)
    return res.json(msg)
})


module.exports = routes