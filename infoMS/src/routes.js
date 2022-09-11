
const express = require('express');
const router = require('express').Router();
const qrcodeControllers = require('./controllers/qrcodeControllers');

router.get('/qr-code', qrcodeControllers.urlQrCodeRedirect);
router.get('/consume', qrcodeControllers.consumeMessages);

module.exports = router;