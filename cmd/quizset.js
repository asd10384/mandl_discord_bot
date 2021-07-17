
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const MDB = require('../MDB/data');
const log = require('../log/log');

const msg = require('../module/quiz/msg');
const end = require('../module/quiz/end');

const per = new MessageEmbed()
    .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
    .setColor('RED');

module.exports = {
    name: 'quizset',
    aliases: ['퀴즈설정','qzset'],
    description: '퀴즈채널을 만들고 봇과 연결함',
    async run (client = new Client, message = new Message, args = new Array, pp = process.env.prefix, sdb = MDB.object.server, user = new User) {
        if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));

        message.guild.channels.create(`🎵마엔롤 퀴즈`, { // ${client.user.username}-퀴즈채널
            type: 'text',
            topic: `정답은 채팅으로 치시면 됩니다.`
        }).then(async c => {
            sdb.quiz.qzchannelid = c.id;
            var time = sdb.quiz.anser.time;
            var score = await msg.score();
            var list = await msg.list();
            var np = await msg.np(time);
            c.send(score).then(async (m) => {
                sdb.quiz.msg.scoreid = m.id;
                await sdb.save().catch(err => log.errlog(err));
            });
            c.send(list).then(async (m) => {
                sdb.quiz.msg.listid = m.id;
                await sdb.save().catch(err => log.errlog(err));
            });
            c.send(np).then(async (m) => {
                sdb.quiz.msg.npid = m.id;
                await sdb.save().catch(err => log.errlog(err));
            });
        });
        return setTimeout(async () => {
            await end(client, message, sdb);
        }, 3000);
    },
};

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
