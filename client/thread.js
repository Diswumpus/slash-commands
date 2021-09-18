// const Discord = require('discord.js');
// const emojis = require('../emojis.json');
// const wait = require('util').promisify(setTimeout);

// module.exports = {
// 	/**
// 	 * @param {Discord.Client} client 
// 	 */
// 	async execute(client) {
// 		let votes = {
// 			up: 0,
// 			down: 0,
// 			message: null
// 		}
// 		client.on('messageCreate', async message => {
// 			wait(100)

// 			if(message.guild.id !== '842575277249921074') return

// 			const channel = message.guild.channels.cache.get('886680814589460491')

// 			const messageContent = {
// 				name: null,
// 				description: null
// 			}
// 			const embed = new Discord.MessageEmbed()
// 			.setColor(require('../color.json').color)
// 			.setTitle(message.content)
// 			.setDescription(message.content)
			
// 			const row = new Discord.MessageActionRow()
// 			.addComponents(
// 				new Discord.MessageButton()
// 				.setCustomId('add_vote')
// 				.setEmoji(emojis.flag_addid)
// 				.setStyle('SUCCESS')
// 				.setLabel(`Vote (${votes.up})`),
// 				new Discord.MessageButton()
// 				.setCustomId('remove_vote')
// 				.setEmoji(emojis.flag_removeid)
// 				.setStyle('DANGER')
// 				.setLabel(`Vote (${votes.down})`),
// 			)

// 			votes.message = await channel.send({ embeds: [embed], components: [row] });
// 		})

// 		const genRow = () => {
// 			return new Discord.MessageActionRow()
// 			.addComponents(
// 				new Discord.MessageButton()
// 				.setCustomId('add_vote')
// 				.setEmoji(emojis.flag_addid)
// 				.setStyle('SUCCESS')
// 				.setLabel(`Vote (${votes.up})`),
// 				new Discord.MessageButton()
// 				.setCustomId('remove_vote')
// 				.setEmoji(emojis.flag_removeid)
// 				.setStyle('DANGER')
// 				.setLabel(`Vote (${votes.down})`),
// 			)
// 		}
// 		client.on('interactionCreate', async i => {
// 			if(!i.isButton()) return

// 			if(i.customId === 'add_vote'){
// 				votes.up++

// 				votes.message.edit({ components: [genRow()] });
// 			} else if(i.customId === 'remove_vote'){
// 				votes.down++

// 				votes.message.edit({ components: [genRow()] });
// 			}
// 		})
// 	}
// };