rooms = {}

// create a new room
var createRoom = (roomName) => {
    rooms[roomName] = {
        name: roomName,
        currentSong: {'data':'none'},
        members: []
    }
    console.log(rooms)
}

// get room data
var getRoom = (roomName) => {
    return rooms[roomName]
}

var setSong = (roomName, songData) => {
    rooms[roomName].currentSong = songData;
}

var newMember = (roomName, socket) => {
    rooms[roomName].members.push(socket.id)
}


// exports
module.exports = {
    createRoom,
    getRoom,
    setSong,
    newMember
}
