
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const MDB = require('../MDB/data');
const log = require('../log/log');
const sncheckobj = require('../module/tts/set/signature')[1];

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
    name: 'signature',
    aliases: ['시그니처','시그니쳐'],
    description: '시그니처 확인',
    async run (client = new Client, message = new Message, args = Array, sdb = MDB.object.server, user = new User) {
        var pp = db.get(`dp.prefix.${message.member.id}`);
        if (pp == (null || undefined)) {
            await db.set(`db.prefix.${message.member.id}`, process.env.prefix);
            pp = process.env.prefix;
        }
        // if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));

        var text = ``;
        for (obj of sncheckobj) {
            text += `${obj['url']}\n`;
            for (i of obj['name']) {
                text += `-  ${i}\n`;
            }
            text += `\n`;
        }
        const embed = new MessageEmbed()
            .setTitle(`\` 시그니처 확인 \``)
            .setDescription(text)
            .setColor('ORANGE')
            .setFooter('- 뒤에있는게 입력하는 문구');
        return message.channel.send(embed).then(m => msgdelete(m, Number(process.env.deletetime)*5));
    },
};

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
