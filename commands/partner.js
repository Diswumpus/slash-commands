const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'partner',
    description: 'Register a partnered server',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.GuildMember} Member 
     * @param {String[]} args 
     */
    async execute(message, Member, args) {
        if (message.author.id !== require('../config.json').ownerID) return
        const inv = await message.client.fetchInvite(args[0])
        const guild = inv.guild;

        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setThumbnail(guild.iconURL())
            .setTitle(`${guild.name}`)
            .setURL(inv.url)
            .setAuthor(`Slash Commands Partners`, message.client.user.displayAvatarURL(), require('../color.json').website)
            .setTimestamp()
            .setImage(guild.bannerURL() || guild.splashURL())
        if (guild.description) {
            embed.setDescription(`${guild.description}`)
        }

        message.guild.channels.cache.get('885951100497321995').send({ embeds: [embed] });
    }
}
