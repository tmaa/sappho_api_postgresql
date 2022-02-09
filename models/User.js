const mongoose = require('mongoose')

const preferencesSchema = new mongoose.Schema({
  minAge: {type: Number},
  maxAge: {type: Number},
  maxDistance: {type: Number},
}, {_id: false});

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
}, {_id: false});

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    //required: true,
    max: 50
  },
  dob: {
    type: Date,
    //required: true
  },
  height: {
    type: Number,
    //required: true
  },
  email: {
    type: String,
    //required: true,
    max: 255,
    //unique: true
  },
  phone: {
    type: String,
    //unique: true
  },
  location: {
    type: pointSchema,
    required: true
  },
  preferences: {
    type: preferencesSchema
  }
}, {timestamps: true});

userSchema.index({location: "2dsphere"})
module.exports = mongoose.model('User', userSchema)