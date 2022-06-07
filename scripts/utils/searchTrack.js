
const axios = require('axios');

const searchForAlbum = async ({ q }) => {
    const options = {
      method: 'GET',
      url: `${process.env.SPOTIFY_ENDPOINT}/search`,
      params: {
        q,
        type: 'track',
        numberOfTopResults: '5',
      },
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_TOKEN}`,
      },
    };
    const trackFound = await axios.request(options);
    const { data } = trackFound;
    if (data?.tracks?.items[0]?.id){
        const song = data.tracks.items[0]
        delete song.available_markets;
        delete song.album.available_markets;
        return song;
    }
    return undefined;

}

module.exports = searchForAlbum;
