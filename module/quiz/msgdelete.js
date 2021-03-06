
require('dotenv').config();
const { Client } = require('discord.js');
const MDB = require('../../MDB/data');
const log = require('../../log/log');

module.exports = allmsgdelete;

async function allmsgdelete (client = new Client, sdb = MDB.object.server, time = Number || 50) {
    try {
        var ch = client.channels.cache.get(sdb.quiz.qzchannelid) || null;
        setTimeout(async function() {
            if (ch) {
                ch.messages.fetch({ after: sdb.quiz.msg.npid }).then(async function(msg) {
                    if (msg.size > 1) {
                        try {
                            ch.bulkDelete(msg.size);
                        } catch(err) {}
                    }
                });
            }
        }, time);
    } catch(err) {}
}