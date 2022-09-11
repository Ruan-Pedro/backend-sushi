const mongoose = require('mongoose');
let withdrawalReqSchema = new mongoose.Schema({
    menu: { type: String, required: true },
    idMenu : { type: Number, required: true },
    drink : { type: String },
    drinkId : { type: Number },
    client : { type: String, required: true },
    idClient : { type: Number, required: true },
    preparationTime : { type: Date, required: true },
    price : { type: Number, required: true },
    status : { type: String, default: 'em preparo' },
    paymentMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('WithdrawalReq',withdrawalReqSchema)