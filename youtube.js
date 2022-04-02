const fs = require('fs');
const ytdl = require('ytdl-core');
const yt = require('youtube-search-without-api-key');


// get song data from spotify
var getSongData = (url) => {
    return getPreview(url)
}

// search youtube for a video and get data for it using youtube-search-without-api-key
var searchYoutube = (query) => {
    return yt.search(query)
}


// search youtube for a video and get data for it using ytdl-core
var getPreview = (url) => {
    return ytdl.getInfo(url, {
        filter: 'audioonly'
    })
}

var getAudioFormats = (data) => {
    return ytdl.filterFormats(data.formats, 'audioonly');
}

module.exports = {
    getSongData,
    searchYoutube,
    getPreview,
    getAudioFormats
}