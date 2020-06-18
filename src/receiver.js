/*require('dotenv/config')
const amqp = require('amqplib/callback_api');
const Push = require('./models/Push')
const utils = require('./utils')
const repository = require('./requests/repository')

amqp.connect(process.env.AMQP_URL, function (err0, connection) {
    if (err0) throw err0;

    connection.createChannel(function (err1, channel) {
        if (err1) throw err1;

        const exchange = 'pje-dev-platform-exchange';
        const queue = 'dev-platform.push'
        const key = process.env.ROUTINGKEY

        channel.assertExchange(exchange, 'topic', { durable: true });
        channel.assertQueue(queue, { exclusive: false })
        channel.bindQueue(queue, exchange, key)

        console.log('[*] Waiting messages')
        channel.consume(queue, function (msg) {

            let mensagem = JSON.parse(msg.content.toString())


            console.log(mensagem)
            console.log('***********')

            const push = new Push(mensagem)

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

               /* if (path) {
                    //tenho que tratar o path para ficar na pasta certa para achar as versões
                    console.log('*********  Arquivo SQL modificado  ***********')
                    const version = repository.getHomologVersion(push.id, path/* PATH TEM QUE ESTAR JA CERTO)
                    console.log(version)
                }*//*
            }

        }, {
            noAck: true
        });

    });
});

*/
