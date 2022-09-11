const express = require("express");
const app = express();
const routes = require('./src/routes/routes');
const PORT = 3030;
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerdocs = require('./docs/swagger.json');
require('dotenv').config();
const socketIO = require("socket.io");
const connection = require('./database/db');
const session = require('express-session');
const passport = require('passport');
require('./src/passportSetup');
//rabbitMQ messager gateway
// const Producer = require('./producer');
// const producer = new Producer();

app.use(cors({ origin: process.env.FRONT }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerdocs));
//depois mudar rotas sushi
app.use('/', routes);
app.use(cors({
  origin: '*'
}));
app.use(session({ secret: 'cats', cookie:{secure:false}, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


connection();
// Deve ser criado rota de termos de serviço da api xxxxxxxxxxxxxxxxxxxxxxxxxx******************************xxxxxxxxxxxxxxxxxxxxxxxxxx***************************

// mongodb://USUARIO:SENHA@localhost:27017/DATABASENAME?authSource=admin
// mongoose.connect(process.env.MONGOURL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then((db) => { console.log('Database is connected successfully') })
//   .catch((err) => { console.log(err) });
// let db = mongoose.connection;
// db.on("error", ()=>{console.log("erro ao conectar")})
// db.once("open", ()=>{console.log("conectado com sucesso!!!")})

//SERVER
const server = app.listen(PORT, () => {
  console.log(`[HTTP] Server is running at ${process.env.HOST}:${PORT}`);
  console.log(`[HTTP] Press CTRL + C to stop it`);
});

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["secretHeader"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("[IO] Server has a new connection ");
  socket.on("chat.message", (data) => {
    console.log("[SOCKET] Chat.message => ", data);
    io.emit("chat.message", data);
  });
  socket.on("disconnected", () => {
    console.log("[SOCKET] A connection was disconnected");
  });
});
