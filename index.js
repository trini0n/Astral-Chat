/* global __dirname */

const Command = require('command');
const path = require('path');
const fs = require('fs');
const GameState = require('tera-game-state');
const Networking = require('./networking');
const networked = new Map();
const PRIVATE_CHANNEL_ID = -3 >>> 0; // wow a number!
const PRIVATE_CHANNEL_NAME = `Chat`;
module.exports = function HiWelcomeToMyMinecraftLetsPlayImYourHostHUUUUUUUUUUGEEEEDOOOONNNG(dispatch) {
    const command = Command(dispatch);
    const game = GameState(dispatch);
    const net = new Networking();
    let website = [{link: 4012, linkKey: 'google.com'}], // So that websites have a backup or something
            online = false;
    try {
        var config = require('./config.json');
    } catch (e) {
        var config = {
            "discordMessages": true,
            "allowWebLinks": true,
            "myName": "Anonymous",
            "Id": rand(1, 999999999999999), //nine
            "serverHost": "localhost", //yes change this thanks
            "serverPort": 3454
        };
        saveConfig();
    }

//funcs

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function strip(str) { //fantastic regex lmozle
        return str.replace(/^<[^>]+>|<\/[^>]+><[^\/][^>]*>|<\/[^>]+>$/g, '');
    }

    function saveConfig() {
        fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(
                config, null, 4), err => {
            console.log('[[ASTRAL CHAT]] - CONFIG FILE CREATED');
        });
    }

    function message(msg) {
        command.message(`<font color="#ffc5e8">  [Astral Chat] - </font> <font color="#c5ffdc ">${msg}`);
    }

    function chat(userName, msg) {
        dispatch.toClient('S_PRIVATE_CHAT', 1, {
            channel: PRIVATE_CHANNEL_ID,
            authorID: 0,
            authorName: userName,
            message: msg
        });
    }


    function joinChat() {
        dispatch.toClient('S_JOIN_PRIVATE_CHANNEL', 2, {
            index: 5,
            channelId: PRIVATE_CHANNEL_ID,
            unk: [],
            name: PRIVATE_CHANNEL_NAME
        });
    }
//commands
    command.add('ac', (cmd, arg, arg2, arg3, arg4, arg5, arg6, arg7) => {
        switch (cmd) {
            case 'connect':
            case 'reconnect':
                online = true;
                net.connect({
                    host: config.serverHost,
                    port: config.serverPort
                });
                net.send('login', config.id);
                message(`Connected`);
                break
            case 'disconnect':
                net.send('logout');
                setTimeout(function () {
                    net.close();
                    message('Disconnected');
                }, 1000);
                break
            case 'username':
            case 'user':
            case 'name':
                config.myName = arg;
                message(`Username set to "${config.myName}"`);
                saveConfig();
                break
            default:
                message('WOOOpssies doopsies you typed a command wrong try again !!!!!!!!!!!!');
        }
    });
    //hooks

    dispatch.hook('S_LOAD_CLIENT_USER_SETTING', 1, () => {
        message('uwuuwuwuuuuu');
        process.nextTick(() => {
            joinChat();
        });
    });

    dispatch.hook('S_LOGIN', 10, () => {
        net.send('login', config.id);
        online = true;
    });

    dispatch.hook('S_JOIN_PRIVATE_CHANNEL', 2, event => event.index === 5 ? false : undefined);
    dispatch.hook('C_LEAVE_PRIVATE_CHANNEL', 1, event => event.index === 5 ? false : undefined);
    dispatch.hook('C_REQUEST_PRIVATE_CHANNEL_INFO', 2, event => {
        if (event.channelId === PRIVATE_CHANNEL_ID) {
            dispatch.toClient('S_REQUEST_PRIVATE_CHANNEL_INFO', 2, {
                owner: 1,
                password: 0,
                members: [],
                friends: []
            });
            return false;
        }
    });

    dispatch.hook('C_CHAT', 1, {order: -9}, event => {
        if (event.channel === 16) {
            net.send('chat', config.myName, strip(event.message), 0);
            return false;
        }
    });

    dispatch.hook('C_SHOW_ITEM_TOOLTIP_EX', 2, (event) => {
        tooltipId = event.id.toString();
        for (let i of website) {
            if (!config.allowWebLinks)
                return;
            if (tooltipId.includes(i.linkKey)) {
                dispatch.toClient('S_SHOW_AWESOMIUMWEB_SHOP', 1, {
                    link: i.link.toString()
                });
                return false;
            }
        }
    });

    dispatch.hook('S_RETURN_TO_LOBBY', 1, () => {
        online = false;
        net.send('logout');
        dispatch.hookOnce('C_LOAD_TOPO_FIN', 1, () => { //wew
            net.send('login', config.Id);
        });
    });
    //nets

    net.on('chat', (userName, msg, discord) => {
        if (online) {
            if (!config.discordMessages && discord === 2)
                return;
            chat(userName, msg);
        }
    });
    net.on('weburl', (link, linkKey) => {
        website.push(website, {link, linkKey});
    });
    net.on('add', (id) => {
        addUser(id);
    });
    net.on('error', (err) => {
        console.warn(err);
    });
    net.on('ping', () => {
        net.send('pong');
    });
    net.connect({
        host: config.serverHost,
        port: config.serverPort
    });
    function addUser(id, user = {}) {
        networked.set(id, user);
    }


    //trashes
    this.destructor = () => {
        net.close();
        command.remove('ac'); // since this doesn't need anything we can do reloading stuff
    };
};