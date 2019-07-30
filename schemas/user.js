const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId }} = Schema;
const userSchema = new Schema({
  nick: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  belongedRooms:[
    {
        type:ObjectId,
        ref:'Message'
    }
  ],
});

module.exports = mongoose.model('User', userSchema);