
require('dotenv').config();
const db = require('quick.db');
const ytdl = require('ytdl-core');
const { MessageEmbed, Client, Message, Channel, User } = require('discord.js');
const MDB = require('../../MDB/data');
const log = require('../../log/log');

const HttpsProxyAgent = require('https-proxy-agent');
const agent = HttpsProxyAgent(process.env.PROXY);

const mqscore = require('./score');
const { play, broadcast } = require('../tts/play');
const allmsgdelete = require('./msgdelete');
const timer = require('./timer');
const chack = /(?:http:\/\/|https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?/gi;

module.exports = {
    anser,
    music,
    img
};

async function music(client = new Client, message = new Message, args = Array, sdb = MDB.object.server, vchannel = new Channel, user = new User) {
    sdb.tts.tts = false;
    sdb.quiz.start.start = true;
    await sdb.save();

    var count = sdb.quiz.quiz.count;
    var link = sdb.quiz.quiz.link[count];
    if (link == undefined || link == null || link == '') {
        vchannel.leave();
        return await end(client, message, sdb);
    }
    const all_count = sdb.quiz.quiz.name.length;
    
    var list = `퀴즈를 종료하시려면 \` ${process.env.prefix}퀴즈 종료 \`를 입력해주세요.
힌트를 받으시려면 \`힌트 \`를 입력하거나 💡를 눌러주세요.
문제를 스킵하시려면 \` 스킵 \`을 입력하거나 ⏭️을 눌러주세요.`;
    var np = new MessageEmbed()
        .setTitle(`**정답 : ???**`)
        .setDescription(`**채팅창에 정답을 적어주세요.**\n**문제 : ${count+1}/${all_count}**`)
        .setImage(`https://ytms.netlify.app/question_mark.png`)
        .setFooter(`기본 명령어 : ${process.env.prefix}퀴즈 도움말`)
        .setColor('ORANGE');

    try {
        var c = client.channels.cache.get(sdb.quiz.qzchannelid);
        c.messages.fetch(sdb.quiz.msg.listid).then(m => {
            m.edit(list);
        });
        c.messages.fetch(sdb.quiz.msg.npid).then(m => {
            m.edit(np);
        });
    } catch(err) {}

    try {
        vchannel.join().then(async function(connection) {
            db.set(`db.${message.guild.id}.mq.timer`, true);
            await timer.timer(client, message, sdb);
            const dispatcher = connection.play(ytdl(link, {
                bitrate: 512000,
                quality: 'highestaudio',
                requestOptions: {agent}
            }), {volume: 0.07});
            sdb.quiz.start.user = true;
            sdb.quiz.start.hint = true;
            await sdb.save();
            dispatcher.on('finish', async () => {
                return await anser(client, message, ['스킵','시간초과'], sdb, user);
            });
        });
    } catch(err) {
        return await end(client, message, sdb);
    }
}
async function img(client = new Client, message = new Message, args = Array, sdb = MDB.object.server, vchannel = new Channel, user = new User) {
    sdb.tts.tts = false;
    sdb.quiz.start.start = true;
    await sdb.save();

    var count = sdb.quiz.quiz.count;
    var img = sdb.quiz.quiz.link[count];
    if (img == undefined || img == null || img == '') {
        vchannel.leave();
        return await end(client, message, sdb);
    }
    var url = ytdl(`https://youtu.be/PZCXXe3O-2Q`, { bitrate: 512000, quality: 'highestaudio' });
    var options = {
        volume: 0.21
    };
    const all_count = sdb.quiz.quiz.name.length;
    
    var list = `퀴즈를 종료하시려면 \` ${process.env.prefix}퀴즈 종료 \`를 입력해주세요.
힌트를 받으시려면 \`힌트 \`를 입력하거나 💡를 눌러주세요.
문제를 스킵하시려면 \` 스킵 \`을 입력하거나 ⏭️을 눌러주세요.`;
    var np = new MessageEmbed()
        .setTitle(`**정답 : ???**`)
        .setDescription(`**채팅창에 정답을 적어주세요.**\n**문제 : ${count+1}/${all_count}**`)
        .setImage(img)
        .setFooter(`기본 명령어 : ${process.env.prefix}퀴즈 도움말`)
        .setColor('ORANGE');

    try {
        var c = client.channels.cache.get(sdb.quiz.qzchannelid);
        c.messages.fetch(sdb.quiz.msg.listid).then(m => {
            m.edit(list);
        });
        c.messages.fetch(sdb.quiz.msg.npid).then(m => {
            m.edit(np);
        });
    } catch(err) {}

    try {
        vchannel.join().then(async function(connection) {
            db.set(`db.${message.guild.id}.img.time`, sdb.quiz.anser.imgtime);
            db.set(`db.${message.guild.id}.img.timer`, true);
            db.set(`db.${message.guild.id}.mq.timer`, true);
            await timer.img(client, message, sdb, count, all_count, img);
            await timer.timer(client, message, sdb);
            const dispatcher = connection.play(url, options);
            sdb.quiz.start.user = true;
            sdb.quiz.start.hint = true;
            await sdb.save();
            dispatcher.on('finish', async () => {
                return await anser(client, message, ['스킵','시간초과'], sdb, user);
            });
        });
    } catch(err) {
        return await end(client, message, sdb);
    }
}

async function anser(client = new Client, message = new Message, args = Array, sdb = MDB.object.server, user = new User) {
    db.set(`db.${message.guild.id}.mq.timer`, true);
    db.set(`db.${message.guild.id}.img.timer`, false);
    db.set(`db.${message.guild.id}.img.time`, 45);

    allmsgdelete(client, sdb, 500);
    
    sdb.quiz.start.user = false;
    sdb.quiz.start.hint = false;
    sdb.quiz.user.hint = [];
    sdb.quiz.user.skip = [];

    try {
        var member = message.guild.members.cache.get(user.id) || null;
        var anser_user = (member && member.nickname) ? member.nickname : user.username;
        if (args[0] == '스킵' || args[0] == 'skip') {
            anser_user = (args[1] == '시간초과') ? '시간초과로 스킵되었습니다.' : (args[1] == '관리자') ? `${(message.member && message.member.nickname) ? message.member.nickname : message.member.user.username} 님이 강제로 스킵했습니다.` : '스킵하셨습니다.';
            sdb.quiz.quiz.skipcount = sdb.quiz.quiz.skipcount+1;
        } else {
            var score = db.get(`db.${message.guild.id}.quiz.score`);
            if (!score) score = {};
            if (score[user.id]) {
                score[user.id] = score[user.id] + 1;
            } else {
                score[user.id] = 1;
            }
            db.set(`db.${message.guild.id}.quiz.score`, score);
        }
        var time = sdb.quiz.anser.time;
        var count = sdb.quiz.quiz.count;
        var all_count = sdb.quiz.quiz.name.length;
        var name = sdb.quiz.quiz.name[count];
        var vocal = sdb.quiz.quiz.vocal[count];
        var link = sdb.quiz.quiz.link[count];
        var format = sdb.quiz.quiz.format;
        var yturl = link.replace(chack, '').replace(/(?:&(.+))/gi, '');
        var list = `퀴즈를 종료하시려면 \` ${process.env.prefix}퀴즈 종료 \`를 입력해주세요.`;
        var np = new MessageEmbed();
        
        if (format == '음악퀴즈') {
            vocal = `**가수 : ${vocal}**`;
            np.setImage(`https://img.youtube.com/vi/${yturl}/sddefault.jpg`);
        }
        if (format == '그림퀴즈') {
            np.setImage(link);
            await broadcast(message.guild.me.voice.channel, `sound/dingdong.mp3`, {volume:0.5});
        }
        np.setTitle(`**정답 : ${name}**`)
            .setURL(link)
            .setDescription(`
                **${vocal}**
                **정답자 : ${anser_user}**
                **문제 : ${count+1} / ${all_count}**
            `)
            .setFooter(`${time}초 뒤에 다음문제로 넘어갑니다.`)
            .setColor('ORANGE');
        
        try {
            var c = client.channels.cache.get(sdb.quiz.qzchannelid);
            c.messages.fetch(sdb.quiz.msg.listid).then(m => {
                m.edit(list);
            });
            c.messages.fetch(sdb.quiz.msg.npid).then(m => {
                m.edit(np);
            });
        } catch(err) {}
        sdb.quiz.quiz.count = sdb.quiz.quiz.count+1;
        await sdb.save();

        await mqscore(client, message, args, sdb);

        setTimeout(async function () {
            var startcheck = db.get(`db.${message.guild.id}.quiz.startcheck`);
            if (!startcheck) return ;
            await allmsgdelete(client, sdb, 50);
            db.set(`db.${message.guild.id}.mq.timer`, false);
            var vchannel;
            try {
                vchannel = message.guild.me.voice.channel;
            } catch(err) {
                vchannel = client.channels.cache.get(sdb.quiz.vcid);
            }
            if (format == '음악퀴즈') await music(client, message, args, sdb, vchannel, user);
            if (format == '그림퀴즈') await img(client, message, args, sdb, vchannel, user);
            return;
        }, time * 1000);
    } catch(err) {
        log.errlog(err);
        return await end(client, message, sdb);
    }
}