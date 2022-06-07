const express = require('express')
const app = express();
var cors = require('cors')

require('dotenv').config();

const redis = require("../../scripts/redis/index");

const config = {
    port: process.env.API_PORT
}

app.use(cors());

app.get('/', (_, res) => {
  res.send('hello world')
})

app.get('/search', async (req, res) => {
    const { q } = req.query;
    if(!q) return res.json({error: true, message: "no query"}).status(404);
    try{
        const response = await redis.search(q);
        return res.json(response).status(200);
    }catch(e){
        return res.json({error: true, message:e.message}).status(500);
    } 
})

app.get('/stats', async (_, res) => {
    try{
        const stats = await redis.stats();
        return res.json(stats).status(200);
    }catch(e){
        console.log(e)
        return res.json({error: true, message: e.message}).status(500);
    }
})

app.listen(config.port, () => console.log(`BFF listening on port ${config.port}`));