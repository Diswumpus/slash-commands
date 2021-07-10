const Discord = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (!interaction.isButton()) return;
            if(interaction.customId === '1'){
            await interaction.reply({ content: `${require('../emojis.json').check} Deleted the message!`, ephemeral: true });
            await interaction.message.delete()
            }
	},
};