const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const fs = require('fs');

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
    youtube.searchYoutube(song)
    .then(results => {
        youtube.getSongData(results[0].url)
        .then(data => {
            let audioFormats = youtube.getAudioFormats(data);
            output = {
                "thumbnail": data.videoDetails.thumbnails[data.videoDetails.thumbnails.length-1].url,
                "title": data.videoDetails.title,
                "artist": data.videoDetails.ownerChannelName,
                "songUrl": audioFormats[0].url
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


// start the app
app.listen(8080, () => {
    console.log(`Example app listening on port 8080`)
})