// server.js for @pimonsays

require('dotenv').config(); // require enviornment variables

const Twit = require('twit');
const consumer_key = process.env.consumer_key;
const consumer_secret = process.env.consumer_secret;
const access_token = process.env.access_token;
const access_token_secret = process.env.access_token_secret;
const request = require('request');
const { first } = require('lodash');

import * as hardware from './hardware';

const firebaseEndpoint = 'https://pimonsays.firebaseio.com';

const T = new Twit({
    consumer_key,
    consumer_secret,
    access_token,
    access_token_secret,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

const stream = T.stream('user');

function updateFirebaseCount(endpoint, text, favs) {
    request({
        uri: `${endpoint}/favs/${text}.json`,
        method: 'PUT',
        json: {
            favs,
        }
    }, (error, response, body) => {
        if (error) {
            console.log(error);
        }
    });
}

function updateLatestStarTweet(endpoint, tweet) {
    request({
        uri: `${endpoint}/star/latest.json`,
        method: 'PUT',
        json: {
            tweet,
        }
    }, (error, response, body) => {
        if (error) {
            console.log(error);
        }
    });
}

stream.on('favorite', (tweet) => {
    const {target_object : {favorite_count, text}} = tweet;
    console.log(`${text} | ${favorite_count}`);
    if (favorite_count) {
        updateFirebaseCount(firebaseEndpoint, text, favorite_count);
    }
});

stream.on('unfavorite', (tweet) => {
    const {target_object : {favorite_count, text}} = tweet;
    console.log(`${text} | ${favorite_count}`);
    if (favorite_count) {
        updateFirebaseCount(firebaseEndpoint, text, favorite_count);
    }
});

stream.on('tweet', (tweet) => {
    const { text } = tweet;
    updateLatestStarTweet(firebaseEndpoint, text);
    console.log('incoming-tweet:', text);
    hardware.display(text);
});

const tylerNickNameMode = (delay) => {
    setInterval(() => {
        request(`${firebaseEndpoint}/favs.json`, (err, response, data) => {
            try {
                const json = JSON.parse(data);
                if (json) {
                    const coll = Object.entries(json).map(([key, {favs}]) => [key, favs]);
                    const sorted = coll.sort((a, b) => { // biggest first
                        const [ , countA] = a;
                        const [ , countB] = b;
                        return countB - countA;
                    })
                    const [winner, ] = first(sorted);
                    console.log(winner);
                    hardware.display(winner);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }, delay);
}

const starMode = (delay) => {
    setInterval(() => {
        request(`${firebaseEndpoint}/star.json`, (err, response, data) => {
            try {
                const json = JSON.parse(data);
                if (json) {
                    const { latest: { tweet }} = json;
                    hardware.display(tweet);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }, delay);
};

const mode = process.env.mode;
const delay = 12000;

console.log('mode::', mode);

switch (mode) {
    case 'star': {
        starMode(delay);
        break;
    }
    case 'tyler-nickname': {
        tylerNickNameMode(delay);
        break;
    }
    default: {
        starMode(delay);
    }
}