const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const SMTP_CONFIG = require("../../smtp");
const log = console.log;
const projects = require('../models/portfolio');
const users = require('../models/Users');
const date = require('../utils/date');
const path = require('path');
// require('../../src/views')
const Home = {
  home(req, res) {
    res.status(200).send({
      profissional: "Ruan Pedro Mendes Ponteiro",
      cargo: "Web Developer FullStack Junior",
      empresa: "Callflex",
      data: date
    });
  },
};
const Portfolio = {
  sendPortfolio(req, res) {
    res.status(200).send(projects);
  },
};

const UserControllers = {
  showPerson(req, res) {
    res.status(200).send(users);
  },
  registerUser(req,res){
      users.push(req.query)
      res.status(200).send({
          msg:'cadastrado com sucesso',
          users
      });
  }
};

const EmailSender = {
  emailSender(req, res) {
    const transporter = nodemailer.createTransport({
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      secure: false,
      service: "Gmail",
      auth: {
        user: SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const handlebarsOptions = {
      viewEngine: 'express-handlebars',
      // viewPath: '../views',
      extName: ".handlebars"
    }
    transporter.use('compile', hbs(handlebarsOptions));

    let mailOptions = {
      from: "Ruan Dev <ruandev0699@gmail.com>",
      // to: users.map(data=>data.email),
      to: ["ruandev021@gmail.com", "ruanpmp@gmail.com"],
      subject: "Brabo Fala Tu",
      text: "TEXTO PARA CAMPANHA",
      // template: "index"
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        return log("Error occurs----->", err);
      }
      return log("Email sent!!!");
    });
    res.send(`Email Enviado com sucesso!`);
  },
};

module.exports = {
  Home,
  Portfolio,
  EmailSender,
  UserControllers
};
