
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message } = require('discord.js');
const MDB = require('../../MDB/data');
const log = require('../../log/log');

module.exports = {
    set,
    play,
};

function set(message = new Message, sdb = MDB.object.server, start = Boolean) {
    db.set(`db.${message.guild.id}.tts.timeron`, start);
    db.set(`db.${message.guild.id}.tts.timertime`, Number(process.env.ttsout)*60);
}
async function play(message = new Message, sdb = MDB.object.server) {
    setInterval(async () => {
        var time = db.get(`db.${message.guild.id}.tts.timertime`);
        if (!time) time = Number(process.env.ttsout)*60;
        var status = db.get(`db.${message.guild.id}.tts.timerstatus`);
        if (status) {
            db.set(`db.${message.guild.id}.tts.timerstatus`, false);
            var userid = db.get(`db.${message.guild.id}.tts.timeruserid`);
            db.set(`db.${message.guild.id}.tts.timeruserid`, '');
            var text = `** ${message.guild.name} 서버 **\nTTS타이머가 실행중입니다.\n시간 : ${time}\n음악퀴즈 : ${sdb.quiz.start.start}`;
            log.botlog(message, text, new Date());
            const user = (message.guild.members.cache.get(userid)) ? message.guild.members.cache.get(userid).user : undefined;
            if (user) {
                user.send(new MessageEmbed().setDescription(text).setColor('ORANGE'))
                    .catch(() => {return;})
                    .then(m => msgdelete(m, Number(process.env.deletetime)*3));
            }
        }
        if (!sdb.quiz.start.start) {
            var on = db.get(`db.${message.guild.id}.tts.timeron`);
            if (on) {
                if (time <= 0) {
                    set(message, sdb, false);
                    try {
                        message.guild.me.voice.channel.leave();
                    } catch(err) {}
                } else {
                    db.set(`db.${message.guild.id}.tts.timertime`, time-5);
                }
            } else {
                set(message, sdb, false);
            }
        }
    }, 5000);
}

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}