const Server = require('./networking'); //bbccddeeff

MATCH = /^\.([^!].*)$/;
COLOR = /#\w{6}/g;
URL = /(www\.\w{1,}?\..{2,}?(\s|$))/gm;
const users = {};
const port = process.env.PORT || 3454;
const secure = false;

let amount = 0,
        sendmessage = true;

const server = new Server({}, (client) => {

    let curId = false;

    function check(cb) {
        return (...args) => (curId !== false) && cb(...args);
    }

    function wwwReplace(match, p1, p2, offset, string) {
        let linkKey = rand(1, 99999999);
        client.broadcast('weburl', `https://${p1}`, linkKey);
        return `<font color="#7f7ff6"><ChatLinkAction param=\"1#####51005@${linkKey}@SERVER\">https://${p1}</ChatLinkAction></FONT>`;
    }

    function dReplaceLink(match, p1, p2, offset, string) {
        let linkKey = rand(1, 99999999);
        client.broadcast('weburl', `https://${p1}`, linkKey);
        return `https://${p1}`;
    }

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    function logout() {
        if (curId !== false) {
            client.broadcast('remove', curId);
            amount--;
            delete users[curId];
            curId = false;
        }
        client.send('users', users);
    }

    client.on('dping', () => {
        client.send('dpong', amount);
    });

    client.on('login', (id) => {
        if (curId !== false && curId !== id) {
            delete users[curId];
        }
        curId = id;
        client.broadcast('add', id);
        amount++;
    });

    client.on('chat', check((name, msg, discord) => {
        message = msg;
        if (msg.includes("&lt;font")) {
            client.send('chat', `<font color="#ff0000">SERVER</font>`, `Sorry, your last message couldn't be sent`);
            return;
        }
        if (msg.includes("ChatLinkAction")) { //Protect against users doxing themselves
            client.send('chat', `<font color="#ff0000">SERVER</font>`, `Sorry, your last message couldn't be sent`);
            return;
        }

        if (msg.includes(`:tm:`)) {
            message = msg.replace(/:tm:/g, `&#8482;`);
        }

        if (URL.exec(msg)) {
            if (discord === 2) {
                return;
            }
            if (discord === 1) {
                message = msg.replace(/(www\.\w{1,}?\..{2,}?(\s|$))/gm, wwwReplace);
                client.broadcast('chat', name, message, 2);
                sendmessage = false;
                return;
            } else {
                link = URL.exec(msg);
                message = msg.replace(/(www\.\w{1,}?\..{2,}?(\s|$))/gm, wwwReplace);
                bmessage = msg.replace(/(www\.\w{1,}?\..{2,}?(\s|$))/gm, dReplaceLink);
                client.broadcast('dmessage', name, bmessage);
                client.broadcast('chat', name, message, 2);
                return;
            }
            return;
        }
        if (msg.includes(`:cross:`)) {
            message = msg.replace(/:cross:/g, `&#8224;`);
        }
        if (sendmessage) { //idk why I did this???
            client.broadcast('chat', name, message, discord);
        } else {
            sendmessage = true;
        }
    }));
    //
    client.on('logout', logout);
    client.on('close', logout);
    //discord start

});
server.listen(port, () => {
    console.log(`listening on ${port} (${secure ? 'secure' : 'insecure'})`);
});
