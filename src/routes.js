const routes = require('express').Router()
const receiver = require('./receiver.js')
const Push = require('./models/Push')
const utils = require('./utils')
const repository = require('./requests/repository')

routes.get('/', (req, res) => {
    return res.json({ Hello: "World" })
})

routes.post('/rabbitmq', async (req, res) => {

    const push = new Push(req.body)

    const branch = push.branch
    let modified = push.modified
    let added = push.added

    // console.log('Branch: ' + branch)

    if (branch === 'develop') {
        /*console.log('MODIFIED')
        console.log(modified)
        console.log('ADDED')
        console.log(added)*/

        const sql = utils.checkSql(modified, added)
        console.log(sql)

       if (sql) {
            const homologVersion = await repository.getHomologVersion(push.id)
            
            const fileVersion = utils.getFileVersion(sql)
            const checkVersions = utils.compareVersions(homologVersion, fileVersion)
            return res.send(checkVersions)
        }
        return res.send('Arquivo .sql não foi modificado')

    }
    return res.send('Branch develop não está sendo requisitada.')

})


module.exports = routes