
const { Client } = require('discord.js');
const { MessageComponent } = require('discord-buttons');

module.exports = clickbutton = async function(client = new Client, button = new MessageComponent) {
    if (button.id == 'yes') {
        await button.reply.defer();
        let name = (button.clicker.member.nickname) ? button.clicker.member.nickname : button.clicker.user.username;
        return await button.channel.send(`${name} 님은 똑똑하다고 대답했습니다.`);
    }
    if (button.id == 'no') {
        await button.reply.defer();
        let name = (button.clicker.member.nickname) ? button.clicker.member.nickname : button.clicker.user.username;
        return await button.channel.send(`${name} 님은 똑똑하지않다고 대답했습니다.`);
    }
};