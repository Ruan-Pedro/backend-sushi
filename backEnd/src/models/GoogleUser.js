const mongoose = require('mongoose');
const joi = require('joi');

let googleUserSchema = new mongoose.Schema({
  name: { type: String, require: true, minlength: 3, maxlength: 50 },
  username: { type: String, require: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, minlength: 6, maxlength: 100 },
  address: { type: String },
  phone : { type: Number },
  available : { type: Boolean }, // depois fazer uma validação de token, se não estiver expirado o usuario está logado
  privilege: { type: String, default: 'cliente' },
  status: { type: Boolean, default: true },// cliente ativo ou inativo
  profile_img: { type: String, default:"https://media.istockphoto.com/vectors/male-profile-flat-blue-simple-icon-with-long-shadow-vector-id522855255?b=1&k=20&m=522855255&s=612x612&w=0&h=hU2lBVV4_3z5K3V-KhnoAausfOx8zcHAgHkHz6sB3Jk=" },
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('GoogleUsers', googleUserSchema);
