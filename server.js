const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const dbConnect = require('./db')
const Room = require('./models/roomModel')
app.use(cors());


// db connection 
dbConnect()
// db connection 


// Socket 
const serverSocket = require('./socket');
const SocketRoom = require('./room'); 
const rooms = new SocketRoom(); 
serverSocket(httpServer, rooms); 
// Socket


httpServer.listen(PORT, () => {
  console.log('Server Listening to PORT: ' + PORT);
});

// api

app.get('/api/room/:roomId', async (req, res) => {
  try {
    const roomId = req.params.roomId;

    // Use your MongoDB model (e.g., Room) to find the room by its ID
    const room = await Room.findOne({ name: roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Error getting room information:', error);
    res.status(500).json({ message: 'Server error' });
  }
});