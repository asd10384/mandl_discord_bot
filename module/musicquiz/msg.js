
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, Channel } = require('discord.js');
const dfpreifx = process.env.prefix;

module.exports = {
    score,
    list,
    np,
};
async function score () {
    var score = new MessageEmbed()
        .setTitle(`**[ 음악퀴즈 스코어 ]**`)
        .setDescription(`**없음**\n\n스킵한 노래 : 없음`)
        .setFooter(`스코어는 다음게임 전까지 사라지지 않습니다.`)
        .setColor('ORANGE');
    return score;
}
async function list() {
    var list = `**[ 규칙 ]**
**1.** 명령어는 \` ${dfpreifx}음악퀴즈 명령어 \` 로 확인하실수 있습니다.
**2.** 정답은 채팅창에 그냥 입력하시면 됩니다.
**3.** 정답을 맞추고 몇초뒤에 다음곡으로 넘어갈지 설정할수 있습니다. (기본 : 10초)
(__${dfpreifx}음악퀴즈 설정 명령어__ 를 참고해주세요.)
**4.** 정답은 __${dfpreifx}음악퀴즈 설정 정답__ 으로 설정하실수 있습니다. (기본 : 제목)
**5.** 노래가 끝나도 정답을 맞추지 못할시 자동으로 스킵됩니다.
(제목 및 가수는 오피셜(멜론) 명칭을 사용했습니다.)
(가수는 무조건 한글로 적어주세요.)
(띄어쓰기나 특수문자 (ex: ') 를 유의하여 적어주세요.)
**6.** 오류나 수정사항은 hky4258@naver.com 으로 보내주세요.

음악퀴즈 도중 봇이 멈추거나 오류가 생겼다면
음악퀴즈를 종료하고 다시 시작해주세요. (${dfpreifx}음악퀴즈 종료)

음성 채널에 참여한 후 \` ${dfpreifx}음악퀴즈 시작 \`을 입력해 음악퀴즈를 시작하세요.`;
    return list;
}
async function np (anser = String, time = Number || String) {
    var np = new MessageEmbed()
        .setTitle(`**현재 음악퀴즈가 시작되지 않았습니다.**`)
        .setDescription(`\` ${dfpreifx}음악퀴즈 명령어 \`\n\` ${dfpreifx}음악퀴즈 설정 \`\n정답형식 : ${anser}\n다음곡시간 : ${time}초`)
        .setImage(`https://ytms.netlify.app/defult.png`)
        .setFooter(`기본 명령어 : ${dfpreifx}음악퀴즈 명령어`)
        .setColor('ORANGE');
    return np;
}