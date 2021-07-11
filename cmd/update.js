
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const MDB = require('../MDB/data');
const sdata = MDB.module.server();
const udata = MDB.module.user();
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
        return client.commands.get(`${this.name}`).run(client, message, args, sdb, user);
    }
    udb.name = user.username;
    command
});
*/

const per = new MessageEmbed()
    .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
    .setColor('RED');

module.exports = {
    name: 'update',
    aliases: ['업데이트'],
    description: '업데이트 로그전송',
    async run (client = new Client, message = new Message, args = Array, sdb = MDB.object.server, user = new User) {
        var pp = db.get(`dp.prefix.${message.member.id}`);
        if (pp == (null || undefined)) {
            await db.set(`db.prefix.${message.member.id}`, process.env.prefix);
            pp = process.env.prefix;
        }
        if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));

        if (args[0] == '채널생성') {
            return message.guild.channels.create(`📃업데이트`, { // ${client.user.username}-음악퀴즈채널
                type: 'text',
                topic: `패치내용이 기록됩니다.`,
                permissionOverwrites: [{
                    id: message.guild.roles.everyone,
                    allow: ['VIEW_CHANNEL','READ_MESSAGE_HISTORY'],
                    deny: ['SEND_MESSAGES','ADD_REACTIONS']
                }]
            }).then(channel => {
                sdb.update = channel.id;
                sdb.save().catch(err => log.errlog(err));
            });
        }
        if (args[0] == '전송') {
            var udb = MDB.object.user;
            udb = await udata.findOne({userID: user.id});
            if (udb.admin) {
                log.botlog(message, `% 업데이트 사항 %\n${args.slice(1).join(' ')}`, new Date());
                return sdata.find().then(async (db2_list) => {
                    var sdb2 = MDB.object.server;
                    for (db2 of db2_list) {
                        sdb2 = db2;
                        if (sdb2.update) {
                            var ch = client.guilds.cache.get(sdb2.serverid).channels.cache.get(sdb2.update) || null;
                            if (ch) ch.send(
                                new MessageEmbed()
                                    .setAuthor(client.user.username, client.user.avatarURL({size:1024,format:'png',dynamic:true}))
                                    .setDescription(args.slice(1).join(' '))
                                    .setTimestamp()
                                    .setColor('ORANGE')
                            );
                        }
                    }
                });
            } else {
                return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));
            }
        }
        return help(message, pp);
    },
};

function help(message = new Message, pp='') {
    message.channel.send(
        new MessageEmbed()
            .setTitle(`**업데이트 도움말**`)
            .setDescription(`
                \` 관리자 명령어 \`
                ${pp}업데이트 채널생성
                 : 봇의 업데이트 사항을 받아볼수있는 채널을 생성합니다.
            `)
            .setColor('ORANGE')
    ).then(m => msgdelete(m, Number(process.env.deletetime)*4));
}

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
