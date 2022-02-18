const express = require('express');
const {WebSocketServer} = require('ws')
const http = require('http')
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')

const websocketConnection = require('./websocket/websocket-connection')

const PORT = process.env.PORT || 3001

dotenv.config();

//initialize http server and websocker server instance
const server = http.createServer(app);
const wss = new WebSocketServer({server})

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

//mongodb connection
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("connected to mongo")
});

//import routes
const accountRoutes = require("./routes/account");
const filterRoutes = require("./routes/filter");
const actionsRoutes = require("./routes/actions");

//routes
app.use("/api/account", accountRoutes)
app.use("/api/filter", filterRoutes)
app.use("/api/actions", actionsRoutes)

websocketConnection(wss);

server.listen(PORT, async() => {console.log(`Server running on ${PORT}`)});

