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

        console.log(process.env.ROUTINGKEY)

        channel.assertExchange(exchange, 'topic', { durable: true });
        channel.assertQueue(queue, { exclusive: false })
        channel.bindQueue(queue, exchange, key)

        console.log('[*] Waiting messages')
        channel.prefetch(1) //define a quantidade de msg por vez
        channel.consume(queue, async (msg) => {

            let mensagem = JSON.parse(msg.content.toString())

            // verificar se há commits no push
            if (mensagem.commits.length > 0) {
                const push = new Push(mensagem)
                const branch = push.branch

                console.log('Branch: ' + branch)

                // verificação da branch
                if (branch.includes('develop')) {
                    const modified = push.modified
                    const added = push.added
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

                        // verifica se as versões são iguais
                        const checkVersions = utils.compareVersions(homologVersion, fileVersion)
                        console.log('check: ' + checkVersions)

                        // pega o path que o arquivo sql devera ir
                        const pathFile = utils.getPathFile(sql, homologVersion)

                        console.log('homologVersion: ' + sql)
                        console.log('pathFile: ' + pathFile)

                        if (checkVersions && push.id === 572) { // se as versões forem diferentes e coloquei a condição para o projeto do playground
                            
                            // move o arquivo para a pasta de homologação
                            const moveFile = await commits.moveFile(pathFile, sql, push.id)
                            console.log(moveFile)
                        }
                    }
                    else {
                        console.log('--- Arquivo .sql não foi modificado ---')
                    }
                } else {
                    console.log("--- Branch diferente da develop ---")
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

