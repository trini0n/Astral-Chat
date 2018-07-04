const Networking = require('./networking');
const emoji = require('node-emoji');
const Discord = require('discord.js');
const bot = new Discord.Client();
const net = new Networking();
const config = require('./config.json');
bot.login(config.token);
MATCH = /^\.([^!].*)$/;
UNICODE = /[^\x00-\x7F]/g;
URL = /(www\.\w{1,}?\..{2,}?(\s|$))/gm;
EMOJI = /(<|..)(:.*:)(\d{18}>+)/gm;
function replacer(match, p1, p2, p3, offset, string) {
    return ` ${p2}`;
}
//typeof mind !== "undefined" && mind !== null)

net.connect({
    host: 'localhost',
    port: 3454
});
net.on('ping', () => {
    net.send('pong');
});
net.on('dmessage', (userName, msg) => {
    var channel = bot.channels.get(config.channel);
    channel.send(`${userName}: ${msg}`);
});
net.on('chat', (userName, msg, discord) => {
    if (discord === 2 || discord === 1) {
        return;
    }
    message = emoji.emojify(msg); //turn messages into mojos
    if (message.includes(`:cuteboi:`)) {
        const cute = bot.emojis.find("name", "cuteboi"); // the only part of the mod that matters, use a handler instead if you have lots
        message = message.replace(/:cuteboi:/g, cute);
    }
    if (message.includes(`:cutethink:`)) {
        const cutethink = bot.emojis.find("name", "cutethink");
        message = message.replace(/:cutethink:/g, cutethink);
    }
    var channel = bot.channels.get(config.channel);
    channel.send(`${userName}: ${message}`);
});

bot.on('message', function (message) {
    content = emoji.unemojify(message.content);
    if (!message.author.bot && message.channel.id === config.channel) {
        author = message.author.username.replace(/[^\x00-\x7F]/g, "*");
        if (URL.exec(content)) {
            net.send('chat', `<font color="#83bad4">${author}</font>`, content, 1);
        }
        msg = message.content.replace(/[^\x00-\x7F]/g, "*");// no special unicode
        if (EMOJI.exec(content)) {
            content = content.replace(/(<|..)(:.*:)(\d{18}>+)/gm, replacer); //replace emoji with just the text
        }
        net.send('chat', `<font color="#83bad4">${author}</font>`, content, 2);
        // net.send('discordSend', `<font color="#83bad4">${message.author.username}</font>`, message.content);
    }
});

net.on('dpong', (amount) => {
    var channel = bot.channels.get(config.channel);
    channel.send(`There are currently ${amount - 1} players conneced`);
});

bot.on('message', message => { // If you're reading this, do a command handler instead of this, thanks
    var channel = bot.channels.get(config.channel);
    switch (message.content) {
        case '.ping':
            channel.send('pong');
            break
        case '.status':
            sendPing();
            break
    }
});

function sendPing() {
    net.send('dping');
}
bot.on('ready', () => {
    console.log('Ready!');
});

net.on('error', (err) => {
    console.log(err);
});

net.send('login', `696969696969`); // needs to be unique
