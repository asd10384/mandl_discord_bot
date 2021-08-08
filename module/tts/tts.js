
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const { broadcast, play } = require('./play');
const MDB = require('../../MDB/data');
const log = require('../../log/log');
const udata = MDB.module.user();

const HttpsProxyAgent = require('https-proxy-agent');
const agent = HttpsProxyAgent(process.env.PROXY); // 보류

const ytdl = require('ytdl-core');
var checkyturl = /(?:https?:\/\/)?(?:www\.|music\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
var checkytid = /(?:https?:\/\/)?(?:www\.|music\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?/gi;

const vcerr = new MessageEmbed()
    .setTitle(`먼저 봇을 음성에 넣고 사용해 주십시오.`)
    .setDescription(`${process.env.prefix}join [voice channel id]`)
    .setColor('RANDOM');
const yterr = new MessageEmbed()
    .setTitle(`\` 주소 오류 \``)
    .setDescription(`영상을 찾을수 없습니다.`)
    .setColor('RED');

module.exports = {
    tts,
};

// 기본
async function tts(client = new Client, message = new Message, args = Array, sdb = MDB.object.server, user = new User) {    
    udata.findOne({
        userID: user.id
    }, async (err, db1) => {
        var udb = MDB.object.user;
        udb = db1;
        if (err) log.errlog(err);
        if (!udb) {
            await MDB.set.user(user);
            return await tts(client, message, args, sdb, user);
        }
        udb.name = user.username;
        var ttsboolen = (udb.tts) ? true : false;
        if (!ttsboolen) return msgdelete(message, 20);

        var text = args.join(' ');
        var url = await geturl(message, text, {});

        if (url.url == 'youtubelinkerror') {
            return message.channel.send(yterr).then(m => msgdelete(m, Number(process.env.deletetime)));
        }
        if (sdb.tts.tts) {
            db.set(`db.${message.guild.id}.tts.timertime`, Number(process.env.ttsout)*60);
            var channel;
            if (sdb.tts.move) {
                if (message.member.voice.channel || null) {
                    channel = message.member.voice.channel || null;
                } else if (message.guild.me.voice.channel || null) {
                    channel = message.guild.voice.channel || null;
                }
            } else {
                if (message.guild.me.voice.channel || null) {
                    channel = message.guild.me.voice.channel || null;
                } else if (message.member.voice.channel || null) {
                    channel = message.member.voice.channel || null;
                }
            }
            if (!channel) return message.channel.send(vcerr).then(m => msgdelete(m, Number(process.env.deletetime)));
            if (url.text) {
                return await play(message.guild.id, channel, url.url, url.options);
            } else {
                return await broadcast(channel, url.url, url.options);
            }
        } else {
            const music = new MessageEmbed()
                .setTitle(`\` 재생 오류 \``)
                .setDescription(`현재 노래퀴즈가 진행중입니다.\n노래퀴즈가 끝나고 사용해주세요.`)
                .setColor('RED');
            return message.channel.send(music).then(m => msgdelete(m, Number(process.env.deletetime)));
        }
    });
}
// 기본 끝

// 유튜브 URL 생성
async function geturl(message = new Message, text = String, options = Object) {
    if (text.replace(/ +/g,'').replace(checkyturl,'').length == 0) {
        try {
            options = {
                volume: 0.08
            };
            var yt = ytdl(`http://www.youtube.com/watch?v=${text.replace(/ +/g,'').replace(checkytid, '').replace(/\&[a-z]+/g,'')}`, {
                quality: 'highestaudio',
                requestOptions: {agent}
            }) || null;
            message.delete();
            if (yt) {
                return {
                    url: yt,
                    options: options,
                    text: false
                };
            } else {
                return {
                    url: 'youtubelinkerror',
                    options: options,
                    text: false
                };
            }
        } catch(e) {
            return {
                url: 'youtubelinkerror',
                options: options,
                text: false
            };
        }
    }
    return {
        url: msg(message, text),
        options: options,
        text: true
    };
}
// 유튜브 URL 생성 끝

const repobj = eval(process.env.TTSMSG)[0] || require('./set/ttsmsg');
function msg(message = new Message, text = '') {
    text = text.replace(/<@\!?[(0-9)]{18}>/g, (text) => {
        var user = message.guild.members.cache.get(text.replace(/[^0-9]/g,'')) || null;
        return (user) ? (user.nickname) ? user.nickname : user.user.username : '';
    });
    text = text.replace(/\<a?\:.*\:[(0-9)]{18}\>/g, (text) => {
        return '이모티콘';
    });
    for (i in repobj) {
        text = text.replace(new RegExp(i, 'gi') || new RegExp('\\'+i, 'gi'), repobj[i]) || i;
    }
    return text;
}
function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
