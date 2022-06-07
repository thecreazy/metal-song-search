const csv = require('csv-parser')
const fs = require('fs');
const path = require('path')

const searchTrack = require('./utils/searchTrack');
const delay = require('./utils/delay');
const getLyrics = require('./utils/getLyrics');

require('dotenv').config();
require('better-logging')(console);

const startProcessing = async (songList) => {
    for(const song of songList){
        console.log(`looking for ${song.SONG} - ${song.ARTIST}`);
        const track = await searchTrack({
            q: `${song.ARTIST} ${song.SONG}`,
        });
        if(!track) continue;
        const filePath = path.resolve(__dirname, `../files/tracks/${track.id}.json`);
        if (fs.existsSync(filePath)) continue;
        await delay(500);
        const lyrics = await getLyrics({
           id: track.id
        });
        const finalInfo = {
            trackLyrics: lyrics,
            trackInfo: track,
          };
        if (track) fs.writeFileSync(filePath, JSON.stringify(finalInfo, null, 4));  
        await delay(100);
        if(track) console.info(`finished for ${song.SONG} - ${song.ARTIST}`)
        if(!track) console.error(`error for ${song.SONG} - ${song.ARTIST} - ${track.id}`)
    }
   
}

const main = () => {
    const results = []
    fs.createReadStream(path.join(__dirname, "../files/songs.csv"))
        .pipe(csv())
        .on('data', async (data) => results.push(data))
        .on('end', () => {
            startProcessing(results);
        });
}

main();