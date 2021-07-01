const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;

module.exports = {
  name: "list",
  description: "Remove your data!",
  async execute(client, interaction) {
      // Check member permissions
      if(!interaction.member.permissions.has('MANAGE_MESSAGES')) return
      //Get emojis
      const chart = client.emojis.cache.get('860201073364828220');
      const info = client.emojis.cache.get('860201073305583637');
      const idemoji = client.emojis.cache.get('860203490508668958');
      //Get all commands
      const commands = await slash.find({ guild: interaction.guild.id });
      //Create new embed
      const command_embed = new Discord.MessageEmbed()
      .setTitle(`${interaction.guild}'s Commands`)
      .setColor(color)
      //Add them to the embed
      commands.forEach(c => {
          command_embed.addField(`${info} Command: ${c.name}`, `${idemoji} ID: ${c.qid}\n${chart} Uses: ${c.uses || '0'}`, true)
      });
      //Send the embed
      await interaction.reply({ embeds: [command_embed] });
  }
}