require('dotenv/config')
const amqp = require('amqplib/callback_api');

amqp.connect(process.env.AMQP_URL, function (err0, connection) {
    if (err0) throw err0;

    console.log(process.env.AMQP_URL)
    console.log('conectado')

    connection.createChannel(function (err1, channel) {
        
        if (err1) throw err1;

        const exchange = 'pje-dev-platform-exchange';
        const queue = 'dev-platform.push'
        const key = process.env.ROUTINGKEY

        console.log(key)
        console.log('canal criado')

        channel.assertExchange(exchange, 'topic', {
            durable: true
        });
        console.log('exchange ok')

        channel.assertQueue(queue, { exclusive: false })

        console.log('queue criada')

        channel.bindQueue(queue, exchange, key)

        console.log('bind')

        channel.consume(queue, function (msg) {
            console.log(msg.content.toString())
        }, {
            noAck: true
        });
    });
});
