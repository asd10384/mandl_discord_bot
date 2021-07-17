
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const MDB = require('../MDB/data');
const log = require('../log/log');

const checkvoice = require('../module/quiz/check');
const start = require('../module/quiz/start');
const end = require('../module/quiz/end');
const { anser } = require('../module/quiz/quiz');
const { hint } = require('../module/quiz/user');

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
const vchannelerr = new MessageEmbed()
    .setTitle(`**퀴즈 오류**`)
    .setDescription(`음성채널에 들어간 뒤 사용해주세요.`)
    .setColor('RED');
const emerr = new MessageEmbed()
    .setTitle(`**퀴즈 오류**`)
    .setColor('RED');

module.exports = {
    name: 'quiz',
    aliases: ['퀴즈','qz'],
    description: '퀴즈 도움말',
    async run (client = new Client, message = new Message, args = new Array, pp = process.env.prefix, sdb = MDB.object.server, user = new User) {
        // if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));

        if (args[0] == '시작' || args[0] == 'start') {
            // 음성확인
            var vchannel = await checkvoice(message, sdb);
            if (!vchannel.success) return message.channel.send(vchannelerr).then(m => msgdelete(m, Number(process.env.deletetime)));
            
            if (!sdb.quiz.start.embed) {
                sdb.quiz.start.embed = true;
                return await start.start(client, message, args, sdb, vchannel, user);
            } else {
                emerr.setDescription(`
                    이미 퀴즈 시작을 입력하셨습니다.

                    **${process.env.prefix}퀴즈 종료**
                    를 입력하신뒤 다시 시도해주세요.
                `);
                return message.channel.send(emerr).then(m => msgdelete(m, Number(process.env.deletetime)));
            }
        }
        if (args[0] == '종료' || args[0] == 'stop') {
            sdb.quiz.start.embed = false;
            return await end(client, message, sdb);
        }
        if (args[0] == '힌트' || args[0] == 'hint') {
            return await hint(client, message, ['관리자'], sdb, user);
        }
        if (args[0] == '스킵' || args[0] == 'skip') {
            return await anser(client, message, ['스킵','관리자'], sdb, user);
        }
        if (args[0] == '설정' || args[0] == 'setting') {
            return message.channel.send(`현재 제작중`).then(m => msgdelete(m, Number(process.env.deletetime)));
        }
        if (args[0] == '기본설정') {
            if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));
            client.commands.get('quizset').run(client, message, args, pp, sdb, user);
        }
        if (args[0] == '도움말' || args[0] == '명령어' || args[0] == 'help' || args[0] == 'info') {
            const help = new MessageEmbed()
                .setTitle(`**퀴즈 도움말**`)
                .setDescription(`
                    \` 명령어 \`
                    ${pp}퀴즈 시작 : 퀴즈를 시작합니다.
                    ${pp}퀴즈 중지 : 진행중인 퀴즈를 멈춥니다.
                    ${pp}퀴즈 설정 : 정답형식이나 시간을 설정할수 있습니다.
    
                    \` 관리자 명령어 \`
                    ${pp}퀴즈 기본설정 : 퀴즈 채널을 생성합니다.
                    ${pp}퀴즈 스킵 : 투표없이 스킵합니다.
                    ${pp}퀴즈 힌트 :투표없이 힌트를 받습니다.
                `)
                .setColor('ORANGE');
            return message.channel.send(help).then(m => msgdelete(m, Number(process.env.deletetime)*3));
        }
        return ;
    },
};

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
