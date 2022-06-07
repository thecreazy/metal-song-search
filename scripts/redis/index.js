const redis = require("redis");

const client = redis.createClient({
    url: "redis://default:CBGE23GbKCTN4Qs2BmvoW5iP6SMU2gTY@redis-13021.c293.eu-central-1-1.ec2.cloud.redislabs.com:13021"
});

const enableClient = async () => {
    await client.connect();
}

enableClient();

module.exports.client = client;
module.exports.addInfo = async (data) => {
    await client.json.set(`${data.id}:jsondata`, '.', data);
}
