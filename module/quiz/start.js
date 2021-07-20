
require('dotenv').config();
const db = require('quick.db');
const request = require('request');
const { MessageEmbed, Client, Message, Channel, User } = require('discord.js');
const MDB = require('../../MDB/data');
const log = require('../../log/log');
const ready = require('./ready');
const end = require('./end');

module.exports = {
    start,
    start_em
};
async function start (client = new Client, message = new Message, args = Array, sdb = MDB.object.server, vchannel = new Channel, user = new User) {
    sdb.quiz.start.userid = user.id;
    await start_em(client, message, args, sdb, vchannel, user, {
        first: true,
    });
    await db.set(`db.${message.guild.id}.mq.timer`, true);
}
async function start_em (client = new Client, message = new Message, args = Array, sdb = MDB.object.server, vchannel = new Channel, user = new User, opt = {
    first: Boolean,
}) {
    var data = sdb.quiz;
    const url = `${process.env.mqsite}/music_list.js`;
    request(url, async (err, res, body) => {
        if (!err) {
            var dflist = eval(body)[0];
            var text = [`\n`];

            if (opt.first) {
                data.page.slide = 0;
                data.page.now = 1;
                data.page.p1 = 0;
                try {
                    var c = client.channels.cache.get(data.qzchannelid);
                    c.messages.fetch(data.msg.npid).then(m => {
                        m.reactions.removeAll();
                        m.react('⬅️');
                        m.react('1️⃣');
                        m.react('2️⃣');
                        m.react('3️⃣');
                        m.react('4️⃣');
                        m.react('5️⃣');
                        m.react('↩️');
                        m.react('➡️');
                    });
                } catch(err) {}
            }
            var ulist;
            var keys1, keys2, keys3, keys4;
            if (data.page.now >= 1) {
                try {
                    keys1 = Object.keys(dflist);
                } catch(err) {
                    keys1 = undefined;
                }
                ulist = dflist;
                if (data.page.now >=2) {
                    try {
                        keys2 = Object.keys(
                            dflist[
                                keys1[data.page.p1-1]
                            ]
                        );
                    } catch(err) {
                        keys2 = undefined;
                    }
                    ulist = dflist[
                        keys1[data.page.p1-1]
                    ];
                    if (data.page.now >=3) {
                        try {
                            var keys3 = Object.keys(
                                dflist[
                                    keys1[data.page.p1-1]
                                ][
                                    keys2[data.page.p2-1]
                                ]
                            );
                        } catch(err) {
                            keys3 = undefined;
                        }
                        ulist = dflist[
                            keys1[data.page.p1-1]
                        ][
                            keys2[data.page.p2-1]
                        ];
                        if (data.page.now >=4) {
                            try {
                                keys4 = Object.keys(
                                    dflist[
                                        keys1[data.page.p1-1]
                                    ][
                                        keys2[data.page.p2-1]
                                    ][
                                        keys3[data.page.p3-1]
                                    ]
                                );
                            } catch(err) {
                                keys4 = undefined;
                            }
                            ulist = dflist[
                                keys1[data.page.p1-1]
                            ][
                                keys2[data.page.p2-1]
                            ][
                                keys3[(data.page.slide*5)+data.page.p3-1]
                            ];
                            if (data.page.now >=5) {
                                if (data.page.click == 1) {
                                    data.page.now = 1;
                                    data.page.click = 0;
                                    data.page.p1 = 0;
                                    data.page.p2 = 0;
                                    data.page.p3 = 0;
                                    data.page.p4 = 0;
                                    data.quiz.quizurl = ulist.url.replace(new RegExp(`${process.env.mqsite}|.html`, 'g'), '');
                                    await db.set(`db.${message.guild.id}.mq.timer`, false);
                                    return await ready(client, message, args, sdb, vchannel, user, ulist);
                                }
                                data.page.now = 3;
                                data.page.p4 = 0;
                                ulist = dflist[
                                    keys1[data.page.p1-1]
                                ][
                                    keys2[data.page.p2-1]
                                ];
                            }
                        }
                    }
                }
            }
            if (!ulist) {
                data.page.now = data.page.now-1;
                data.page.slide = 0;
                return sdb.save();
            }
            sdb.save();
            var slide = data.page.slide;
            if (data.page.now == 4) {
                slide = 0;
                var urllist = ulist.url.split('/');
                text[0] = `**이름** : ${urllist[urllist.length-1].replace('.html','')}\n**형식** : ${(ulist.quiz.music) ? `음악퀴즈` : (ulist.quiz || !ulist.quiz == '') ? ulist.quiz : `지정되지 않음`}\n**설명** : ${(ulist.desc || !ulist.desc == '') ? ulist.desc : `설명이 없습니다.`}\n**완성도** : ${(ulist.complite === 100) ? `완성` : (ulist.complite === 0) ? `미완성` : `${ulist.complite}%`}\n\n1️⃣ 시작하기\n2️⃣ 뒤로가기\n`;
            } else {
                var uname = Object.keys(ulist);
                var i = 0, it = '', p = 0;
                while (i < uname.length) {
                    it = bignum((i+1)-(p*5));
                    if (!text[p]) text[p] = '\n';
                    text[p] += `${it}  ${uname[i]}\n`;
                    i++;
                    if (i % 5 == 0) p++;
                }
                if (slide < 0) slide = 0;
                if (slide > text.length-1) slide = text.length-1;
            }
            const np = new MessageEmbed()
                .setTitle(`** [퀴즈 선택화면 ]**`)
                .setDescription(`
                    **\` 아래 숫자를 눌러 선택해주세요. \`**

                    ${text[slide]}
                        
                    (아래 이모지가 전부 로딩된 뒤 선택해주세요.)
                `)
                .setFooter(`기본 명령어 : ${process.env.prefix}퀴즈 도움말`)
                .setColor('ORANGE');
            try {
                var c = client.channels.cache.get(data.qzchannelid);
                c.messages.fetch(data.msg.npid).then(m => {
                    m.edit(np);
                });
            } catch(err) {}
        } else {
            return await end(client, message, sdb);
        }
    });
    return;
}

function bignum(num=1) {
    return num == 1 ? '1️⃣' : num == 2 ? '2️⃣' : num == 3 ? '3️⃣' : num == 4 ? '4️⃣' : '5️⃣';
}