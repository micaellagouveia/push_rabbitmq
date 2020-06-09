
const amqp = require('amqplib/callback_api');

amqp.connect(process.env.AMQP_URL, function (err0, connection) {
    if (err0) throw err0;

    console.log('conectado')

    connection.createChannel(function (err1, channel) {
        
        if (err1) throw err1;

        const exchange = 'pje-dev-platform-exchange';
        const queue = 'dev-platform.push'
        const key = process.env.ROUTINGKEY

        console.log('canal criado')

        channel.assertExchange(exchange, 'topic', {
            durable: false
        });
        console.log('exchange ok')

        channel.assertQueue(queue, { exclusive: true })

        console.log('queue criada')

        channel.bindQueue(queue, exchange, key)

        console.log('bind')

       /* channel.consume(q.queue, function (msg) { //mensagem será enviada pela exchange e dps tratada 
            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
        }, {
            noAck: true
        });*/
    });
});