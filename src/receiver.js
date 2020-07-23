require('dotenv/config')
const amqp = require('amqplib/callback_api');
const Push = require('./models/Push')
const utils = require('./utils')
const repository = require('./requests/repository')
const commits = require('./requests/commits')

amqp.connect(process.env.AMQP_URL, async (err0, connection) => {
    if (err0) throw err0;

    connection.createChannel(async (err1, channel) => {
        if (err1) throw err1;

        const exchange = 'pje-dev-platform-exchange';
        const queue = 'dev-platform.push'
        const key = process.env.ROUTINGKEY

        channel.assertExchange(exchange, 'topic', { durable: true });
        channel.assertQueue(queue, { exclusive: false })
        channel.bindQueue(queue, exchange, key)

        console.log('[*] Waiting messages')
        channel.prefetch(1) //define a quantidade de msg por vez
        channel.consume(queue, async (msg) => {

            const mensagem = JSON.parse(msg.content.toString())

            // verificar se há commits no push
            if (mensagem.commits.length > 0) {
                const push = new Push(mensagem)
                const branch = push.branch

                // verificação da branch
                if (branch.includes('develop')) {
                    const modified = push.modified
                    const added = push.added
                    let sql = ''

                    //Se existir o array modified, conferir se há  arquivo sql
                    if (modified) sql = utils.checkSql(modified)

                    //Se não tiver arquivo sql no modified e tiver arquivos no added, conferir added
                    if (!sql && added) sql = utils.checkSql(added)

                    //Se houver arquivo sql em algum dos arrays
                    if (sql) {
                        // pega as versões de script e de homologação
                        const homologVersion = await repository.getHomologVersion(push.id)
                        const fileVersion = utils.getFileVersion(sql)

                        // verifica se as versões são iguais
                        const checkVersions = utils.compareVersions(homologVersion, fileVersion)
                        console.log('Houve mudanças no arquivo .sql')
                        console.log('check: ' + checkVersions)

                        if (checkVersions) {

                            console.log('Versão de arquivo .sql difere da versão de homologação')

                            // pega caminho para fazer o get do file da pasta de homologação
                            const fileTree = utils.getFileTree(sql, homologVersion)
                            console.log('pathTree: ' + fileTree)

                            // faz a requisição dos arquivos dentro da pasta de homologação
                            const homologFile = await repository.getHomologFile(push.id, fileTree)

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
                            console.log('pathfile: ' + pathFile)

                            // move o arquivo para a pasta de homologação
                            if (push.id === 572) {
                                console.log('Projeto Playground -> posso mover arquivos')
                                const moveFile = await commits.moveFile(pathFile, sql, push.id)
                                console.log('move file status:')
                                console.log(moveFile)

                            }
                        }
                    }
                    else {
                        console.log('--- Arquivo .sql não foi modificado ---')
                    }
                } else {
                    console.log("--- Branch diferente da develop : " + branch)
                }
            } else {
                console.log('--- Não foram feitos commits ---')
            }

            //confirmação da análise, pronto para fazer a próxima
            channel.ack(msg)
            console.log('[x] Done')
        }, {
            noAck: false
        });
    });
});
