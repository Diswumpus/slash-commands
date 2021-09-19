const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const emojis = require('../emojis.json');
const dt = require('discord-turtle');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "premium",
    c: "Server",
    description: "Slash Commands Premium!",
    devOnly: true,
    usage: ``,
    data: new SlashCommandBuilder()
        .setName('premium')
        .setDescription(`Slash Commands Premium!`),
    /**
* 
* @param {Discord.Client} client 
* @param {Discord.CommandInteraction} interaction 
*/
    async execute(client, interaction) {
        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`Slash Commands Premium Beta`)
            .setDescription(`[Slash Commands Premium](https://turtlebot-discord.github.io/slash-commands/premium)\n\n${emojis.dotfill} Custom Embed Color\n${emojis.dotfill} You can use \`!\` instead of \`/\`\n${emojis.dotfill} More coming soon`)

        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji(emojis.reaction_add)
                    .setCustomId("free_trial")
                    .setLabel("Free Trial (Coming Soon)")
                    .setDisabled(true),
                new Discord.MessageButton()
                    .setStyle("LINK")
                    .setURL("https://discord.gg/64urq7rH73")
                    .setEmoji(emojis.atada)
                    .setLabel("Win Giveaways"),
                new Discord.MessageButton()
                    .setStyle("LINK")
                    .setURL("https://turtlebot-discord.github.io/slash-commands/partner")
                    .setEmoji(emojis.flag_add)
                    .setLabel("Partner"),
                new Discord.MessageButton()
                    .setStyle("LINK")
                    .setURL("https://discord.gg/64urq7rH73")
                    .setEmoji(emojis.crown)
                    .setLabel("Buy Premium (Coming Soon)")
                    .setDisabled(true),
                new Discord.MessageButton()
                    .setStyle("LINK")
                    .setURL("https://turtlebot-discord.github.io/slash-commands/premium")
                    .setEmoji(emojis.join)
                    .setLabel("More Info")
            )

        await interaction.reply({ embeds: [embed], components: [row] });
    }
}