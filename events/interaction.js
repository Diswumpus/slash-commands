const Discord = require('discord.js');
const slash = require('../models/slash-command');
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
		//Run function
		textf(commandData.name)
		//Define text
		let text = commandData.reply;
		//Replace var
		if (commandData.option1) {
			var res1 = text.replace("{option_1}", interaction.options?.find(c => c?.name === commandData.option1)?.value);
		} else if (commandData.option2) {
			var res2 = text.replace("{option_2}", interaction.options?.find(c => c?.name === commandData.option2)?.value);
		}
		//Create text
		if (commandData.option1) {
			text = res1
		} else if (commandData.option2) {
			text = res2
		} else if (commandData.option1 && commandData.option2) {
			text = text.replace("{option_2}", interaction.options?.find(c => c?.name === commandData.option2)?.value) && text.replace("{option_1}", interaction.options?.find(c => c?.name === commandData.option1)?.value);
		}
		//Add uses to the command
		await slash.findOne({
			id: interaction.commandId,
			guild: interaction.guild.id
		}, async (err, dUser) => {
			if (err) console.log(err);
			if (dUser.uses) {
				dUser.uses++
			} else {
				dUser.uses = 1
			}
			await dUser.save().catch(e => console.log(e));
		});
		//Reply to the command
		//Check if embed
		if (commandData?.embed === true) {
			const replyembed = new Discord.MessageEmbed()
				.setTitle(thetext)
				.setDescription(text)
			if (commandData?.button) {
				await interaction.reply({ embeds: [replyembed], components: [commandData?.button] })
			} else {
				await interaction.reply({ embeds: [replyembed] })
			}
		} else {
			if (commandData?.button) {
				await interaction.reply({ content: text, components: [commandData?.button] })
			} else {
				await interaction.reply({ content: text })
			}
		}
	},
};