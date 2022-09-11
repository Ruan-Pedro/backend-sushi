const mongoose = require('mongoose');
let moment = require('moment-timezone');
let date = moment.tz('America/Sao_Paulo').format('MMMM Do YYYY, h:mm:ss a');

let deliveryReqSchema = new mongoose.Schema({
    type: { type: String, required: true }, // delivery || withdrawal
    menu: { type: [String], /*required: true*/ },
    menuId: { type: [String], required: true },
    client: { type: String, /*required: true */},
    clientId: { type: String, required: true },
    preparationTime: { type: Date /*, required: true*/ },
    price: { type: Number, required: true },
    status: { type: String, default: 'confirmação' }, //confirmação , em preparo, pronto para entrega, entregue
    tax: { type: Number, default: 0 },
    deliveryManId: { type: String },
    paymentMethod: { type: [String], required: true },
    address: { type: String, default: 'Restaurante' },
    createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Requests', deliveryReqSchema);

//endereço deve ser trocado para RUA + NUMERO + BAIRRO + CIDADE