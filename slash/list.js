const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const ownerid = require('../config.json').ownerID;
const owner2id = require('../config.json').owner2ID;

module.exports = {
  name: "list",
  description: "Remove your data!",
  async execute(client, interaction) {
      // Check member permissions
      if(!interaction.member.permissions.has('MANAGE_MESSAGES')) {
        if(interaction.user.id !== ownerid || interaction.user.id !== owner2id){
          return
        }
      }
      //Get options
      const ephemeral = interaction.options?.find(c => c?.name === 'ephemeral')?.value || false;
      const global = interaction.options?.find(c => c?.name === 'global')?.value || false;
      //Check if message is going to be ephemeral
      let eph;
      if(ephemeral === true){
        eph = true;
      } else {
        eph = false
      };
      //Get emojis
      const chart = client.emojis.cache.get('860201073364828220');
      const info = client.emojis.cache.get('860201073305583637');
      const idemoji = client.emojis.cache.get('860203490508668958');
      //Get all commands
      let commands;
      //Check if global is true and the user id is the same as the owner
      if(global === true){
        if(interaction.user.id === ownerid || interaction.user.id === owner2id){
        commands = await slash.find();
        eph = true;
        }
      } else {
        commands = await slash.find({ guild: interaction.guild.id });
      };
      //Create new embed
      const command_embed = new Discord.MessageEmbed()
      .setTitle(`${interaction.guild}'s Commands`)
      .addField(`‏‏‎ ‎`, `[Support Server](${require('../color.json').support}) | [Vote for me!](${require('../color.json').vote}) | [Invite Me!](${require('../color.json').inv})`)
      .setColor(color)
      //Add them to the embed
      commands.forEach(c => {
          command_embed.addField(`${info} Command: ${c.name}`, `${idemoji} ID: ${c.qid}\n${chart} Uses: ${c.uses || '0'}`, true)
      });
      //Send the embed
      await interaction.reply({ embeds: [command_embed], ephemeral: eph});
  }
}