const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const owner = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "invite",
    c: "Commands",
    usage: ``,
    devOnly: true,
    data: new SlashCommandBuilder()
    .setName(`invite`)
    .setDescription("Invite the bot"),
        /**
   * 
   * @param {Discord.Client} client 
   * @param {Discord.CommandInteraction} interaction 
   */
    async execute(client, interaction) {
        const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(`${client.user.username} Invite`)
        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`You can use the (dashboard)[https://] to manage the bot or invite it you can also invite the bot using the link below`)
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setStyle("LINK")
            .setURL(client.dashboardAdd)
            .setLabel("Dashboard Invite"),
            new Discord.MessageButton()
            .setStyle("LINK")
            .setURL(client.generateInvite({ scopes: ['applications.commands', 'bot'], permissions: "ADMINISTRATOR" }))
            .setLabel("Bot Invite"),
        )
        interaction.reply({ embeds: [embed], components: [row] });
    }
}