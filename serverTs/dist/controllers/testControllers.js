"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emailserviceTest_1 = __importDefault(require("../services/emailserviceTest"));
const users = [
    { name: 'ruan', email: 'ruanpmp@gmail.com' },
    { name: 'ruandev', email: 'ruandev021@gmail.com' }
];
exports.default = {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).send({ data: users });
        });
    },
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailService = new emailserviceTest_1.default;
            emailService.sendEmail({
                to: {
                    name: users[0].name,
                    email: users[0].email
                },
                message: {
                    subject: 'inclusão ao sistema',
                    body: 'Bem vindo ao sistema'
                }
            });
            return res.status(200).send({ data: users[0] });
        });
    }
};
