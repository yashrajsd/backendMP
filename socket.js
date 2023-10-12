const { Server} = require('socket.io')

function serverSocket(server,rooms){
    const io = new Server(server,{
        cors:{
          origin:"http://localhost:3000",
          methods:['GET',"POST"]
        }
      })
      const socketToRoomUserMap = new Map();

      io.on('connection', (socket) => {
        console.log('User Connected');
    
        socket.on('disconnect', () => {
          console.log('User disconnected');
    
          if (socketToRoomUserMap.has(socket.id)) {
            const { roomId, userId } = socketToRoomUserMap.get(socket.id);
            io.to(roomId).emit('userLeft', userId);
    
            rooms.leaveRoom(roomId);
            socketToRoomUserMap.delete(socket.id);
          }
        });

        socket.on('createRoom',()=>{
            const roomId = rooms.createRoom();
            socket.join(roomId)
            io.to(roomId).emit('roomCreated', roomId);
        })

        socket.on('findRoom',(userId)=>{
            const roomId = rooms.findRoom()
            if(roomId){
            const joinedRoomId = rooms.joinRoom(roomId);
            if (joinedRoomId) {
              socket.join(roomId);
              socketToRoomUserMap.set(socket.id, { roomId, userId });
              io.to(roomId).emit('roomFound',roomId);
              console.log('user joined')
            } else {

              socket.emit('roomError', 'Room is full or does not exist');
            }
            }
        })

        socket.on('joinRoom', (roomId,userID) => {
            const joinedRoomId = rooms.joinRoom(roomId);
            if (joinedRoomId) {
              socket.join(joinedRoomId);
              socketToRoomUserMap.set(socket.id, { roomId, userID });
              io.to(joinedRoomId).emit('userJoined', roomId);
              console.log('User connected to roomID: '+roomId)
            } else {
              socket.emit('roomError', 'Room is full or does not exist');
            }
          });
    })
}

module.exports = serverSocket;
