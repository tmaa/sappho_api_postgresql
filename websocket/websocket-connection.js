const queryString = require('query-string')
const Message = require('../mongo_models/Message');
const WebSocket = require('ws')

var sockets = {}

const websocketConnection = (wss) => {
  wss.on("connection", async (ws, req, Client) => {
    const [path, params] = req.url.split('?')
    const urlParams = queryString.parse(params);
    console.log(`Client connected: ${urlParams.id}`);
    sockets[urlParams.id] = ws

    ws.on("message", async (data) => {
      const messageData = JSON.parse(data)
      console.log(messageData) 
      const sendTo = sockets[messageData.to];
      const message = new Message({
        from: messageData.from,
        to: messageData.to,
        message: messageData.message
      });
      const newMessage = await message.save();
      
      if (sendTo && sendTo.readyState === WebSocket.OPEN) {
        sendTo.send(JSON.stringify(messageData));
        console.log(`sent to: ${messageData.to}`)
      }
    });
    
    ws.on("close", async () => {
      console.log(`Client disconnected ${urlParams.id}`)
      if(sockets[urlParams.id]){
        delete sockets[urlParams.id]
      }
    })
  });
}

module.exports = websocketConnection