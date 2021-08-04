
require('dotenv').config();
const { Channel } = require('discord.js');
const { writeFile, readFileSync } = require('fs');

const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const ttsclient = new TextToSpeechClient({
    keyFile: 'googlettsapi.json',
    fallback: false,
});

module.exports = {
    play,
    broadcast,
};

const sncheckobj = require('./set/signature')[0];
const snlist = Object.keys(sncheckobj);
const sncheck = new RegExp(snlist.join('|'), 'gi');

// TEXT -> tts.WAV로 변경
async function play(serverid = String, channel = new Channel, text = '', options = Object) {
    var list = [];
    var output;
    text = text.replace(sncheck, (text) => {
        return '#@#'+text+'#@#';
    });
    list = text.split('#@#');
    if (list.length > 0) {
        for (i in list) {
            list[i] = (snlist.includes(list[i])) 
                ? readFileSync(`sound/signature/${sncheckobj[list[i]]}.mp3`) 
                : await gettext(list[i]);
        }
        output = Buffer.concat(list);
    } else {
        output = await gettext(text);
    }

    options['volume'] = 0.7;
    var fileurl = `${serverid}.wav`;
    writeFile(fileurl, output, () => {
        return broadcast(channel, fileurl, options);
    });
}
// TEXT -> tts.WAV로 변경 끝

// 출력
async function broadcast(channel = new Channel, url = String, options = Object) {
    channel.join().then(async function(connection) {
        var dispatcher = connection.play(url, options);
    });
}

async function gettext(text = '') {
    let response;
    try {
        response = await ttsclient.synthesizeSpeech({
            input: {text: text},
            voice: {
                languageCode: 'ko-KR',
                name: 'ko-KR-Standard-A'
            },
            audioConfig: {
                audioEncoding: 'MP3', // 형식
                speakingRate: 0.905, // 속도
                pitch: 0, // 피치
                // sampleRateHertz: 16000, // 헤르츠
                // effectsProfileId: ['medium-bluetooth-speaker-class-device'] // 효과 https://cloud.google.com/text-to-speech/docs/audio-profiles
            },
        });
        return response[0].audioContent;
    } catch(err) {
        return new Buffer('');
    }
}
// 출력 끝
