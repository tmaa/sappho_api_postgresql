const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  from: { //from
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, {timestamps: {createdAt: true, updatedAt: false}});

const Message = mongoose.model('message', messageSchema);
module.exports = Message