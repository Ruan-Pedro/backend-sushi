const mongoose = require('mongoose');
let clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cpf: { type: Number, required: false },
  status : { type: Boolean, default:true },
  createdAt: { type: String, default: Date.now }
})
module.exports = mongoose.model('Client', clientSchema);