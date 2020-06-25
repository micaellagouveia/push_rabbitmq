const routes = require('express').Router()
const receiver = require('./receiver.js')
const Push = require('./models/Push')
const utils = require('./utils')
const repository = require('./requests/repository')

routes.get('/', (req, res) => {
    return res.json({ Hello: "World" })
})

routes.post('/rabbitmq', async (req, res) => {

    if (req.body.commits.length < 1) {
        return res.send('Não foram feitos commits')
    }

    const push = new Push(req.body)

    const branch = push.branch
    let modified = ''
    let added = ''

    if (push.commit) {
        modified = push.modified
        added = push.added
    }

    if (branch === 'develop') {
        let sql = ''

        if (!push.commit) {
            return res.send('Não foram feitos commits')
        }
        //Se existir o array modified, conferir se há  arquivo sql
        if (modified) sql = utils.checkSql(modified)

        //Se não tiver arquivo sql no modified e tiver arquivos no added, conferir added
        if (!sql && added) sql = utils.checkSql(added)

        console.log('Sql: ' + sql)

        //Se houver arquivo sql em algum dos arrays
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