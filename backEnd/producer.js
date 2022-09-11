const amqp = require('amqplib');
const config = require('./rabbitMQconfig');
class Producer {
    channel;
    async createChannel() {
        const connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey, message) {
        if (!this.channel) {
            await this.createChannel();
        }
        const exchangeName = config.rabbitMQ.exchangeName;
        await this.channel.assertExchange(exchangeName, "direct");

        const dataDetails = {
            dataType: routingKey,
            message,
            dateTime: new Date()
        }
        await this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(
                JSON.stringify({ dataDetails }))
        );
        console.log(`The message ${message} is send to exchange "${exchangeName}"`);
    }
}
module.exports = Producer;