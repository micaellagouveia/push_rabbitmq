
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err0, connection) {
    if (err0) throw error0;

    connection.createChannel(function (err1, channel) {
        if (err1) throw err1;

        const exchange = 'pje-dev-platform-exchange';

        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) { // q -> retorna uma json. q.queue -> nome da fila
            if (error2) {
                throw error2;
            }
            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            channel.consume(q.queue, function (msg) { //mensagem será enviada pela exchange e dps tratada 
                console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});