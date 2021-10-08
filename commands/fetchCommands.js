const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'fetchcommands',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.GuildMember} Member 
     * @param {String[]} args 
     */
    async execute(message, Member, args) {
        if(message.author.id !== require('../config.json').ownerID) return
        const guild = message.client.guilds.cache.get(args[0]);

        const commands = await guild.commands.fetch();
        const embed = new Discord.MessageEmbed();
        for(const command of commands.values()){
            embed.addField(`${command.name}`, `ID: ${command.id}, Name: ${command.name}, Description: ${command.description}`)
        }

        message.reply({ embeds: [embed] });
    }
}
