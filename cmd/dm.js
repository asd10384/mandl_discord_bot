
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
const embed = new MessageEmbed()
    .setColor('ORANGE');

module.exports = {
    name: 'dm',
    aliases: ['디엠'],
    description: '봇 -> 유저 디엠 보내기',
    async run (client = new Client, message = new Message, args = new Array, pp = process.env.prefix, sdb = MDB.object.server, user = new User) {
        if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));

        if (args[0]) {
            const tuser = message.guild.members.cache.get(args[0].replace(/[^0-9]/g, '')) || undefined;
            if (tuser) {
                const username = (tuser && tuser.nickname) ? tuser.nickname : tuser.user.username;
                if (args[1]) {
                    var text = args.slice(1).join(' ');
                    tuser.send(text).catch(() => {
                        embed.setTitle(`\` ${username} \`의 dm 을 찾을수 없습니다.`)
                            .setColor('RED');
                        message.member.user.send(embed).then(m => msgdelete(m, Number(process.env.deletetime)*2));
                    }).then(() => {
                        embed.setTitle(`\` ${username} \`에게 성공적으로 dm 을 보냈습니다.`)
                            .setDescription(`\` 내용 \`\n\n${text}`);
                        message.member.user.send(embed).then(m => msgdelete(m, Number(process.env.deletetime)*2));
                    });
                    return;
                }
            }
        }
    },
};

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
