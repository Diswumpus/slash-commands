const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'fetchwh',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.GuildMember} Member 
     * @param {String[]} args 
     */
    async execute(message, Member, args) {
        if (message.author.id !== require('../config.json').ownerID) return
        /**
         * @type {Discord.TextChannel}
         */
        const channel = message.channel;
        let webhook = (await channel.fetchWebhooks()).find(e => e.owner.id === message.client.user.id);
        if(!webhook){
            webhook = await channel.createWebhook("Logs");
        }
        message.reply(`${webhook.url}`)
    }
}
