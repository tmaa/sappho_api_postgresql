const queryString = require('query-string')
const Message = require('../mongo_models/Message');
const WebSocket = require('ws')

var clients = {}

function heartbeat() {
  this.isAlive = true;
}

const websocketConnection = (wss) => {
  wss.on("connection", async (ws, req, Client) => {
    const [path, params] = req.url.split('?')
    const urlParams = queryString.parse(params);
    console.log(`Client connected: ${urlParams.id}`);
    clients[urlParams.id] = ws
    ws.isAlive = true

    ws.on('pong', heartbeat);

    ws.on("message", async (data) => {
      const messageData = JSON.parse(data)
      console.log(messageData) 
      const sendTo = clients[messageData.to];
      // const message = new Message({
      //   from: messageData.from,
      //   to: messageData.to,
      //   message: messageData.message
      // });
      // const newMessage = await message.save();
      
      if (sendTo && sendTo.readyState === WebSocket.OPEN) {
        sendTo.send(JSON.stringify(messageData));
        console.log(`sent to: ${messageData.to}`)
      }
    });
    
    ws.on("close", async () => {
      console.log(`Client disconnected ${urlParams.id}`)
      if(clients[urlParams.id]){
        delete clients[urlParams.id]
      }
    });
  });

  const interval = setInterval(() => {
    for(const key in clients){
      clients[key].isAlive = false;
      clients[key].ping();
      console.log(`Client ${key}`)
    }
  }, 3000);

  wss.on('close', function close() {
    clearInterval(interval);
  });
}

module.exports = websocketConnection