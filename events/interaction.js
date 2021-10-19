const Discord = require('discord.js');
const slash = require('../models/slash-command');
const serverM = require('../models/server.manager');
const premiumM = require('../models/premium.manager');
let thetext;
async function textf(text) {
	text = text.toString()
	let newtext = text.slice(1, text.length)
	let oldtext = text.slice(0, 1)
	let rettext = oldtext.toUpperCase() + newtext
	thetext = rettext;
	return `${rettext}`
}

module.exports = {
	name: 'interaction',
	/**
* 
* @param {Discord.Client} client 
* @param {Discord.CommandInteraction} interaction 
*/
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
			id: interaction.commandId,
			guild: interaction.guild.id
		});
		//Return if there is no command data
		if (!commandData) return
		try {
		//Run function
		textf(commandData.name)
		//Define text
		let text = commandData.reply;
		//Add uses to the command
		let cmdDB = await slash.findOne({
			id: interaction.commandID,
			guild: interaction.guild.id
		});
		if(cmdDB?.uses){
			cmdDB.uses++
		} else {
			cmdDB.uses = 1
		}
		await cmdDB.save().catch(e => console.log(e));
		//Reply to the command
		//Check if embed
		if (commandData?.embed === true) {
			const replyembed = new Discord.MessageEmbed()
				.setTitle(thetext)
				.setDescription(text)
			var hasPremium = await premiumM.hasPremium(interaction.guild.id);
			if (hasPremium) {
				var colorr = await serverM.findOne(interaction.guild.id)?.options?.color || "DEFAULT"
				replyembed.setColor(colorr)
			}
			await interaction.reply({ embeds: [replyembed], ephemeral: commandData?.eph || false })
		} else {
			await interaction.reply({ content: text.toString(), ephemeral: commandData?.eph || false })
		}
		} catch(e) {
			await interaction.reply({ content: `<:failed:899071447811624980> Uh oh... Something bad happened! Report it here: https://discord.gg/3QWvYPpn with error: \`\`\`xl\n${e}\n\`\`\``, ephemeral: true });
			console.log(e);
		}
	},
};