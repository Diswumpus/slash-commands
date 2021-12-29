const Discord = require('discord.js');
const AtRply = require("../models/autoreply");

module.exports = {
	name: 'messageCreate',
	/**
	 * @param {Discord.Message} message 
	 * @param {Discord.Client} client 
	 */
	async execute(message, client) {
        if(message.author.bot) return
        if(message.system) return
        if(message.content == "") return
        const fetchedData = await AtRply.findOne({
            guildID: message.guild.id
        });
        if(!fetchedData) return
        /**
         * @type {Map<String, String>} //Trigger > Reply
         */
        const replys = fetchedData?.replys
        let rply
        const rplyData = replys.forEach((k, e) => { 
            if(e.toLowerCase().includes(message.content.toLowerCase())) rply = e 
        })
        if(rply){
            await message.reply(`${rply}`);
        }
	},
};