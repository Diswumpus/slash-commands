const Discord = require('discord.js');

module.exports = {
	name: 'messageCreate',
	/**
	 * @param {Discord.Message} message 
	 * @param {Discord.Client} client 
	 */
	async execute(message, client) {
		if(message.content.includes(`<@${client.user.id}>`) || message.content.includes(`<@!${client.user.id}>`)){
			const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
				.setURL(`discord://${client.application.id}/users/${message.author.id}`)
				.setLabel(`Requested by ${message.author.tag}`)
				.setStyle("LINK")
			)
			const embed = new Discord.MessageEmbed()
			.setDescription(`Hey ${message.author}! My prefix is \`/\` to create commands use \`/create\` to edit commands use \`/edit\` to delete commands use \`/delete\`!`)
			.setColor(require('../color.json').color)
			await message.reply({ components: [row], embeds: [embed] });
		}
	},
};