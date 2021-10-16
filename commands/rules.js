const Discord = require('discord.js');
const color = require('../color.json').color;
const du = require('discord.js-util');

module.exports = {
    name: 'rules',
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.GuildMember} Member 
     * @param {String[]} args 
     */
    async execute(message, Member, args) {
        if(message.author.id !== require('../config.json').ownerID) return

        /**
         * @type {Discord.Webhook}
         */
        const webhook = await message.channel.createWebhook(message.guild.name)
        const timestamp = new du.timestamp()
        .setStyle("f")
        .setTime(message.guild.createdTimestamp)
        const embed = new Discord.MessageEmbed()
        .setColor("BLURPLE")
        .setAuthor(`${message.guild.name} Staff`, message.guild.iconURL({ dynamic: true }), "https://discord.gg/jMV5Hvuw")
        .setTitle(`${message.guild.name}'s Rules:`)
        .setDescription(`Server created at: ${timestamp}\n\n<:dotfill:863826801376493579> Follow Discord Terms of Service.\n\n<:dotfill:863826801376493579> Please keep in mind we are an English server, and we ask that members, therefore, speak in English or use a translator\n\n<:dotfill:863826801376493579> Alting, Botting, or any form of selfbotting will result in an instant, unappealable, ban\n\n<:dotfill:863826801376493579> All moderation actions are final, moderators will punish as they see fits\n\n<:dotfill:863826801376493579> Use each channel for its intended topic(s)\n\n<:dotfill:863826801376493579> Refrain from posting any files or text that triggers a client bug (i.e: using a ton of spoilers, or posting an image that lags clients)\n\n<:dotfill:863826801376493579> Think before you say something - your message will be deleted if it is deemed inappropriate for use in the given channel`)
        .setTimestamp(message.guild.createdTimestamp)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))

        webhook.send({ embeds: [embed], avatarURL: message.guild.iconURL() });
    }
}
