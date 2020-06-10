
require('dotenv/config'); 
const amqp = require('amqplib/callback_api');

amqp.connect("amqp://pje-dev:CkbSeTOm6wmt@mq.stg.cnj.cloud/pje-dev-platform", function (err0, connection) {
    if (err0) throw err0;

    console.log(process.env.AMQP_URL)
    console.log('conectado')

    connection.createChannel(function (err1, channel) {
        
        if (err1) throw err1;

        const exchange = 'pje-dev-platform-exchange';
        const queue = 'dev-platform.push'
        const key = "dev-platform.gitlab.PUSH"

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

        channel.consume(queue, function (msg) { //mensagem será enviada pela exchange e dps tratada 
            console.log(msg.content.toString())
        }, {
            noAck: true
        });
    });
});