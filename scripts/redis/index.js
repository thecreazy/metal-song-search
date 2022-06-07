const redis = require("redis");

const client = redis.createClient({
    url: process.env.REDIS_CONNECTION
});

const PREFIX_SEARCH = "metalmusic:jsondata"

const enableClient = async () => {
    await client.connect();
    // await client.ft.create('idx:metalmusic', {
    //         "$.lyrics": redis.SchemaFieldTypes.TEXT,
    //         "$.name": redis.SchemaFieldTypes.TEXT,
    //         "$.artists.name": redis.SchemaFieldTypes.TEXT,
    //         "$.album.name": redis.SchemaFieldTypes.TEXT,
    //         "$.duration": redis.SchemaFieldTypes.NUMERIC,
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
    return await client.ft.search('idx:metalmusic',q);
}

module.exports.stats = async () =>{
    return await client.ft.aggregate('idx:metalmusic', '*', {
        STEPS: [{
          type: redis.AggregateSteps.GROUPBY,
          REDUCE: [{
            type: redis.AggregateGroupByReducers.COUNT_DISTINCT,
            property: '$.artists.name',
            AS: 'numberOfArtists'
          },
          {
            type: redis.AggregateGroupByReducers.COUNT_DISTINCT,
            property: '$.album.name',
            AS: 'numberOfAlbums'
          },
          {
            type: redis.AggregateGroupByReducers.AVG,
            property: '$.duration',
            AS: 'avgDuration'
          }]
        }],
    })
}
