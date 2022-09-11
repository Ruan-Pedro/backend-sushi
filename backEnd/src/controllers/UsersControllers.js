const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const date = require('../utils/date');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const SMTP_CONFIG = require('../../smtp');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { setRedis, getRedis } = require('../redisConfig');
let moment = require('moment-timezone');
let dateNow = moment.tz('America/Sao_Paulo').format('MMMM Do YYYY, h:mm:ss a');

const login = async (req, res) => {
  const selectedUser = await User.findOne({ email: req.body.email }).select('+password');
  if (!selectedUser) res.status(404).send({ error: "Email or password not found" });

  const userAndPassMatch = bcrypt.compareSync(req.body.password, selectedUser.password);
  if (!userAndPassMatch) res.status(401).send({ error: "Email or password not found" });

  const token = jwt.sign({ id: selectedUser._id, username: selectedUser.username, privilege: selectedUser.privilege }, process.env.TOKEN_SECRET, { expiresIn: 60 * 15 });

  try {
    //cache user
    await setRedis(`user-${selectedUser._id}`, JSON.stringify(selectedUser), 60 * 15);
    return res.status(200).send({
      msg: "User logged successfully",
      logged: dateNow,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
}

const forgotPassword = async (req, res) => {
  const selectedUser = await User.findOne({ email: req.body.email }).select('+password');
  if (!selectedUser) res.status(404).send({ error: "Email or password not found" });

  try {
    const newPassword = crypto.randomBytes(4).toString('HEX');

    const transporter = nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: false,
      service: "Gmail",
      auth: { user: SMTP_CONFIG.user, pass: SMTP_CONFIG.pass },
      tls: { rejectUnauthorized: false }
    });

    const handlebarsOptions = {
      viewEngine: 'express-handlebars',
      viewPath: path.join(path.dirname(__dirname), '/views')
    }
    transporter.use('compile', hbs(handlebarsOptions));

    transporter.sendMail({
      from: 'Ruan Dev <ruandev0699@gmail.com>',
      to: selectedUser.email,/*,"elaine97carol@gmail.com","victoriamiola@gmail.com","lucascosta.lc1@gmail.com","guastavocruz@gmail.com","beatrizferim@gmail.com","nathalyabrasil5@gmail.com"], */
      subject: 'Password Recovery',
      text: 'password recovering',
      template: "index"
      // html: `<p>Aqui está sua nova senha para acessar o sistema: ${newPassword}</p> <br><a href="http://localhost:3030/">Sistema</a>`,
    }).then(() => {
      let userUpdated = User.findOneAndUpdate({ email: req.body.email }, { password: bcrypt.hashSync(newPassword, 10) })
        .then((user) => {
          userUpdated = User.findOne({ email: req.body.email });
          return res.status(200).send({ msg: 'Email sended', user });
        }).catch(() => { return res.status(404).send({ msg: 'Email not Found' }) })
    }).catch(() => { return res.status(404).send({ msg: 'Fail to send email' }) })

  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ error: "Internal Error" });
  }
}

const getProfile = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(404).send({ error: 'User not found' });
  try {
    console.time();

    let user = {};
    const userRedis = await getRedis(`user-${userId}`);
    userRedis ? user = JSON.parse(userRedis) : user = await User.findById(userId);
    console.timeEnd();
    return res.status(200).send({
      data: user
    })

  } catch (error) {
    console.error(error);
    return res.status(404).send({ error: 'Profile not found' });
  }

}

