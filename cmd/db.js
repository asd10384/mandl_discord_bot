
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const MDB = require('../MDB/data');
const log = require('../log/log');

/*
const MDB = require('../../MDB/data');
const udata = MDB.module.user();

udata.findOne({
    userID: user.id
}, async (err, db1) => {
    var udb = MDB.object.user;
    udb = db1;
    if (err) log.errlog(err);
    if (!udb) {
        await MDB.set.user(user);
        return client.commands.get(`${this.name}`).run(client, message, args, pp, sdb, user);
    }
    udb.name = user.username;
    command
});
*/

const per = new MessageEmbed()
    .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
    .setColor('RED');

module.exports = {
    name: 'db',
    aliases: ['데이터베이스'],
    description: '로그로 데이터베이스 확인',
    async run (client = new Client, message = new Message, args = new Array, pp = process.env.prefix, sdb = MDB.object.server, user = new User) {
        if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));

        var w = db.fetch(`db`);
        var text = '';
        for (i in w) {
            text += `\n${i}: {\n`;
            for (j in w[i]) {
                if (String(w[i][j]) === '[object Object]') {
                    text += `  ${j}: {\n`;
                } else {
                    text += `  ${j}: ${w[i][j]}\n`;
                }
                for (k in w[i][j]) {
                    text += `    ${k}: ${w[i][j][k]}\n`;
                }
                if (String(w[i][j]) === '[object Object]') text += `  }\n`;
            }
            text += `}\n`;
        }
        return log.botlog(message, text, new Date());
    },
};

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
