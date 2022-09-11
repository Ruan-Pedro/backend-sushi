import { Request, Response } from "express";
import EmailService from "../services/emailserviceTest";
const users = [
    { name: 'ruan', email: 'ruanpmp@gmail.com' },
    { name: 'ruandev', email: 'ruandev021@gmail.com' }
]
export default {

    async index(req: Request, res: Response) {
        return res.status(200).send({ data: users })
    },

    async create(req: Request, res: Response) {
        const emailService = new EmailService;
        emailService.sendEmail({ 
            to: {
                name: users[0].name,
                email: users[0].email
            },
            message:
            {
                subject: 'inclusão ao sistema',
                body: 'Bem vindo ao sistema'
            }
        })
        return res.status(200).send({ data: users[0] })
    }
}