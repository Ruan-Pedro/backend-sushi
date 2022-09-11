const express = require('express');
const router = require('express').Router();
const MainControllers = require('../controllers/MainControllers');
const SushiHome = require('../controllers/SushiHomeControllers');
const UsersControllers = require('../controllers/UsersControllers');
const Auth = require('../controllers/AuthControllers');
const MenuControllers = require('../controllers/MenuControllers');
const RequestControllers = require('../controllers/RequestControllers');
const TermsOfService = require('../controllers/TermsControllers');
const GoogleAuth = require('../controllers/GoogleAuthController');
const producerControllers = require('../controllers/producerControllers');
const passport = require('passport');
const session = require('express-session');

router.use(session({ secret: 'cats', cookie:{secure:false}, resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

router.get('/', MainControllers.Home.home);
//Portfolio Sender
router.get('/api/projects', MainControllers.Portfolio.sendPortfolio);
//Email Sender
router.post('/sendEmail', MainControllers.EmailSender.emailSender);

//User API
router.get('/users', MainControllers.UserControllers.showPerson);
router.post('/register', MainControllers.UserControllers.registerUser);

//RABBITMQ routes
router.post("/emailbroker", producerControllers.dataPubliser);

//Sushi Api
router.get('/sushi', Auth.optional, SushiHome.sushiHome);
//Terms of service
router.get('/sushi/terms', TermsOfService);
//Login By Google
router.get('/sushi/google/login', GoogleAuth.SiteLinkAuth);
router.get('/sushi/auth/google', passport.authenticate('google', { scope: ['email', 'profile', 'phone'] }));
router.get('/sushi/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }), GoogleAuth.Callback);
router.get('/sushi/google/logout', GoogleAuth.Logout);
router.get('/sushi/auth/google/failure', GoogleAuth.AuthFailure);
router.get('/sushi/google/users', Auth.required,GoogleAuth.getGoogleUsers);
router.get('/sushi/google/profile', Auth.required,GoogleAuth.getProfile);
router.put('/sushi/google/user/:id', Auth.required,GoogleAuth.updateUser);
router.put('/sushi/google/user/status/:id', Auth.required,GoogleAuth.setStatus);

//users
router.post('/sushi/login', UsersControllers.login);
router.post('/sushi/forgot', UsersControllers.forgotPassword);
router.get('/sushi/profile', Auth.required, UsersControllers.getProfile);
router.get('/sushi/users', Auth.required, UsersControllers.getUsers);
router.get('/sushi/user/:id', Auth.required, express.json(), UsersControllers.getUserById);
router.post('/sushi/user', express.json(), UsersControllers.registerUser);
router.put('/sushi/user/:id', Auth.required, express.json(), UsersControllers.updateUser);
router.put('/sushi/user/status/:id', Auth.required, express.json(), UsersControllers.setStatus);
//Pedidos
router.get('/sushi/pedidos', Auth.required, RequestControllers.getRequests);
router.get('/sushi/pedido/:id', Auth.required, express.json(), RequestControllers.getRequest);
router.post('/sushi/pedido', Auth.required, express.json(), RequestControllers.makeRequest);
router.put('/sushi/pedido/:id', Auth.required, express.json(), RequestControllers.updateRequest);
router.put('/sushi/pedido/confirm/:id', Auth.required, express.json(), RequestControllers.confirmRequest);
router.put('/sushi/pedido/finalize/:id', Auth.required, express.json(), RequestControllers.finalizeOrder);
//menu
router.get('/sushi/menu', Auth.optional, MenuControllers.getMenu);
router.get('/sushi/menu/:id', Auth.optional, MenuControllers.getMenuById);
router.post('/sushi/menu', Auth.required, express.json(), MenuControllers.insertMenu);
router.put('/sushi/menu/:id', Auth.required, express.json(), MenuControllers.updateMenu);
router.put('/sushi/menu/status/:id', Auth.required, MenuControllers.setStatus);

//teste
router.get('/sushi/test', express.json(), UsersControllers.teste);
module.exports = router;