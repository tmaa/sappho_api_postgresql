const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')
const http = require('http')
const {Server} = require('socket.io')
const server = http.createServer(app)
const OnlineAccount = require('./mongo_models/OnlineAccount')

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const PORT = process.env.PORT || 3001

dotenv.config();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))

//import routes
const accountRoutes = require("./routes/account")
const searchRoutes = require("./routes/search")
const actionsRoutes = require("./routes/actions");
const Message = require('./mongo_models/Message');

//routes
app.use("/api/account", accountRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/actions", actionsRoutes)

server.listen(PORT, async() => {
  try{
    console.log(`Server running on ${PORT}`)
    //mongodb connection
    mongoose.connect(process.env.MONGODB_URL).then(() => {
      console.log("connected to mongo")
    });
  }catch(error){
    console.log(error)
  }
});

//socket connection
io.on("connection", (socket) => {
  console.log("user connected: " + socket.id)
  socket.on('login', async (data) => {
    console.log(`account ${data} on socket ${socket.id}`)
    try{
      let insertOnlineAccount = await OnlineAccount.findOneAndUpdate(
        {account_id: data},
        {socket_id: socket.id},
        {upsert: true}
      )
      console.log(insertOnlineAccount)
    }catch(error){
      console.log(error)
    }
  })

  socket.on('message', async (data) => {
    //console.log(data)
    const message = new Message({
      from: data.from,
      to: data.to,
      message: data.message
    })
    const newMessage = await message.save();
    //console.log(newMessage)
    const checkRecipientOnline = await OnlineAccount.findOne({account_id: data.to});
    if(checkRecipientOnline){
      socket.to(checkRecipientOnline.socket_id).emit('message', data.message)
    }
  })

  socket.on("disconnect", async () => {
    console.log(`account offline ${socket.id}`)
    try{
      let deleteFromOnline = await OnlineAccount.findOneAndDelete({socket_id: socket.id})
      console.log(`delete ${deleteFromOnline}`)
    }catch(error){
      console.log(error)
    }
  })
});