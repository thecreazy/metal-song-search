const redis = require("redis");

const client = redis.createClient({
    url: process.env.REDIS_CONNECTION
});

const PREFIX_SEARCH = "metalmusic:jsondata"

const enableClient = async () => {
    await client.connect();
    // await client.ft.create('idx:metalmusic', {
    //     "$.lyrics": redis.SchemaFieldTypes.TEXT,
    //     "$.name": redis.SchemaFieldTypes.TEXT,
    //     "$.artists.name": redis.SchemaFieldTypes.TEXT,
    //     }, {
    //       ON: 'JSON',
    //       PREFIX: PREFIX_SEARCH
    //     }
    //   );
}

enableClient();

module.exports.client = client;
module.exports.addInfo = async (data) => {
    await client.json.set(`${PREFIX_SEARCH}:${data.id}`, '.', data);
}

module.exports.search = async (q) => {
    return  await client.ft.search('idx:metalmusic',q);
}

