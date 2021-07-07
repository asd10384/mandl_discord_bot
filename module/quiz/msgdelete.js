
require('dotenv').config();
const { Client } = require('discord.js');
const MDB = require('../../MDB/data');
const log = require('../../log/log');

module.exports = allmsgdelete = async function (client = new Client, sdb = MDB.object.server, time = Number || 50) {
    try {
        var c = client.channels.cache.get(sdb.quiz.qzchannelid);
        setTimeout(async function() {
            await c.messages.fetch({ after: sdb.quiz.msg.npid }).then(async function(msg) {
                if (msg.size <= 1) return;
                await c.bulkDelete(msg.size);
            });
        }, time);
    } catch(err) {
        return;
    }
    return;
}