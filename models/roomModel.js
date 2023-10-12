const mongoose = require('mongoose');
const User = require('./userModel')

// Create a schema for a room
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  users: [User.schema],
  rounds: { type: Number, default: 0 },
  waiting: {type:Boolean,default:true}
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
