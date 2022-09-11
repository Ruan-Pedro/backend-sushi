const mongoose = require('mongoose');
let deliveryReqSchema = new mongoose.Schema({
    menu: { type: String, required: true },
    menuId: { type: Number, required: true },
    drink : { type: String },
    drinkId : { type: Number },
    client: { type: String, required: true },
    clientId: { type: Number, required: true },
    preparationTime: { type: Date, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: 'em preparo' },
    deliveryMan: { type: String, required: true },
    deliveryManId: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})
// module.exports = mongoose.model('DeliveryReq', deliveryReqSchema)

//endereço deve ser trocado para RUA + NUMERO + BAIRRO + CIDADE