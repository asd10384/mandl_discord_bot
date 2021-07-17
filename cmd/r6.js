
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const MDB = require('../MDB/data');
const log = require('../log/log');

const R6API = require('r6api.js').default;
const r6api = new R6API({
    email: process.env.UBI_EMAIL,
    password: process.env.UBI_PASSWORD
});
const platform = 'uplay';

// https://www.npmjs.com/package/r6api.js

const per = new MessageEmbed()
    .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
    .setColor('RED');

module.exports = {
    name: '레식',
    aliases: ['r6'],
    description: `${process.env.prefix}레식 도움말`,
    async run (client = new Client, message = new Message, args = new Array, pp = process.env.prefix, sdb = MDB.object.server, user = new User) {
        // if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r=>sdb.role.includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.deletetime)));

        if (args[0] == '랭크') {
            if (args[1]) {
                try {
                    return message.channel.send(`${args[1]} 플레이어 정보 로딩중...`).then(async (loadingmsg) => {
                        r6api.findByUsername(platform, args[1]).then(async (val) => {
                            if (!val || !val[0]) return message.channel.send(emerr(pp, `${args[1]} 이름의 플레이어를 찾을수 없습니다.`)).then(m => msgdelete(m, Number(process.env.deletetime)));
                            const player = val[0];
                            const level = await r6api.getProgression(platform, player.id);
                            const ranklist = await r6api.getRanks(platform, player.id, {
                                regionIds: 'all',
                                boardIds: 'all',
                                seasonIds: 'all'
                            });
                            if (args[2]) {
                                if (!isNaN(args[2])) {
                                    if (ranklist && ranklist[0]['seasons'][args[2]]) {
                                        const rank = ranklist[0]['seasons'][args[2]];
                                        const rank_pvp = rank.regions.apac.boards.pvp_ranked;
                                        const embed = new MessageEmbed()
                                            .setAuthor(`platform: ${platform}\nid: ${player.id}`, player.avatar[500] || player.avatar[256])
                                            .setTitle(`NAME: **${player.username}**\nLEVEL: **${level[0].level}**`)
                                            .setURL(`https://tabstats.com/siege/player/${player.id}`)
                                            .setThumbnail(rank_pvp.current.icon)
                                            .setDescription(`
                                                시즌: **${rank.seasonName}**
                                                점수: ${rank.regions.apac.boards.pvp_ranked.current.mmr}**
                                                K/D: **${rank_pvp.kills} / ${rank_pvp.deaths} [ ${rank_pvp.kd} ]**
                                                W/L: **${rank_pvp.wins} / ${rank_pvp.losses} [ ${rank_pvp.winRate} ]**
                                            `)
                                            .setFooter(`새로고침 시간: ${rank_pvp.updateTime}`)
                                            .setColor('ORANGE');
                                        return loadingmsg.edit('', embed);
                                    }
                                    return loadingmsg.edit('', emerr(pp, `랭크를 찾을수 없습니다.`)).then(m => msgdelete(m, Number(process.env.deletetime)));
                                }
                                return loadingmsg.edit('', emerr(pp, `랭크번호는 숫자만 입력할수 있습니다.`)).then(m => msgdelete(m, Number(process.env.deletetime)));
                            }
                            var text = '';
                            var last = '';
                            if (ranklist) {
                                for (i in ranklist[0]['seasons']) {
                                    last = i;
                                    text += `${i}: ${ranklist[0]['seasons'][i].seasonName}\n`;
                                }
                            }
                            const embed = new MessageEmbed()
                                .setAuthor(`platform: ${platform}\nid: ${player.id}`, player.avatar[500] || player.avatar[256])
                                .setTitle(`NAME: **${player.username}**\nLEVEL: **${level[0].level}**`)
                                .setURL(`https://tabstats.com/siege/player/${player.id}`)
                                .setThumbnail(player.avatar[500] || player.avatar[256])
                                .setDescription((text) ? text : '랭크를 플레이하지 않았습니다.')
                                .setFooter(`ex) ${pp}레식 랭크 ${args[1]} ${(text) ? last : ''}`)
                                .setColor('ORANGE');
                            return loadingmsg.edit('', embed);
                        });
                    });
                } catch (err) {
                    return message.channel.send(emerr(pp, `${args[1]} 이름의 플레이어를 찾을수 없습니다.`)).then(m => msgdelete(m, Number(process.env.deletetime)));
                }
            }
            return help(message, pp);
        }
        if (args[0] == '뉴스') {
            message.channel.send('로딩중... (불러오는 수량에 따라 시간이 길어질수 있습니다.)').then(async (m) => {
                const { items: news_list } = await r6api.getNews({
                    limit: (args[1]) ? args[1] : 3
                });
                m.delete();
                for (news of news_list) {
                    message.channel.send(
                        new MessageEmbed()
                            .setAuthor(`TYPE: ${news.type} | ID: ${news.id}`, ``, news.url)
                            .setURL(news.url)
                            .setTitle(news.title)
                            .setDescription((news.type == 'videos') ? news.thumbnail.description : news.abstract)
                            .setImage(news.thumbnail.url)
                            .setFooter(news.date)
                            .setColor('ORANGE')
                    );
                }
            });
            return;
        }
        return help(message, pp);
    },
};
function emerr(pp = `${process.env.prefix}`, text = '') {
    return new MessageEmbed()
        .setTitle(`**레식 랭크 오류**`)
        .setDescription(text)
        .setFooter(`${pp}레식 도움말`)
        .setColor(`RED`);
}
function help(message = new Message, pp = `${process.env.prefix}`) {
    return message.channel.send(
        new MessageEmbed()
            .setTitle(`**레식 도움말**`)
            .setDescription(`
                **레식 명령어**
                ${pp}레식 랭크 [유저이름] : 유저의 플레이한 랭크의 시즌번호를 확인할수있습니다.
                ${pp}레식 랭크 [유저이름] [시즌번호] : 유저의 시즌 랭크 전적을 확인할수있습니다.
                ${pp}레식 뉴스 [숫자] : 숫자만큼 뉴스를 볼수있습니다.
            `)
            .setColor('ORANGE')
    ).then(m => msgdelete(m, Number(process.env.deletetime)*5));
}

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}
