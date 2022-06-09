# Metal Song Search

How many times have you ever wondered _"how does Google figure out which song I'm looking for using only a small part of the lyrics?"_ I honestly had never asked that to myself, except yesterday, and I decided to try to replicate something like that.

To do all this I needed:
- A big amount of music lyrics
- A storage
- A way to do something like a "full-text search"

I was about to give up on the idea when a friend asked me "why don't you just do it for metal songs?" The metalhead in me couldn't hold back and googled *"best 1000 metal songs ever"*

### What i do

1. Download the 1000 best metal song ever [list here](https://github.com/thecreazy/metal-song-search/blob/main/files/songs.csv)
2. For each track download the lyrics [list here](https://github.com/thecreazy/metal-song-search/tree/main/files/tracks) - [code here](https://github.com/thecreazy/metal-song-search/blob/main/scripts/downloadSongInformation.js)
3. Upload all the lyrics on Redis using RedisJSON [code here](https://github.com/thecreazy/metal-song-search/blob/main/scripts/uploadIntoRedis.js)
4. Create a web server with search and stats endpoints [result here](https://metal-song-search.vercel.app/search?q=metallica) - [code here](https://github.com/thecreazy/metal-song-search/tree/main/src/api)
6. Create a frontend application to show the results [result here](https://thecreazy.github.io/metal-song-search/) - [code here](https://github.com/thecreazy/metal-song-search/tree/main/src/web)

### Results

#### Search for artist
<img src="https://github.com/thecreazy/metal-song-search/blob/main/docs/artist.png">

#### Search a for text
<img src="https://github.com/thecreazy/metal-song-search/blob/main/docs/text.png">

Want to know more about the results? Get a look to the [releated medium article]()