const getUsers = async (req, res) => {
  if (!req.headers.authorization) return res.status(401).send({ error: "Acess Denied" });

  switch (req.user.privilege) {
    case 'cliente':
      return res.status(401).send({ error: "Acess Denied" });
      break;
    case 'operador':
    case 'admin':
      try {
        let users = await User.find(req.query);
        if (!users) res.status(404).send({ error: "Users not found" });

        return res.status(200).send({ data: users });
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Error" });
      }
      break;
  }
}
const getUserById = async (req, res) => {
  if (!req.headers.authorization) return res.status(401).send({ error: "Acess Denied" });
  switch (req.user.privilege) {
    case 'cliente':
      return res.status(401).send({ error: "Acess Denied" });

    case 'operador' || 'admin':
      const id = req.params.id;
      if (!id) id = req.body.id;
      try {
        let user = await User.findById(req.params.id);
        if (!user) res.status(404).send({ msg: "User not found" });
        return res.status(200).json({ data: user });
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Error" })
      }
  }
}
const getUser = async (req, res) => {
  switch (req.user.privilege) {
    case 'cliente':
      return res.status(401).send({ error: "Acess Denied" });

    case 'operador' || 'admin':
      let query = req.query;
      try {
        let users = await User.find(query);
        if (!users) res.status(404).send({ msg: "User not found" });
        return res.status(200).send({ data: users });
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Error" })
      }
  }
}
const registerUser = async (req, res) => {

  const selectedUser = await User.findOne({ email: req.body.email, cpf: req.body.cpf });
  if (selectedUser) return res.status(400).send({ error: "Email already exists" });
  if ((req.user.privilege != 'admin' || req.user.privilege != 'operador') && (req.body.privilege != 'admin' || req.body.privilege != 'operador')) return res.status(401).send({ error: "privilegio apenas: 'cliente' ou 'entregador'" });

  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    cpf: req.body.cpf,
    privilege: req.body.privilege,
    password: bcrypt.hashSync(req.body.password)
  });

  try {
    const savedUser = await user.save();
    if (!savedUser) return res.status(500).send({ error: "Internal Error" });

    return res.status(201).send(savedUser);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ error: 'Validation Fields' });
  }


}
const updateUser = async (req, res) => {
  if (!req.headers.authorization) return res.status(401).send({ error: "Acess Denied" });
  switch (req.user.privilege) { 
    case 'cliente':
    case 'entregador':
      try {
        if (req.body.privilege == 'admin' || req.body.privilege == 'operador') return res.status(401).send({ error: "privilegio apenas: 'cliente' ou 'entregador'" });
        if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password);
        let user = await User.findByIdAndUpdate(req.user.id, req.body);
        if (!user) res.status(404).send({ msg: "User not found" });
        return res.status(200).send({ data: user });
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Error" });
      }

    case 'operador':
    case 'admin':
      try {
        if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password);
        let user = await User.findByIdAndUpdate(req.params.id, req.body);
        // user = await User.findById(req.params.id);
        if (!user) res.status(404).send({ msg: "User not found" });
        res.status(200).send({ data: user });
      } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Error" });
      }
  }
}
const setStatus = async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) res.status(404).send({ msg: "User not found" });

  if (req.user.privilege == 'operador' || req.user.privilege == 'admin') {
    try {
      const userUpdated = await User.findByIdAndUpdate(req.params.id, { status: !user.status });
      if (!userUpdated) res.status(404).send({ msg: "Fail in update User" });
      return res.status(200).send({ data: userUpdated });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Internal Error" });
    }
  } else {
    return res.status(401).send({ error: "Acess Denied" });
  }

}

const teste = async (req, res) => {
  // const password = "123456";
  // const salt = bcrypt.genSaltSync(15);
  // const cryptPass = bcrypt.hashSync(password,salt);
  // const savedPass = "$2a$15$X1dR2kBqC65bVSvSqbffgOzyYmsEHBderJIZGZs4Zjxoy8EPmE3QG"

  const user = {
    id: req.body.id,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  }
  const secret = process.env.TOKEN_SECRET;
  // const token = jwt.sign({ id:user.id,email:user.email,username:user.email }, secret, {expiresIn:1000})
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwODAwNTE1NDYzIiwiZW1haWwiOiJydWFucG1wQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoicnVhbnBtcEBnbWFpbC5jb20iLCJpYXQiOjE2NTYzNjcwMDMsImV4cCI6MTY1NjM2ODAwM30.kuGfXn3f1LsyWq2YDEuaMR_rEm5bQOHlXesq1bLmJJI"
  const validData = jwt.verify(token, secret)
  try {
    // console.log(bcrypt.compareSync(password,savedPass));
    // res.status(200).send(bcrypt.compareSync(password,savedPass));
    // res.status(200).send(cryptPass);
    // res.status(200).send(token);
    res.status(200).send(validData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Validation Fields' });
  }
}

module.exports = {
  login,
  forgotPassword,
  getUsers,
  getProfile,
  getUserById,
  getUser,
  registerUser,
  updateUser,
  setStatus,
  teste
}