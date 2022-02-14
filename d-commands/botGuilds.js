const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'guilds',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.GuildMember} Member 
     * @param {String[]} args 
     */
    async execute(message, Member, args) {
        const { client } = message;

        const GuildsFor = [];
        let GuildsUser = { };
        for(const guild of client.guilds.cache.values()){
            GuildsUser[guild.ownerId] != null ? GuildsUser[guild.ownerId].push(guild) : (GuildsUser[guild.ownerId] = [guild]);
        }

        let MessageText = "";

        for(const Guilds of Object.values(GuildsUser)){
            MessageText += `${Guilds.length} for ${Guilds[0].ownerId}\n`;
        }
        
        await message.reply(MessageText);
    }
}