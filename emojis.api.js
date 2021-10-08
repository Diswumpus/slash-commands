const Discord = require('discord.js');
const config = require('./config.json');
const botConfig = require('./color.json');

class EmojiManager {
    constructor(client){
        /**
         * The emojis.
         * @type {object}
         */
        this.emojis = null

        this.getEmojis(client)
    }

    /**
     * Get emojis!
     * @param {Discord.Client} client 
     */
    getEmojis(client){
        let textt = "{\n";
        let object = {};

        const filteredEmojis = client.emojis.cache.filter(e => botConfig.emojis.includes(e.guild.id))
        const emojiArray = [];
        
        filteredEmojis.forEach(e => emojiArray.push(e))
        for(const emoji of emojiArray){
            if(!botConfig.emojis.includes(emoji.guild.id)) continue
            object[`${emoji.name}`] = { "id": `${emoji.id}`, "show": `${emoji}`, toString: function(){ return `${emoji}` } }
            //textt += `"${emoji.name}": { "id": "${emoji.id}", "show": "${emoji}" },`
        }
        textt = textt.slice(0, textt.lastIndexOf(","));
        textt += "\n}"
        
        return this.emojis = object
    }
}

module.exports = EmojiManager