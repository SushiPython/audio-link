const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const http = require('http').Server(app);
const io = require('socket.io')(http);


const rooms = require('./rooms')
const youtube = require('./youtube')
const utils = require('./utils')





// setup nunjucks
nunjucks.configure('templates', {
    autoescape: true,
    express: app
})

// handle home page
app.get('/', (req, res) => {
    res.render('index.html')
})

// handle create-room page
app.get('/create-room', (req, res) => {
    // create room and redirect to room.html
    const roomName = utils.randomString(10)
    rooms.createRoom(roomName)
    res.redirect(`/room/${roomName}`)

})

// handle room page
app.get('/room/:roomName', (req, res) => {
    // get room data
    const roomName = req.params.roomName
    const room = rooms.getRoom(roomName)

    if (!room) {
        res.redirect('/')
        return
    }

    res.render('room.html', {
        roomName,
        currentSong: room.currentSong
    })
})

// set a song for the room
app.get('/api/setSong', (req, res) => {
    let song = req.query.song
    let room = req.query.room
    youtube.searchYoutube(song + " audio")
    .then(results => {
        youtube.getSongData(results[0].url)
        .then(data => {
            let audioFormats = youtube.getAudioFormats(data);

            // split song.Data into title and artist
            if (data.videoDetails.title.split(" - ").length < 2) {
                songTitle = data.videoDetails.title
                songArtist = '(Maybe) ' + data.videoDetails.ownerChannelName;
            } else if (data.videoDetails.title.includes(" by ")) {
                var songTitle = data.videoDetails.title.split(" by ")[0];
                var songArtist = data.videoDetails.title.split(" by ")[1];
            }  else if (data.videoDetails.title.includes(" By ")) {
                var songTitle = data.videoDetails.title.split(" By ")[0];
                var songArtist = data.videoDetails.title.split(" By ")[1];
            } else {
                var songTitle = data.videoDetails.title.split(" - ")[1];
                var songArtist = data.videoDetails.title.split(" - ")[0];
            }



            // remove all data after the parentheses and Topic
            songTitle = songTitle.split(" (")[0];
            songArtist = songArtist.split(" (")[0].split(" - Topic")[0];
            

            // return the data
            output = {
                "thumbnail": data.videoDetails.thumbnails[data.videoDetails.thumbnails.length-1].url,
                "title": songTitle,
                "uploader": data.videoDetails.ownerChannelName,
                "songUrl": audioFormats[0].url,
                "artist": songArtist 
            }
            rooms.setSong(room, output)
            res.send(output)
        })
    })


})

// express api endpoint
app.get('/api/getSong', (req, res) => {
    let room = req.query.room
    let data = rooms.getRoom(room)
    if (!data) 
        return res.send({"err": "no song playing"})
    else 
        return res.send(data.currentSong);
})


http.listen(8080, function() {
    console.log('listening on *:8080');
 });