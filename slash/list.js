const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;

module.exports = {
  name: "list",
  description: "Remove your data!",
  async execute(client, interaction) {
      // Check member permissions
      if(!interaction.member.permissions.has('MANAGE_MESSAGES')) return
      //Get all commands
      const commands = await slash.find({ guild: interaction.guild });
      //Create new embed
      const command_embed = new Discord.MessageEmbed()
      .setTitle(`${interaction.guild}'s Commands`)
      .setColor(color)
      //Add them to the embed
      commands.forEach(c => {
          command_embed.addField(`Command: ${c.name}`, `ID: ${c.qid} ||( ${c.id} )||`, true)
      });
      //Send the embed
      await interaction.reply({ embeds: [command_embed] });
  }
}