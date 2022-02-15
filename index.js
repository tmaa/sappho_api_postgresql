const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')
const http = require('http')
const {Server} = require('socket.io')
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const PORT = process.env.PORT || 3001

dotenv.config();

//mongodb connection
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("connected to mongo")
})

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))

//import routes
const accountRoutes = require("./routes/account")
const searchRoutes = require("./routes/search")
const actionsRoutes = require("./routes/actions")

//routes
app.use("/api/account", accountRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/actions", actionsRoutes)

server.listen(PORT, () => console.log(`Server running on ${PORT}`))

//socket connection
io.on("connection", (socket) => {
  console.log("user connected: " + socket.id)
  socket.on('send-message', data => {
    console.log(data)
    socket.broadcast.emit('message', data.message)
  })

  socket.on('login', (data) => {
    console.log(`user online ${data} on socket ${socket.id}`)
  })

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`)
  })
});