// server.js for @pimonsays

require('dotenv').config(); // require enviornment variables

const Twit = require('twit');
const consumer_key = process.env.consumer_key;
const consumer_secret = process.env.consumer_secret;
const access_token = process.env.access_token;
const access_token_secret = process.env.access_token_secret;

const T = new Twit({
    consumer_key,
    consumer_secret,
    access_token,
    access_token_secret,
    timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
});

T.post('statuses/update', { status: 'Janet the h4x0r for life' }, (err, data, response) => {
    console.log(data)
});