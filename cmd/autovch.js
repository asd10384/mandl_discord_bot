
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const MDB = require('../MDB/data');
const log = require('../log/log');
const mandl = MDB.module.mandl();

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
    name: '자동음성채널',
    aliases: ['자음채','autovch'],
    description: '자동으로 음성채널을 생성합니다.',
    async run (client = new Client, message = new Message, args = new Array, pp = process.env.prefix, sdb = MDB.object.server, user = new User) {
        if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));

        if (args[0] == '도움말') {
            return help(message, pp);
        }
        if (args[0] == '확인') {
            return await mandl.find({type: 'vchannel', guildid: message.guild.id}).then(async (obj) => {
                var text = '';
                var cart, vc;
                for (i in obj) {
                    var mdb = MDB.object.mandl;
                    mdb = obj[i];

                    if (mdb.vc[0].type === 'set') {
                        cart = message.guild.channels.cache.get(mdb.vc.cart);
                        vc = message.guild.channels.cache.get(mdb.id);
                        text += `**카테고리** : <#${mdb.vc.cart}>\n**채널이름** : <#${mdb.id}>\n\n`;
                    }
                }
                return message.channel.send(
                    embed.setTitle(`**자동음성채널 확인**`)
                    .setDescription((text == '') ? '없음' : text)
                    .setFooter(`${pp}자동음성채널 도움말`)
                ).then(m => msgdelete(m, Number(process.env.deletetime)*3));
            });
        }
        if (args[0] == '삭제' || args[0] == '제거') {
            if (args[1]) {
                var vc = message.guild.channels.cache.get(args[1]);
                if (vc) {
                    return await mandl.find({type: 'vchannel', guildid: message.guild.id}).then(async (obj) => {
                        for (i in obj) {
                            var mdb = MDB.object.mandl;
                            mdb = obj[i];
        
                            if (mdb.vc[0].type === 'set' && mdb.id === vc.id) {
                                await mandl.findOneAndDelete({type: 'vchannel', guildid: message.guild.id, vc: {type: 'set'}});
                                return message.channel.send(
                                    embed.setTitle(`**채널 제거완료**`)
                                    .setDescription(`
                                        \` 제거한 채널이름 \` : ${vc.name}
                                    `)
                                    .setFooter(`${pp}자동음성채널 확인`)
                                ).then(m => msgdelete(m, Number(process.env.deletetime)*2));
                            }
                            return emerr(message, pp, `등록되지 않은 채널입니다.`);
                        }
                        return emerr(message, pp, `채널을 찾을수 없습니다.`);
                    });
                }
                return emerr(message, pp, `채널을 찾을수 없습니다.`);
            }
            return message.channel.send(
                embed.setTitle(`**자동음성채널 제거 도움말**`)
                .setDescription(`**명령어**\n${pp}자동음성채널 제거 [음성채널아아디]`)
                .setFooter(`${pp}자동음성채널 제거`)
            ).then(m => msgdelete(m, Number(process.env.deletetime)*2));
        }
        if (args[0] == '등록') {
            var vcp = message.guild.channels.cache.get(args[1]);
            if (vcp) {
                var vc = message.guild.channels.cache.get(args[2]);
                if (vc) {
                    if (args[3]) {
                        if (!isNaN(args[3])) {
                            if (Number(args[3]) >= 0 && Number(args[3] < 100)) {
                                return await mandl.find({type: 'vchannel', guildid: message.guild.id}).then(async (obj) => {
                                    for (i in obj) {
                                        var mdb = MDB.object.mandl;
                                        mdb = obj[i];

                                        if (mdb.vc[0].type === 'set' && mdb.id === args[2]) {
                                            emerr(message, pp, `이 음성채널은 이미 등록되어있습니다.`);
                                            break;
                                        }
                                    }
                                    new mandl({
                                        type: 'vchannel',
                                        id: args[2],
                                        guildid: message.guild.id,
                                        vc: [{
                                            type: 'set',
                                            cart: args[1],
                                            lim: args[3]
                                        }]
                                    }).save();
                                    embed.setTitle(`**자동음성채널 등록 성공**`)
                                        .setDescription(`
                                            \` 등록한 채널이름 \` : **${vc.name}**
                                            \` 유저수 \` : ${(Number(args[3]) == 0) ? '제한없음' : `${Number(args[3])}명`}
                                        `)
                                        .setFooter(`${pp}자동음성채널 확인`);
                                    return message.channel.send(embed).then(m => msgdelete(m, Number(process.env.deletetime)*2));
                                });
                            }
                            return emerr(message, pp, `멤버수는 0이상 100미만 까지 설정하실수 있습니다.\n(0은 제한없음)`);
                        }
                        return emerr(message, pp, `멤버수는 숫자만 사용할수 있습니다.`);
                    }
                    return emerr(message, pp, `멤버수를 입력해주세요.\n(0은 제한없음)`);
                }
                return emerr(message, pp, `음성채널을 찾을수없습니다.`);
            }
            return emerr(message, pp, `카테고리를 찾을수없습니다.`);
        }
        return help(message, pp);
    },
};

async function emerr(message = new Message, pp = '', text = '') {
    embed.setTitle(`**자동음성채널 오류**`)
        .setDescription(text)
        .setFooter(`${pp}자동음성채널 도움말`)
        .setColor('RED');
    return message.channel.send(embed).then(m => msgdelete(m, Number(process.env.deletetime)));
}

async function help(message = new Message, pp = '') {
    embed.setTitle(`**자동음성채널 도움말**`)
        .setDescription(`
            **관리자 명령어**
            ${pp}자동음성채널 도움말 : 도움말 확인
            ${pp}자동음성채널 확인 : 설정 확인
            ${pp}자동음성채널 등록 [카테고리아이디] [음성채널아이디] [멤버수]
             : 등록한 음성채널에 유저가 들어가면 따로 음성채널방을 생성합니다.
             : 음성채널방은 설정한 카테고리에 생성됩니다.
             : 멤버수는 숫자로만 쓸수있습니다. (0 은 제한없음)
             : (등록할 음성채널은 꼭 카테고리안에 있어야합니다.)
            ${pp}자동음성채널 제거 [음성채널아이디]
             : 등록한 음성채널을 등록취소합니다.
        `);
    return message.channel.send(embed).then(m => msgdelete(m, Number(process.env.deletetime)*6));
}

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
