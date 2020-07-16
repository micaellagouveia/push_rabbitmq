const routes = require('express').Router()
const receiver = require('./receiver.js')
const Push = require('./models/Push')
const utils = require('./utils')
const repository = require('./requests/repository')
const commits = require('./requests/commits')

routes.get('/', (req, res) => {
    return res.json({ Hello: "World" })
})

routes.post('/rabbitmq', async (req, res) => {

    if (req.body.commits.length < 1) {
        return res.send('Não foram feitos commits')
    }

    const push = new Push(req.body)

    const branch = push.branch
    const modified = push.modified
    const added = push.added

    // Verificar se a branch é a develop
    if (branch.includes('develop')) {
        let sql = ''

        //Se existir o array modified, conferir se há  arquivo sql
        if (modified) sql = utils.checkSql(modified)

        //Se não tiver arquivo sql no modified e tiver arquivos no added, conferir added
        if (!sql && added) sql = utils.checkSql(added)

        console.log('Sql: ' + sql)

        //Se houver arquivo sql em algum dos arrays
        if (sql) {
            // pega as versões de script e de homologação
            const homologVersion = await repository.getHomologVersion(push.id)
            console.log('homolog: ' + homologVersion)
            const fileVersion = utils.getFileVersion(sql)

            // verifica se as versões são iguais
            const checkVersions = utils.compareVersions(homologVersion, fileVersion)

            // pega o path que o arquivo sql devera ir
            const pathFile = utils.getPathFile(sql, homologVersion)

            // move o arquivo para a pasta de homologação
            const moveFile = await commits.moveFile(pathFile, sql, push.id)
            console.log(moveFile)

            return res.send(moveFile)
        }
        return res.send('Arquivo .sql não foi modificado')
    }
    return res.send('Branch develop não está sendo requisitada.')

})

module.exports = routes