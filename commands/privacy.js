const Discord = require('discord.js');
const color = require('../color.json').color;
const config = require('../config.json');
const owners = new Array(config.ownerID, config.owner2ID);

module.exports = {
    name: 'tosb',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.GuildMember} Member 
     * @param {String[]} args 
     */
    async execute(message, Member, args) {
        const guild = message.client.guilds.cache.get(args[0]) || message.guild;

        if(owners.includes(message.author.id)){
            const owner = await guild.fetchOwner();
            const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`It seems like you broke the TOS! You can read it here: https://pepperbot-development.github.io/slash-commands/tos.\n\nYou may have banned one of our devs! Turtlepaw or Bluepaw, if you do not unban them the bot will leave your server! or you may have an NSFW channel if you do not delete it the bot will leave your server!`)
            owner.send({ embeds: [embed] });
            message.reply(`\`✅\` ${message.author} Done!`)
        } else message.reply(`\`❎\` ${message.author} You cannot do that!`)
    }
}
