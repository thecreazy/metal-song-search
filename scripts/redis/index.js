const redis = require("redis");

const client = redis.createClient({
    url: process.env.REDIS_CONNECTION
});

const PREFIX_SEARCH = "metalmusic:jsondata"
const INDEX_NAME= "idx:metalmusic";

const enableClient = async () => {
    await client.connect();
    await client.ft.dropIndex(INDEX_NAME);
    await client.ft.create(INDEX_NAME, {
            "$.lyrics": redis.SchemaFieldTypes.TEXT,
            "$.name": redis.SchemaFieldTypes.TEXT,
            "$.artists.name": redis.SchemaFieldTypes.TEXT,
            "$.album.name": redis.SchemaFieldTypes.TEXT,
            "$.duration": redis.SchemaFieldTypes.NUMERIC,
        }, {
          ON: 'JSON',
          PREFIX: PREFIX_SEARCH
        }
      );
}

enableClient();

module.exports.client = client;
module.exports.addInfo = async (data) => {
    await client.json.set(`${PREFIX_SEARCH}:${data.id}`, '.', data);
}

module.exports.search = async (q) => {
    return await client.ft.search(INDEX_NAME,q, {
        LIMIT: {
            from: 0,
            size: 5
        }
    });
}

module.exports.stats = async () =>{
    return await client.ft.aggregate(INDEX_NAME, '*', {
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

