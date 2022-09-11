interface IMailto {
    name: string,
    email: string
}
interface IMailMessage {
    subject: string,
    body: string,
    attachment ?: string[]; // Array de arquivos por exemplo
}
interface MessageDTO {
    to: IMailto;
    message: IMailMessage;
}

// class EmailService {
//     sendEmail(to:IMailto, message:IMailMessage){
//         console.log(`email enviado  para ${to.name}: ${message.subject}`);
//     }
    //Data Transfer Object (DDD)
class EmailService {
    sendEmail({ to, message }: MessageDTO) {
        console.log(`email enviado  para ${to.name}: ${message.subject}`);
    }
}
export default EmailService;