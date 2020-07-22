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
            const fileVersion = utils.getFileVersion(sql)

            console.log('file version: ' + fileVersion)
            console.log('homolog version: ' + homologVersion)

            // verifica se as versões são iguais
            const checkVersions = utils.compareVersions(homologVersion, fileVersion)

            if (checkVersions) {

                // pega caminho para fazer o get do file da pasta de homologação
                const fileTree = utils.getFileTree(sql, homologVersion)
                console.log('pathTree: ' + fileTree)

                // faz a requisição dos arquivos dentro da pasta de homologação
                const homologFile = await repository.getHomologFile(push.id, fileTree)

                console.log(homologFile.length)

                let arrayFiles = []

                // array com os nomes dos arquivos da pasta de homologação
                for (let i in homologFile) {
                    arrayFiles[i] = homologFile[i].name
                }

                console.log(arrayFiles)

                // pegar o último número para adicionar no nome do arquivo que será movido
                const lastNumber = utils.lastNumber(arrayFiles)
                console.log(lastNumber)

                
                // pega o path que o arquivo sql devera ir com seu novo nome
                const pathFile = utils.getPathFile(sql, homologVersion, lastNumber)

                // move o arquivo para a pasta de homologação
                /*  const moveFile = await commits.moveFile(pathFile, sql, push.id)
                  console.log('move file status:')
                  console.log(moveFile)
      */
                return res.send(pathFile)
            }


        }
        return res.send('Arquivo .sql não foi modificado')
    }
    return res.send('Branch develop não está sendo requisitada.')

})

module.exports = routes