const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'emitlog',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.GuildMember} Member 
     * @param {String[]} args 
     */
    async execute(message, Member, args) {
        if (message.author.id !== require('../config.json').ownerID) return
        
        await require('../log').log("Hi :)", "command", message.guild);
    }
}
