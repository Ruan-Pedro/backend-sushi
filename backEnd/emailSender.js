const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const SMTP_CONFIG = require('./smtp');
const log = console.log;
const path = require('path')
console.log(path.join(__dirname,'/src/views'),'FOON')
const transporter = nodemailer.createTransport({
    host:SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure:false,
    service:"Gmail",
    auth:{
        user:SMTP_CONFIG.user,
        pass:SMTP_CONFIG.pass
    },
    tls:{
        rejectUnauthorized:false
    }
});
transporter.use('compile', hbs({
    viewEngine:'express-handlebars',
    viewPath:path.join(__dirname,'/src/views')
}))

let mailOptions = {
    from: 'Ruan Dev <ruandev0699@gmail.com>', 
    // to: ["ruandev021@gmail.com", "ruanpmp@gmail.com"],/*,"elaine97carol@gmail.com","victoriamiola@gmail.com","lucascosta.lc1@gmail.com","guastavocruz@gmail.com","beatrizferim@gmail.com","nathalyabrasil5@gmail.com"], */
    to:'camilaarquitetura2018@gmail.com',
    subject: 'Brabo Fala Tu',
    text: 'RECEBA',
    template: 'index',
    context: {
        name: 'sim voce'
    } 
};

transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        return log('Error occurs----->', err);
    }
    return log('Email sent!!!');
});
