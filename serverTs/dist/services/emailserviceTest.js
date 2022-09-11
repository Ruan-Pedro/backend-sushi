"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// class EmailService {
//     sendEmail(to:IMailto, message:IMailMessage){
//         console.log(`email enviado  para ${to.name}: ${message.subject}`);
//     }
//Data Transfer Object (DDD)
class EmailService {
    sendEmail({ to, message }) {
        console.log(`email enviado  para ${to.name}: ${message.subject}`);
    }
}
exports.default = EmailService;
