
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, Channel, User } = require('discord.js');
const MDB = require('../../MDB/data');
const log = require('../../log/log');

const mqscore = require('./score');
const { play, broadcast } = require('../tts/play');
const setquiz = require('./setquiz');
const quiz = require('./quiz');

const emerr = new MessageEmbed()
    .setTitle(`**퀴즈 오류**`)
    .setColor('RED');

module.exports = ready = async function (client = new Client, message = new Message, args = Array, sdb = MDB.object.server, vchannel = new Channel, user = new User, ulist = {
    url: String,
    desc: String,
    quiz: String,
    complite: Number,
}) {
    if (!ulist.start) {
        await end(client, message, sdb);
        emerr.setDescription(`아직 이 퀴즈가 완성되지 않았습니다.`);
        return setTimeout(async () => {
            return message.channel.send(emerr).then(m => msgdelete(m, Number(process.env.deletetime)));
        }, 1250);
    }
    db.set(`db.${message.guild.id}.quiz.startcheck`, true);
    db.set(`db.${message.guild.id}.quiz.score`, {});
    sdb.quiz.start.userid = '';
    sdb.quiz.quiz.format = ulist.quiz;
    sdb.quiz.start.user = false;
    sdb.quiz.user.hint = [];
    sdb.quiz.user.skip = [];
    sdb.quiz.quiz.skipcount = 0;
    sdb.save();
    var list = `**잠시뒤 퀴즈가 시작됩니다.**`;
    try {
        var c = client.channels.cache.get(sdb.quiz.qzchannelid);
        c.messages.fetch(sdb.quiz.msg.listid).then(m => {
            m.edit(list);
        });
        c.messages.fetch(sdb.quiz.msg.npid).then(m => {
            m.reactions.removeAll();
            m.react('💡');
            m.react('⏭️');
        });
    } catch(err) {}
    await mqscore(client, message, args, sdb);
    return await getquiz(client, message, args, sdb, vchannel, user, ulist);
}
async function getquiz(client = new Client, message = new Message, args = Array, sdb = MDB.object.server, vchannel = new Channel, user = new User, ulist = {
    url: String,
    desc: String,
    quiz: String,
    complite: Boolean,
}) {
    if (ulist.quiz == '음악퀴즈') {
        return await tensec(client, message, args, sdb, vchannel, user, ulist, {
            desc: `나오는 노래를 듣고 정답을 채팅창에 적어주세요.\n정답이면 자동으로 넘어갑니다.`
        });
    }
    if (ulist.quiz == '그림퀴즈') {
        return await tensec(client, message, args, sdb, vchannel, user, ulist, {
            desc: `나오는 이미지를 보고 정답을 채팅창에 적어주세요.\n정답이면 자동으로 넘어갑니다.`
        });
    }
    await end(client, message, sdb);
    emerr.setDescription(`퀴즈 형식을 찾을수 없습니다.`);
    return setTimeout(async () => {
        return message.channel.send(emerr).then(m => msgdelete(m, Number(process.env.deletetime)));
    }, 1250);
}
async function tensec(client = new Client, message = new Message, args = Array, sdb = MDB.object.server, vchannel = new Channel, user = User, ulist = {
    url: String,
    desc: String,
    quiz: String,
    complite: Boolean,
}, text = {
    desc: String,
}) {
    await broadcast(vchannel, `sound/dingdong.mp3`, {volume:0.5});
    const np = new MessageEmbed()
        .setTitle(`**${ulist.quiz} 설명**`)
        .setImage(`https://ytms.netlify.app/question_mark.png`)
        .setDescription(`
            ${text.desc}

            퀴즈는 10초뒤 자동 시작됩니다.
        `)
        .setFooter(`자세한 설정은 ${process.env.prefix}퀴즈 설정 으로 하실수 있습니다.`)
        .setColor('ORANGE');
    try {
        var c = client.channels.cache.get(sdb.quiz.qzchannelid);
        return c.messages.fetch(sdb.quiz.msg.npid).then(m => {
            m.edit(np);
            setTimeout(async function() {
                if (ulist.quiz == '음악퀴즈') {
                    return await setquiz.music(client, message, args, sdb, vchannel, user, ulist);
                }
                if (ulist.quiz == '그림퀴즈') {
                    return await setquiz.img(client, message, args, sdb, vchannel, user, ulist);
                }
            }, 10000);
        });
    } catch(err) {
        return await end(client, message, sdb);
    }
}

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
