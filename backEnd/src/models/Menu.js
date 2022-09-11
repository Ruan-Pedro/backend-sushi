const mongoose = require('mongoose');
let moment = require('moment-timezone');
let date = moment.tz('America/Sao_Paulo').format('MMMM Do YYYY, h:mm:ss a');

let menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: { type: String, required: false },
    subtitle: { type: String, required: false },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: Boolean, default: true },
    url_image: { type: String, default:"https://rafaturis.com.br/wp-content/uploads/2014/01/default-placeholder.png" },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Menu', menuSchema);