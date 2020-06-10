require('dotenv/config')
const amqp = require('amqplib/callback_api');

console.log('aqui')

amqp.connect(process.env.AMQP_URL, function (err0, connection) {
    if (err0) throw err0;

    connection.createChannel(function (err1, channel) {

        if (err1) throw err1;

        const exchange = 'pje-dev-platform-exchange';
        const queue = 'dev-platform.push'
        const key = process.env.ROUTINGKEY
        let mensagem = {}

        channel.assertExchange(exchange, 'topic', { durable: true });
        channel.assertQueue(queue, { exclusive: false })
        channel.bindQueue(queue, exchange, key)


        channel.consume(queue, function (msg) {
            //  console.log(JSON.stringify(msg.content.toString()))
            mensagem = JSON.parse(msg.content.toString())
            console.log(mensagem.project.default_branch)
            var branch = mensagem.project.default_branch
            return branch

        }, {
            noAck: true
        });

    });
});

module.exports = branch

