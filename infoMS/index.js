//step 1 : Connect to the rabbitMQ server
//step 2 : create a new channel
//step 3 : create the exchange
//step 4 : Create the queue
//step 5 : Bind the queue to the exchange
//step 6 : Consume messages from the queue
const express = require('express');
const app = express();
const amqp = require('amqplib');
const routes = require('./src/routes')

app.use('/', routes);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// async function consumeMessages() {
//     const connection = await amqp.connect('amqp://devweb:pedro0699@localhost/devweb');
//     const channel = await connection.createChannel();

//     await channel.assertExchange("dataExchange", "direct");

//     const queue = await channel.assertQueue("dataQueue");

//     await channel.bindQueue(queue.queue, "dataExchange", "User");
//     await channel.bindQueue(queue.queue, "dataExchange", "Data");

//     channel.consume(queue.queue, (msg) => {
//         const data = JSON.parse(msg.content);
//         console.log(data.dataDetails);
//         channel.ack(msg);
//     });
// }

app.listen(3031, () => {
    console.log("[HTTP] Server running on port 3031");
})


