rooms = {}

// create a new room
var createRoom = (roomName) => {
    rooms[roomName] = {
        name: roomName,
        currentSong: {'data':'none'}
    }
    console.log(rooms)
}

// get room data
var getRoom = (roomName) => {
    return rooms[roomName]
}

var setSong = (roomName, songData) => {
    console.log(roomName)
    console.log('room info: ' + rooms[roomName])
    rooms[roomName].currentSong = songData;
}

// exports
module.exports = {
    createRoom,
    getRoom,
    setSong
}
