
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const { MessageButton } = require('discord-buttons');
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
    name: '버튼',
    aliases: [],
    description: '버튼 테스트',
    async run (client = new Client, message = new Message, args = new Array, pp = process.env.prefix, sdb = MDB.object.server, user = new User) {
        if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));
        
        const embed = new MessageEmbed()
            .setTitle(`버튼 테스트`)
            .setDescription(`당신은 똑똑합니까?`)
            .setColor('ORANGE');

        const yes = new MessageButton()
            .setLabel("네")
            .setID("yes")
            .setStyle("green");
        const no = new MessageButton()
            .setLabel("아니요")
            .setID("no")
            .setStyle("red");

        return message.channel.send(embed, {
            buttons: [
                yes,
                no
            ]
        });
    },
};

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
