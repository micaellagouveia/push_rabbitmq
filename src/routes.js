const routes = require('express').Router()
const receiver = require('./receiver.js')
const Push = require('./models/Push')
const utils = require('./utils')
const repository = require('./requests/repository')

routes.get('/', (req, res) => {
    return res.json({ Hello: "World" })
})

routes.post('/rabbitmq', (req, res) => {

    console.log(req.body)
    console.log('***********')

    const push = new Push(req.body)

    const branch = push.branch
    let modified = push.modified
    let added = push.added

    console.log('Branch: ' + branch)

    if (branch === 'develop') {
        console.log('MODIFIED')
        console.log(modified)
        console.log('ADDED')
        console.log(added)

        const sql = utils.checkSql(modified, added)
        

        console.log('PATH')
        console.log(sql)

        const path = utils.getPath(sql)
        console.log(path)

        if (path) {
            //tenho que tratar o path para ficar na pasta certa para achar as versões
            console.log('*********  Arquivo SQL modificado  ***********')
            const version = repository.getHomologVersion(push.id, path)
            console.log(version)
            return res.json(version)
        }

        
    }

})


module.exports = routes