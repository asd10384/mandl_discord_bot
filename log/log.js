
const { Message } = require('discord.js');
const { writeFileSync, appendFileSync } = require('fs');
const mds = require('../module/mds');

module.exports = {
    readylog,
    botlog,
    quizlog,
    sitelog,
};

async function readylog(text = '', date = new Date()) {
    var { year, month, day, week, hour, min, sec } = mds.format.nowdate(date);
    text = `${year}년${month}월${day}일 ${week}요일 ${mds.az(hour, 2)}:${mds.az(min, 2)}:${mds.az(sec, 2)}\n${text}\n`;
    console.log(text);
    appendFileSync(`log/bot.txt`, text, {encoding: 'utf8'});
}
async function botlog(message = new Message, text = '', date = new Date) {
    var { year, month, day, week, hour, min, sec } = mds.format.nowdate(date);
    text = `${message.guild.name} 서버\n${year}년${month}월${day}일 ${week}요일 ${mds.az(hour)}:${mds.az(min)}:${mds.az(sec)}\n${text}\n`;
    console.log(text);
    appendFileSync(`log/${path}.txt`, text, {encoding: 'utf8'});
}

async function quizlog(message = new Message, text = '', date = new Date) {
    var { year, month, day, week, hour, min, sec } = mds.format.nowdate(date);
    text = `${message.guild.name} 서버\n${year}년${month}월${day}일 ${week}요일 ${mds.az(hour)}:${mds.az(min)}:${mds.az(sec)}\n${text}`;
    console.log(text);
    appendFileSync(`log/${path}.txt`, text, {encoding: 'utf8'});
}

async function sitelog(text = '', date = new Date) {
    var { year, month, day, week, hour, min, sec } = mds.format.nowdate(date);
    text = `${year}년${month}월${day}일 ${week}요일 ${mds.az(hour)}:${mds.az(min)}:${mds.az(sec)}\n${text}\n`;
    console.log(text);
    appendFileSync(`log/site.txt`, text, {encoding: 'utf8'});
}
