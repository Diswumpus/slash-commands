const Discord = require('discord.js');
const slash = require('../models/slash-command');

module.exports = {
	name: 'interaction',
	async execute(interaction, client) {
		/*
		id: String,
		qid: String,
		guild: String,
		reply: String,
		name: String,
		embed: Boolean
		*/
		//Fetch the command
		let commandData = await slash.findOne({
			id: interaction.commandID,
			guild: interaction.guild.id
		});
		//Return if there is no command data
		if(!commandData) return
		//Reply to the command
		//Check if embed
		if(commandData?.embed === true){
			const replyembed = new Discord.MessageEmbed()
			.setTitle(commandData.name)
			.setDescription(commandData.reply)
			await interaction.reply({ embeds: [replyembed] })
		} else {
			await interaction.reply({ content: commandData.reply })
		}
	},
};