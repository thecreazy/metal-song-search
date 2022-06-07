const path = require('path');
const fs = require('fs');

require('better-logging')(console);

require('dotenv').config();
const redis = require("./redis/index");

const main = async () => {
  const directoryPath = path.join(__dirname, '../files/tracks');
  const dirFiles = fs.readdirSync(directoryPath);
  for (const file of dirFiles) {
    const filePath = path.join(__dirname, '../files/tracks', file);
    const songInfo = require(filePath);
    const { trackLyrics, trackInfo } = songInfo;
    const finalJson = {
        id: trackInfo.id,
        name: trackInfo.name,
        uri: trackInfo.external_urls.spotify,
        duration: trackInfo.duration_ms,
        artists: {
            id: trackInfo.artists[0].id,
            name: trackInfo.artists[0].name,
        },
        album: {
            id:  trackInfo.album.id,
            name:  trackInfo.album.name,
            image: trackInfo.album.images[0].url
        },
        lyrics: trackLyrics.lines.reduce((acc, line) => {
            acc += `${line.words} \n`
            return acc
        }, "")
    }
    await redis.addInfo(finalJson);
    console.info(`added ${finalJson.name} to redis`)
  }
};

main();
