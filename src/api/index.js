const express = require('express');
const Sentry = require('@sentry/node');
const Tracking = require('@sentry/tracing');
const cors = require('cors');

require('dotenv').config();
require('better-logging')(console);

const app = express();

Sentry.init({
    dsn: process.env.SENTRY_DNS,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracking.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});

require('dotenv').config();

const config = {
    port: process.env.API_PORT
}

app.use(cors());

const redis = require("../../scripts/redis/index");
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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
        Sentry.captureException(e);
        return res.json({error: true, message:e.message}).status(500);
    } 
})

app.get('/stats', async (_, res) => {
    try{
        const stats = await redis.stats();
        return res.json(stats).status(200);
    }catch(e){
        Sentry.captureException(e);
        return res.json({error: true, message: e.message}).status(500);
    }
})



app.use(Sentry.Handlers.errorHandler());

app.use(function onError(_, _2, res) {
    res.statusCode = 500;
});

app.listen(config.port, () => console.log(`BFF listening on port ${config.port}`));

