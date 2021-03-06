
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const MDB = require('../MDB/data');

module.exports = {
    name: 'ping',
    aliases: ['핑'],
    description: '핑 확인',
    async run (client = new Client, message = new Message, args = new Array, pp = process.env.prefix, sdb = MDB.object.server, user = new User) {
        const ping = new MessageEmbed()
            .setTitle(`\` PONG! \``)
            .setDescription(`🏓 \` ${client.ws.ping} \` ms`)
            .setColor('RANDOM');
        return message.channel.send(ping).then(m => msgdelete(m, Number(process.env.deletetime)));
    },
};

function msgdelete(m = new Message, t = Number) {
    setTimeout(() => {
        try {
            m.delete();
        } catch(err) {}
    }, t);
}