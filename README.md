# Astral Chat

![Art by Kacchan#8317](https://i.imgur.com/04ljwEO.png)

<sup>Art by Kacchan#8317</sup>
***

[Please funnel money into my mouth to support development  by clicking here](https://ko-fi.com/codeagon)
***

## What this?
Astral Chat (AC) is the dumbed down, somehow even more poorly written, cousin of [Astral TERA, the server within a server](https://github.com/codeagon/Astral-TERA/blob), which you should totes go check out thanks. The goal of AC is to provide players (mainly in guilds), the ability to talk to people on discord without the risk of being banned that comes with [TERA Discord Relay](https://github.com/meishuu/tera-discord-relay).

## How work?
Astral Chat works by sending messages sent on the `/6`chat channel to a third party server hosted by (hopefully) someone you trust. The messages are then sent to a discord bot (again hosted by someone). Essentially allowing people in-game the ability to talk to people on discord and visa versa. This also works without the discord component and across servers, allowing for a cross-server and cross region chat to exist also. Also you can watch cat videos together.

## How use?
### Client
After first running the mod to generate your ID, change the `serverHost` IP  and port from `localhost` to the IP of the person hosting the server component in `config.json`. When joining the game, you should connect automatically to the chat. To start chatting, simply type any messages into `/6`.

Should you get disconnected from the chat, simply typing `!ac connect` into the chat or `ac connect` into `/8` should reconnect you.

### Server
To setup the server, simply download the pre-packed release because I am too lazy to write a package.json. You will need to run the server first, followed by the discord bot. You will need to edit the `config.json` for the discord bot, instructions for setting one up can be found [here](https://github.com/Chikachi/DiscordIntegration/wiki/How-to-get-a-token-and-channel-ID-for-Discord). You'll need to give the config your token as well as the channel too.

## I hate??
Me too. Feel free to fork it, I am highly aware this is garbo, I stripped a lot and rewrote some parts worse for some reason when cutting down AT for this. If you have suggestions feel free to leave a message in [this discord chat](https://discord.gg/dzB7xZK). I will most likely not be updating this super often, as AT is the main project.


