const express = require('express')
const app = express();

require('dotenv').config();

const redis = require("../../scripts/redis/index");

const config = {
    port: process.env.API_PORT
}

app.get('/', (_, res) => {
  res.send('hello world')
})

app.get('/search', async (req, res) => {
    const { q } = req.query;
    const response = await redis.search(q);
    res.json(response).status(200);
})

app.listen(config.port, () => console.log(`BFF listening on port ${config.port}`));