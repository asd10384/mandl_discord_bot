
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message } = require('discord.js');
const MDB = require('../../MDB/data');
const log = require('../../log/log');
const end = require('./end');

module.exports = {
    timer,
    img
}

async function timer(client = new Client, message = new Message, sdb = MDB.object.server) {
    const ontimer = setInterval(async () => {
        var ts = db.get(`db.${message.guild.id}.mq.timer`) || false;
        if (!ts) {
            return clearInterval(ontimer);
        }
        if (!(!!message.guild.me.voice.channel)) {
            await end(client, message, sdb);
            return clearInterval(ontimer);
        }
    }, 1000);
}
async function img(client = new Client, message = new Message, sdb = MDB.object.server, count = Number, all_count = Number, img = String) {
    const ontimer = setInterval(async () => {
        var ts = db.get(`db.${message.guild.id}.img.timer`) || false;
        var time = db.get(`db.${message.guild.id}.img.time`);
        if (time == null || undefined) time = sdb.quiz.anser.imgtime;
        if (ts) {
            if (time <= 0) {
                db.set(`db.${message.guild.id}.img.timer`, false);
                db.set(`db.${message.guild.id}.img.time`, sdb.quiz.anser.imgtime);
                await anser(client, message, ['스킵'], sdb, user);
                return clearInterval(ontimer);
            }
            if (time % 5 == 0 || (time < 10 && time % 2 == 1 && time > 3) || time < 3) {
                var np = new MessageEmbed()
                    .setTitle(`**정답 : ???**`)
                    .setDescription(`**남은시간 : ${time}**\n**문제 : ${count+1}/${all_count}**`)
                    .setImage(img)
                    .setFooter(`기본 명령어 : ${process.env.prefix}퀴즈 도움말`)
                    .setColor('ORANGE');
            
                try {
                    var c = client.channels.cache.get(sdb.quiz.qzchannelid);
                    c.messages.fetch(sdb.quiz.msg.npid).then(m => {
                        m.edit(np);
                    });
                } catch(err) {}
            }
        } else {
            return clearInterval(ontimer);
        }
        db.set(`db.${message.guild.id}.img.time`, time-1);
    }, 1000);
}