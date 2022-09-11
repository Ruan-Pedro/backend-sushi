const mongoose = require('mongoose');
const joi = require('joi');
let moment = require('moment-timezone');
let date = moment.tz('America/Sao_Paulo').format('MMMM Do YYYY, h:mm:ss a');

let userSchema = new mongoose.Schema({
  name: { type: String, require: true, minlength: 3, maxlength: 50 },
  username: { type: String, require: true, minlength: 3, maxlength: 50 },
  cpf: { type: Number, unique:true, lowercase:true,required: false },
  email: { type: String, required: true, minlength: 6, maxlength: 100 },
  password: { type: String, select:false,required: true, minlength: 6, maxlength: 200 },
  address: { type: String },
  cellphone : { type: Number },
  available : { type: Boolean }, // depois fazer uma validação de token, se não estiver expirado o usuario está logado
  privilege: { type: String, default: 'cliente' },
  status: { type: Boolean, default: true },
  profile_img: { type: String, default:"https://media.istockphoto.com/vectors/male-profile-flat-blue-simple-icon-with-long-shadow-vector-id522855255?b=1&k=20&m=522855255&s=612x612&w=0&h=hU2lBVV4_3z5K3V-KhnoAausfOx8zcHAgHkHz6sB3Jk=" },
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('User', userSchema);

//endereço deve ser trocado para RUA + NUMERO + BAIRRO + CIDADE

// const validate = (user) => {
//   const schema = joi.object({
//     name: joi.string().required().min(3).max(50),
//     email: joi.string().required().min(6).max(100),
//     password = joi.string().required().min(6).max(200),
//     cpf = joi.number()
//   })
// }





    // "ruandev021@gmail.com",
    // "ruanpmp@gmail.com",
    // "brunobinocencio@gmail.com"
    // "stefania.moreno4269@gmail.com",
    // "Mauricio.strato2@gmail.com",
    // "mauricio.strato2@gmail.com"
    // "alziranazaresud@gmail.com"
/*,"elaine97carol@gmail.com","victoriamiola@gmail.com","lucascosta.lc1@gmail.com","guastavocruz@gmail.com","beatrizferim@gmail.com","nathalyabrasil5@gmail.com"], */
