require('dotenv/config')
const amqp = require('amqplib/callback_api');
const Push = require('./models/Push')
const utils = require('./utils')
const repository = require('./requests/repository')

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
        channel.consume(queue, async (msg) => {

            let mensagem = JSON.parse(msg.content.toString())


            console.log(mensagem)
            console.log('***********')

            const push = new Push(mensagem)
            const branch = push.branch

            console.log('Branch: ' + branch)


            if (branch === 'develop') {
                let modified = push.modified
                let added = push.added
                let sql = ''

                //Se existir o array modified, conferir se há  arquivo sql
                if (modified) sql = utils.checkSql(modified)

                //Se não tiver arquivo sql no modified e tiver arquivos no added, conferir added
                if (!sql && added) sql = utils.checkSql(added)

                console.log('Sql: ' + sql)

                //Se houver arquivo sql em algum dos arrays
                if (sql) {
                    const homologVersion = await repository.getHomologVersion(push.id)
                    const fileVersion = utils.getFileVersion(sql)

                    console.log('homologVersion: ' + homologVersion)
                    console.log('fileVersion: ' + fileVersion)

                    const checkVersions = utils.compareVersions(homologVersion, fileVersion)
                    console.log('check: ' + checkVersions)
                }
                else {
                    console.log('Arquivo .sql não foi modificado')
                }
            }
        }, {
            noAck: true
        });

    });
});
