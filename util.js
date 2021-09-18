const Discord = require('discord.js');

module.exports.models = {
    buttonRoles: {
        model: require('./models/button-roles'),
        manager: null
    },
    premium: {
        model: require('./models/premium'),
        manager: require('./models/premium.manager')
    },
    server: {
        model: require('./models/server'),
        manager: require('./models/server.manager')
    },
    slashCommands: {
        model: require('./models/slash-command'),
        manager: require('./models/slash-command.manager')
    }
}

/**
 * 
 * @param {Discord.Client} client 
 */
module.exports.getEmojiURLS = async (client) => {
    const emojis = [];
    client.emojis.cache.every(e => emojis.push(e))
    const emojiURLS = new Discord.Collection()
    for(const emoji of emojis){
        emojiURLS.set(emoji.name, this.getEmojiURL(client, emoji.id))
    }
    return emojiURLS
}

/**
 * 
 * @param {Discord.Client} client 
 */
module.exports.getEmojiURL = async (client, emojiId) => {
    return client.emojis.cache.get(emojiId||null)?.url;
}