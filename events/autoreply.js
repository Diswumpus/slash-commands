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
        const fetchedData = await AtRply.findOne({
            guildID: message.guild.id
        });

        /**
         * @type {Map<String, String>} //Trigger > Reply
         */
        const replys = fetchedData.replys
        let rply
        const rplyData = replys.forEach((k, e) => { if(e.toLowerCase().includes(message.content.toLowerCase())) rply = e })
        if(rply){
            await message.reply(`${rply}`);
        }
	},
};