const { v4: uuidv4 } = require("uuid");
const Room = require('./models/roomModel')
const ROOM_MAX_CAPACITY = 5;

const deleteEmptyRoom = async (roomName) => {
  try {
    const result = await Room.deleteOne({ name: roomName });
    if (result.deletedCount === 1) {
      console.log(`Room '${roomName}' deleted successfully.`);
    } else {
      console.log(`Room '${roomName}' not found.`);
    }
  } catch (error) {
    console.error(`Error deleting room: ${error}`);
  }
};

class SocketRoom {
  constructor() {
    this.roomsState = [];
  }
  

  createRoom() {
    const newID = uuidv4();
    const room = new Room({
      name: newID,
    });

    room.save()
    .then(() => {
      console.log(`Room ${newID} created in MongoDB`);
    })
    .catch((error) => {
      console.error('Error creating room in MongoDB:', error);
      return null
    });

    this.roomsState.push({
      id: newID,
      users: 0,
    });
    return newID;
  }

  joinRoom(roomId) {
    const room = this.roomsState.find((r) => r.id === roomId);
    if (room && room.users < ROOM_MAX_CAPACITY) {
      room.users++;
      console.log(room.users)
      return room.id;
    }
    return null;
  }

  findRoom() {
    const room = this.roomsState.find((r) => r.users < ROOM_MAX_CAPACITY);

    if (room) {
      // room.users++;
      return room.id;
    } else {
      const newRoomId = this.createRoom();
      // this.roomsState.find((r) => r.id === newRoomId).users++;
      return newRoomId;
    }
  }

  leaveRoom(roomId) {
    const roomIndex = this.roomsState.findIndex((r) => r.id === roomId);
  
    if (roomIndex !== -1) {
      if (this.roomsState[roomIndex].users > 0) {
        this.roomsState[roomIndex].users--;
        console.log(this.roomsState[roomIndex].users)
        if (this.roomsState[roomIndex].users === 0) {
          deleteEmptyRoom(roomId)
          this.roomsState.splice(roomIndex, 1); // Remove the room from the array
          console.log('room Deleted')
        }
      }
    }
  }
}

module.exports = SocketRoom;
