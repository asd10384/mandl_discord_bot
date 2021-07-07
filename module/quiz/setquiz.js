
require('dotenv').config();
const request = require('request');
const { load } = require('cheerio');
const { Client, Message, Channel, User } = require('discord.js');
const MDB = require('../../MDB/data');
const log = require('../../log/log');

const quiz = require('./quiz');

module.exports = {
    music,
    img
}

async function music(client = new Client, message = new Message, args = Array, sdb = MDB.object.server, vchannel = new Channel, user = new User, ulist = {
    url: String,
    desc: String,
    quiz: String,
    complite: Boolean,
}) {
    request(ulist.url.toString().toLocaleLowerCase().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]/g, encodeURIComponent), async (err, res, html) => {
        if (err) log.errlog(err);
        const $ = load(html);
        var dfname = [],
            dfvocal = [],
            dflink = [];
        $('body div.music div').each(async function () {
            dfname.push($(this).children('a.name').text().trim());
            dfvocal.push($(this).children('a.vocal').text().trim());
            dflink.push($(this).children('a.link').text().trim());
        });
        var rndlist = [],
            name = [],
            vocal = [],
            link = [],
            logtext = '';
        var count = dfname.length;
        var maxcount = 100;
        if (count > 50) count = 50;
        for (i=0; i<count; i++) {
            if (maxcount < 0) break;
            var r = Math.floor(Math.random()*(dfname.length+1));
            if (r >= 50 || rndlist.includes(r) || dfname[r] == '' || dfname[r] == undefined) {
                i--;
                maxcount--;
                continue;
            }
            maxcount = 100;
            rndlist.push(r);
            name.push(dfname[r]);
            vocal.push(dfvocal[r]);
            link.push(dflink[r]);
            logtext += `${i+1}. ${dfvocal[r]}-${dfname[r]} [${r+1}]\n`;
        }
        log.quizlog(message, logtext, new Date());
        var music = sdb.quiz;
        music.quiz.name = name;
        music.quiz.vocal = vocal;
        music.quiz.link = link;
        music.quiz.count = 0;
        music.start.start = true;
        music.start.user = false;
        sdb.quiz = music;
        await sdb.save();
        return await quiz.music(client, message, args, sdb, vchannel, user);
    });
    return;
}
async function img(client = new Client, message = new Message, args = Array, sdb = MDB.object.server, vchannel = new Channel, user = new User, ulist = {
    url: String,
    desc: String,
    quiz: String,
    complite: Boolean,
}) {
    request(ulist.url.toString().toLocaleLowerCase().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]/g, encodeURIComponent), async (err, res, html) => {
        if (!html) {
            await end(client, message, sdb);
            emerr.setDescription(`HTML을 찾을수 없습니다.`);
            return setTimeout(async () => {
                return message.channel.send(emerr).then(m => msgdelete(m, Number(process.env.deletetime)));
            }, 1250);
        }
        const $ = load(html);
        var dfname = [],
            dfvocal = [],
            dflink = [];
        $('body div.music div').each(async function () {
            dfname.push($(this).children('a.name').text().trim());
            dfvocal.push($(this).children('a.vocal').text().trim());
            dflink.push(process.env.mqsite + $(this).children('a.link').attr('href').trim().replace('../..','').replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\s]/g, encodeURIComponent));
        });
        var rndlist = [],
            name = [],
            vocal = [],
            link = [];
        var count = dfname.length;
        if (count > 50) count = 50;
        var logtext = '';
        for (i=0; i<count; i++) {
            var r = Math.floor(Math.random()*(dfname.length+1));
            if (r >= 50 || rndlist.includes(r) || dfname[r] == '' || dfname[r] == undefined) {
                i--;
                continue;
            }
            rndlist.push(r);
            name.push(dfname[r]);
            vocal.push(dfvocal[r]);
            link.push(dflink[r]);
            logtext += `${i+1}. ${dfvocal[r]}-${dfname[r]} [${r+1}]\n`;
        }
        log.quizlog(message, logtext, new Date());
        var img = sdb.quiz;
        img.quiz.name = name;
        img.quiz.vocal = vocal;
        img.quiz.link = link;
        img.quiz.count = 0;
        img.start.start = true;
        img.start.user = false;
        sdb.quiz = img;
        await sdb.save();
        return await quiz.img(client, message, args, sdb, vchannel, user);
    });
    return;
}

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}