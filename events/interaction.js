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
	name: 'interactionCreate',
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
			try {
				if (cmdDB?.uses) {
					cmdDB.uses++
				} else {
					cmdDB.uses = 1
				}
				await cmdDB.save().catch(e => console.log(e));
			} catch (e) {
				//...
			}
			//Reply to the command
			//Check if embed
			if(commandData?.rows.length > 0) commandData.rows[0].components[0].customId = "slashCommandButton";
			if (commandData?.embed === true) {
				const replyembed = new Discord.MessageEmbed()
					.setTitle(thetext)
					.setDescription(text)
				var hasPremium = await premiumM.hasPremium(interaction.guild.id);
				if (hasPremium) {
					const colorRes = await serverM.findOne(interaction.guild.id);
					var embedColor = colorRes?.options?.color// || require('../color.json').color
					replyembed.setColor(embedColor)
				}
				await interaction.reply({ embeds: [replyembed], ephemeral: commandData?.eph || false, components: commandData?.rows || [] })
			} else {
				await interaction.reply({ content: text.toString(), ephemeral: commandData?.eph || false, components: commandData?.rows || [] })
			}
			if (commandData?.rows.length > 0) {
				/**
				 * @type {Discord.Message}
				 */
				const m = await interaction.fetchReply();
				m.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id })
				.then(async i => {
					if(i.customId === "slashCommandButton"){
						if (commandData.buttonFn === "REPLY"){
							commandData.rows[0].components[0].disabled = true
							await i.reply({ content: commandData?.buttonReply||text.toString() })
							await interaction.editReply({ components: commandData.rows })
						} else if(commandData.buttonFn === "MESSAGE_DELETE"){
							commandData.rows[0].components[0].disabled = true
							await i.reply({ content: commandData?.buttonReply||text.toString() })
							await interaction.editReply({ components: commandData.rows })
							setTimeout(async () => {
								await i.deleteReply()
							}, 10000);
						}
					}
			 	})
			}
		} catch (e) {
			await interaction.reply({ content: `<:failed:899071447811624980> Uh oh... Something bad happened! Report it here: https://discord.gg/dssFv2A8XA with error: \`\`\`xl\n${e}\n\`\`\``, ephemeral: true });
			console.log(e);
		}
	},
};
