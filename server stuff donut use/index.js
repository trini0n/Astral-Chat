const Server = require('./networking'); //bbccddeeff

MATCH = /^\.([^!].*)$/;
COLOR = /#\w{6}/g;
HTTPS = /(http(s?))\:\/\//gi;
URL = /((?:(http|https):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gm;
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
        if (!HTTPS.exec(p1)) {
            p1 = `https:\/\/${p1}`
        }
        let linkKey = rand(1, 99999999);
        client.broadcast('weburl', `${p1}${string}`, linkKey);
        return `<font color="#7f7ff6"><ChatLinkAction param=\"1#####51005@${linkKey}@SERVER\">${p1}${string}</ChatLinkAction></FONT>`;
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
                message = msg.replace(URL, wwwReplace);
                client.broadcast('chat', name, message, 2);
                sendmessage = false;
                return;
            } else {
                client.broadcast('dmessage', name, msg);
                message = msg.replace(URL, wwwReplace);
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
