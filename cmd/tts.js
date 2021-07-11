
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const MDB = require('../MDB/data');
const Udata = MDB.module.user();
const log = require('../log/log');

const tts = require('../module/tts/tts');
const ttstimer = require('../module/tts/timer');
const ban = require('../module/tts/ban');

const per = new MessageEmbed()
    .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
    .setColor('RED');

module.exports = {
    name: 'tts',
    aliases: ['ㅅㅅㄴ'],
    description: `${process.env.prefix}tts help`,
    async run (client = new Client, message = new Message, args = Array, sdb = MDB.object.server, user = new User, chat = false) {
        var pp = db.get(`dp.prefix.${message.member.id}`);
        if (pp == (null || undefined)) {
            await db.set(`db.prefix.${message.member.id}`, process.env.prefix);
            pp = process.env.prefix;
        }
        // if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));

        if (!args[0]) return;

        var timerstart = db.get(`db.${message.guild.id}.tts.timerstart`);
        if (!timerstart) {
            db.set(`db.${message.guild.id}.tts.timerstart`, true);
            await ttstimer.play(message, sdb);
        }

        if (args[0] == 'help' || args[0] == '도움말' || args[0] == '명령어') {
            const help = new MessageEmbed()
                .setTitle(`\` 명령어 \``)
                .setDescription(`
                    \` 메인 명령어 \`
                    ${pp}tts [messages] : 메세지를 음성으로 재생
                    ${pp}tts 채널설정 : tts채팅방을 만들고 봇과 연결합니다.
                    
                    ${pp}tts 이동 활성화
                     : 메세지를 입력했을때 다른방에 봇이 있으면 봇을 불러옵니다.
                    ${pp}tts 이동 비활성화
                    : 메세지를 입력했을때 다른방에 봇이 있으면 봇을 불러오지않습니다.

                    \` 관련 명령어 \`
                    ${pp}join [voice channel id]
                    ${pp}leave
                `)
                .setColor('RANDOM');
            return message.channel.send(help).then(m => msgdelete(m, Number(process.env.deletetime)*3));
        }
        if (args[0] == 'channelset' || args[0] == '채널설정') {
            const command = client.commands.get('ttsset');
            return await command.run(client, message, args, sdb);
        }
        if (args[0] == 'ban' || args[0] == '밴' || args[0] == '뮤트') {
            if (chat) msgdelete(message, 50);
            if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, msg_time));
            return await ban.ban(client, message, args, sdb, user, pp);
        }
        if (args[0] == 'unban' || args[0] == '언밴' || args[0] == '언벤' || args[0] == '해제') {
            if (chat) msgdelete(message, 50);
            if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, msg_time));
            return await ban.unban(client, message, args, sdb, user, pp);
        }
        if (args[0] == '이동') {
            var onoff = '';
            if (args[1] == '활성화' || args[1] == 'on') onoff = 'on';
            if (args[1] == '비활성화' || args[1] == 'off') onoff = 'off';
            if (onoff) {
                if (onoff == 'on') {
                    if (!sdb.tts.move) return message.channel.send(eb(pp, 'RED', `오류`, `봇 이동이 이미 **활성화** 되어있습니다.`)).then(m => msgdelete(m, Number(process.env.deletetime)));
                    sdb.tts.move = false;
                    sdb.save().catch((err) => log.errlog(err));
                    return message.channel.send(eb(pp, 'ORANGE', `활성화`, `봇 이동이 **활성화** 되었습니다.`)).then(m => msgdelete(m, Number(process.env.deletetime))*3);
                }
                if (onoff == 'off') {
                    if (sdb.tts.move) return message.channel.send(eb(pp, 'RED', `오류`, `봇 이동이 이미 **비활성화** 되어있습니다.`)).then(m => msgdelete(m, Number(process.env.deletetime)));
                    sdb.tts.move = true;
                    sdb.save().catch((err) => log.errlog(err));
                    return message.channel.send(eb(pp, 'ORANGE', `비활성화`, `봇 이동이 **비활성화** 되었습니다.`)).then(m => msgdelete(m, Number(process.env.deletetime))*3);
                }
            }
        }
        ttstimer.set(message, sdb, true);
        return await tts.tts(client, message, args, sdb, user);
    },
};

function eb(pp = '', color = '', title = '', disc = '') {
    return new MessageEmbed()
        .setTitle(`**tts 이동 ${title}**`)
        .setDescription(disc)
        .setFooter(`${pp}tts 도움말`)
        .setColor(color);
}

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
