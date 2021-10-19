const Discord = require('discord.js');
const color = require('../color.json').color;
const buttonRoles = require('../models/button-roles');

module.exports = {
    name: 'fixembed',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.GuildMember} Member 
     * @param {String[]} args 
     */
    async execute(message, Member, args) {
        const messageID = args[0];
        /**
         * @type {Discord.TextChannel}
         */
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        const embedMessage = (await channel.messages.fetch()).get(messageID);

        let res = buttonRoles.findOne({
            guild: message.guild.id,
            id: embedMessage.embeds[0].footer.text.toString()
        })
        if(!res) return message.reply(`The message id you sent is not a valid button role embed!`);
        res.messageID = embedMessage.id
        await res.save().catch(e => console.log(e));
        const embed = new Discord.MessageEmbed()
        .setColor(embedMessage.embeds[0].color)
        .setDescription(embedMessage.embeds[0].description)
        embedMessage.edit({ embeds: [embed] });
        message.reply(`Done!`)
    }
}
