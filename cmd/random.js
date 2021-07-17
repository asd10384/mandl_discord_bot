
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const MDB = require('../MDB/data');
const log = require('../log/log');
const champions = require('lol-champions');
const rgobj = {
    Slayer: '암살자',
    Fighter: '전사',
    Mage: '마법사',
    Marksman: '원딜',
    Tank: '탱커'
};
const rglist = Object.keys(rgobj);
const rgcheck = new RegExp(rglist.join('|'), 'gi');

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

const em = new MessageEmbed()
    .setColor('ORANGE');
const err = new MessageEmbed()
    .setTitle(`**랜덤 오류**`)
    .setColor('RED');
const per = new MessageEmbed()
    .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
    .setColor('RED');

module.exports = {
    name: 'random',
    aliases: ['랜덤'],
    description: '랜덤 [도움말]',
    async run (client = new Client, message = new Message, args = new Array, pp = process.env.prefix, sdb = MDB.object.server, user = new User) {
        // if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));

        if (args[0] == '주사위') {
            em.setTitle(`**랜덤 주사위**`)
                .setDescription(`
                    **랜덤 숫자는?**
                    ${random_bignum({})}
                `);
            return message.channel.send(em).then(m => msgdelete(m, Number(process.env.deletetime)*2));
        }
        if (args[0] == '캐릭터' || args[0] == '챔피언') {
            if (args[1]) {
                if (!isNaN(args[1])) {
                    var list = [];
                    var del = [];
                    var ernum = 0;
                    for (i=0; i<Number(args[1]); i++) {
                        if (ernum > 100) break;
                        var r = random({min: 0, max: champions.length-1});
                        if (del.includes(r)) {
                            i--;
                            ernum++;
                            continue;
                        } else {
                            del.push(r);
                            ernum = 0;
                            list.push(champions[r]);
                        }
                    }
                    const embed = new MessageEmbed()
                        .setTitle(`**롤 캐릭터 추천 - ${args[1]}명**`)
                        .setFooter(`${pp}랜덤 도움말`)
                        .setColor('ORANGE');
                    for (i in list) {
                        embed.addField(`**${Number(i)+1}.** ${list[i].name}`, `[OP.GG 바로가기](https://op.gg/champion/${list[i].id})`);
                    }
                    return message.channel.send(embed).then(m => msgdelete(m, Number(process.env.deletetime)*5));
                }
            }
            var champ = champions[random({min: 0, max: champions.length-1})];
            for (i in champ.tags) {
                champ.tags[i] = champ.tags[i].replace(rgcheck, (val) => rgobj[val]) || champ.tags[i];
            }
            const embed = new MessageEmbed()
                .setTitle(`**롤 캐릭터 추천**`)
                .setDescription(`
                    [** \` OP.GG 바로가기 \`**](https://op.gg/champion/${champ.id})
                    
                    \`이름\`
                    ${champ.name}
                    \` 역활 \`
                    ${champ.tags.join(' , ')}
                    
                    \` 능력치 \`
                    **기본체력** : ${champ.stats.hp}
                    **이동속도** : ${champ.stats.movespeed}
                    **공격거리** : ${champ.stats.attackrange}
                    **공격속도** : ${champ.stats.attackspeed}
                `)
                .setThumbnail(champ.icon)
                .setFooter(`${pp}랜덤 도움말`)
                .setColor('ORANGE');
            return message.channel.send(embed).then(m => msgdelete(m, Number(process.env.deletetime)*6));
        }
        if (args[0]) {
            if (args[0].match(/^[0-9]+$/)) {
                if (args[1]) {
                    if (args[1].match(/^[0-9]+$/)) {
                        em.setTitle(`**랜덤 ${args[0]}~${args[1]}**`)
                            .setDescription(`
                                **랜덤 숫자는?**
                                ${random_bignum({
                                    min: Number(args[0]),
                                    max: Number(args[1]),
                                })}
                            `);
                        return message.channel.send(em).then(m => msgdelete(m, Number(process.env.deletetime)*3));
                    }
                    err.setDescription(`숫자만 사용할수 있습니다.`);
                    return message.channel.send(err).then(m => msgdelete(m, Number(process.env.deletetime)));
                }
                em.setTitle(`**랜덤 1~${args[0]}**`)
                    .setDescription(`
                        **랜덤 숫자는?**
                        ${random_bignum({
                            max: Number(args[0]),
                        })}
                    `);
                return message.channel.send(em).then(m => msgdelete(m, Number(process.env.deletetime)*3));
            }
            if (args[0] == '도움말' || args[0] == '명령어' || args[0] == 'help') return await help(message, pp);
            err.setDescription(`숫자(자연수)만 사용할수 있습니다.`);
            return message.channel.send(err).then(m => msgdelete(m, Number(process.env.deletetime)));
        }
        return await help(message, pp);
    },
};

async function help(message = new Message, pp = String || ';') {
    const help = new MessageEmbed()
        .setTitle(`**랜덤 도움말**`)
        .setDescription(`
            \` 명령어 \`
            ${pp}랜덤 [숫자]
             : 1~[숫자] 까지중에 랜덤한 정수
            ${pp}랜덤 [숫자1] [숫자2]
             : [숫자1]~[숫자2] 까지중에 랜덤한 정수
            ${pp}랜덤 주사위
             : 1~6중 랜덤
            
            \` 리그오브레전드[롤] \`
            ${pp}랜덤 캐릭터
             : 캐릭터 하나를 무작위로 추천합니다.
            ${pp}랜덤 캐릭터 [숫자]
             : 캐릭터 [숫자]만큼을 무작위로 추천합니다.
        `)
        .setColor('ORANGE');
    const m = await message.channel.send(help);
    return msgdelete(m, Number(process.env.deletetime) * 3);
}

function random({ min = 1, max = 6}) {
    return Math.floor(Math.random() * ((max+1) - min)) + min;
}
function random_bignum({ min = 1, max = 6 }) {
    const rnum =  Math.floor(Math.random() * ((max+1) - min)) + min;
    var text = '\n';
    for (i of String(rnum)) {
        text += (i == 0) ? '0️⃣' : 
            (i == 1) ? '1️⃣' : 
            (i == 2) ? '2️⃣' : 
            (i == 3) ? '3️⃣' : 
            (i == 4) ? '4️⃣' : 
            (i == 5) ? '5️⃣' : 
            (i == 6) ? '6️⃣' : 
            (i == 7) ? '7️⃣' : 
            (i == 8) ? '8️⃣' :
            '9️⃣';
    }
    return text;
}

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
