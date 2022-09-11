//rabbitmq producer class
const Producer = require('../../producer');
const producer = new Producer();

const dataPubliser = async (req, res, next) => {
    await producer.publishMessage(req.body.dataType, req.body.username);
    res.status(200).send({msg: `email enviado: ${req.body.username}`});
}

module.exports = {
    dataPubliser   
}