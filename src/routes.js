const routes = require('express').Router()

routes.get('/', (req, res) => {
    return res.json({ Hello: "World" })
})

module.exports = routes