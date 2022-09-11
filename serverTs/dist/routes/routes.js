"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testControllers_1 = __importDefault(require("../controllers/testControllers"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    return res.status(200).send({ msg: "TS server" });
});
router.get('/users', testControllers_1.default.index);
router.get('/create', testControllers_1.default.create);
exports.default = router;
