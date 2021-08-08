
require('dotenv').config();
const db = require('quick.db');
const { Client, Message } = require('discord.js');
const MDB = require('../../MDB/data');
const log = require('../../log/log');

const msg = require('./msg');
const allmsgdelete = require('./msgdelete');

module.exports = end = async function (client = new Client, message = new Message, sdb = MDB.object.server) {
    db.set(`db.${message.guild.id}.quiz.startcheck`, false);
    db.set(`db.${message.guild.id}.mq.timer`, false);
    db.set(`db.${message.guild.id}.img.timer`, false);
    db.set(`db.${message.guild.id}.img.time`, sdb.quiz.anser.imgtime);
    sdb.quiz.start.userid = '';
    sdb.quiz.quiz.name = [];
    sdb.quiz.quiz.vocal = [];
    sdb.quiz.quiz.link = [];
    sdb.quiz.quiz.count = 0;
    sdb.quiz.quiz.nowanser = '-';

    sdb.quiz.user.hint = [];
    sdb.quiz.user.skip = [];

    sdb.quiz.start.start = false;
    sdb.quiz.start.embed = false;
    sdb.quiz.start.user = false;
    sdb.quiz.start.hint = false;

    sdb.quiz.page.click = 0;
    sdb.quiz.page.now = 0;
    sdb.quiz.page.slide = 0;
    sdb.quiz.page.p1 = 0;
    sdb.quiz.page.p2 = 0;
    sdb.quiz.page.p3 = 0;
    sdb.quiz.page.p4 = 0;

    sdb.tts.tts = true;

    await sdb.save();
    var time = sdb.quiz.anser.time;
    var list = await msg.list();
    var np = await msg.np(time);
    try {
        message.guild.me.voice.channel.leave();
    } catch(err) {}
    try {
        client.channels.cache.get(sdb.quiz.vcid).leave();
    } catch(err) {}
    try {
        var c = client.channels.cache.get(sdb.quiz.qzchannelid);
        c.messages.fetch(sdb.quiz.msg.listid).then(m => {
            m.edit(list);
        });
        c.messages.fetch(sdb.quiz.msg.npid).then(m => {
            m.edit(np);
            m.reactions.removeAll();
        });
    } catch(err) {}
    await allmsgdelete(client, sdb, 950);
};