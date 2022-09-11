const qr = require('qr-image');
const datax = require('../../index');
const amqp = require('amqplib');
let data = {};

const urlQrCodeRedirect = async (req,res) =>{
    const url = `https://github.com/${data.message}`
    const code = qr.image(url, {type: 'svg'});
    res.type('svg');
    code.pipe(res);
}

const consumeMessages = async (req,res) => {
    const connection = await amqp.connect('amqp://devweb:pedro0699@localhost/devweb');
    const channel = await connection.createChannel();

    await channel.assertExchange("dataExchange", "direct");

    const queue = await channel.assertQueue("dataQueue");

    await channel.bindQueue(queue.queue, "dataExchange", "User");
    await channel.bindQueue(queue.queue, "dataExchange", "Data");

    channel.consume(queue.queue, (msg) => {
        const dataConsumed = JSON.parse(msg.content);
        console.log(dataConsumed.dataDetails);
        data = dataConsumed.dataDetails;
        channel.ack(msg);
        res.status(200).send({data:dataConsumed.dataDetails});
    });
}

module.exports = {
    urlQrCodeRedirect,
    consumeMessages
}