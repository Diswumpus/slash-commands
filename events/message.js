const Discord = require('discord.js');
const slash = require('../models/slash-command');
let thetext;
async function text(text) {
    text = text.toString()
    let newtext = text.slice(1, text.length)
    let oldtext = text.slice(0, 1)
    let rettext = oldtext.toUpperCase() + newtext
    thetext = rettext;
    return `${rettext}`
}

module.exports = {
	name: 'message',
	async execute(message, client) {
        //Check if guild is premium
        const prime = require('../models/premium');
        const gprime = await prime.findOne({
			guild: message.guild.id
		});
        if(gprime?.guild !== message.guild.id) return
		//Check if bot
		if(message.author.bot) return
        //Check if has !
        if(!message.content.startsWith('!')) return
        //Get args
        const args = message.content.slice(1).replace(/ /g,"-");
        //Fetch the command
		let commandData = await slash.findOne({
			name: args,
			guild: message.guild.id
		});
		//Return if there is no command data
		if (!commandData) return
        //Get text
        await text(commandData.name)
        //Add uses to the command
		await slash.findOne({
			name: args,
			guild: message.guild.id
		}, async (err, dUser) => {
			if (err) console.log(err);
			if(dUser?.uses){
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
				.setDescription(commandData.reply)
			await message.channel.send({ embeds: [replyembed] })
		} else {
			await message.channel.send({ content: commandData.reply })
		}
	},
};