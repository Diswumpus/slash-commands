const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const ownerid = require('../config.json').ownerID;
const owner2id = require('../config.json').owner2ID;
const dt = require('discord-turtle');

module.exports = {
  name: "list",
  description: "List the guilds commands",
      /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
  async execute(client, interaction) {
      // Check member permissions
      if(interaction.member.permissions.has('MANAGE_MESSAGES') || interaction.user.id !== ownerid || interaction.user.id !== owner2id){
      //Get options
      const ephemeral = interaction.options?.get('ephemeral')?.value || false;
      const global = interaction.options?.get('global')?.value || false;
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
      .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
      .setColor(color)
      /**
       * @type {Discord.MessageEmbed[]}
       */
      const embeds = new Array(command_embed);
      //Add them to the embed
      let i = 0
      let ce = 0
      for(const c of commands){
        i++
        if(i === 23){
          i = 0
          ce++
          embeds.push(command_embed)
        }
        embeds[ce].addField(`${info} Command: ${c.name}`, `${idemoji} ID: ${c.qid}\n${chart} Uses: ${c.uses || '0'}`, true)
      }
      const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
        .setCustomId('back')
        .setLabel('Back')
        .setEmoji(require('../emojis.json').flag_removeid)
        .setStyle('SECONDARY'),
        new Discord.MessageButton()
        .setCustomId('forward')
        .setLabel('Forward')
        .setEmoji(require('../emojis.json').flag_addid)
        .setStyle('SECONDARY')
      )
      const rowfo = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
        .setCustomId('back')
        .setLabel('Back')
        .setDisabled(true)
        .setEmoji(require('../emojis.json').flag_removeid)
        .setStyle('SECONDARY'),
        new Discord.MessageButton()
        .setCustomId('forward')
        .setLabel('Forward')
        .setEmoji(require('../emojis.json').flag_addid)
        .setStyle('SECONDARY')
      )
      const rowbo = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
        .setCustomId('back')
        .setLabel('Back')
        .setEmoji(require('../emojis.json').flag_removeid)
        .setStyle('SECONDARY'),
        new Discord.MessageButton()
        .setCustomId('forward')
        .setDisabled(true)
        .setLabel('Forward')
        .setEmoji(require('../emojis.json').flag_addid)
        .setStyle('SECONDARY')
      )
      const rowd = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
        .setCustomId('back')
        .setLabel('Back')
        .setDisabled(true)
        .setEmoji(require('../emojis.json').flag_removeid)
        .setStyle('SECONDARY'),
        new Discord.MessageButton()
        .setCustomId('forward')
        .setDisabled(true)
        .setLabel('Forward')
        .setEmoji(require('../emojis.json').flag_addid)
        .setStyle('SECONDARY')
      )
      const getComponent = () => {
        let c = rowfo
        if(embeds.length === 1){
          c = rowd
        }
        return c
      }
      //Send the embed
      await interaction.reply({ embeds: [embeds[0].setFooter(`Page 1/${embeds.length}`)], ephemeral: eph, components: [getComponent()] });
      let ii = 1
      const collector = await interaction.channel.createMessageComponentCollector({ filter: i=>i.user.id===interaction.user.id, time: 1000000 })
      collector.on('collect', i => {
        let component;

        if(ii-1 === 0){
          component = rowfo
        } else if(ii === embeds.length){
          component = rowbo
        } else {
          component = row
        }
        const page = ''
        if(i.customId === 'back'){
          ii--

          i.update({ embeds: [embeds[ii-1].setFooter(`Page ${ii}/${embeds.length}`)], components: [component] })
        } else if(i.customId === 'forward'){
          ii++

          i.update({ embeds: [embeds[ii-1].setFooter(`Page ${ii}/${embeds.length}`)], components: [component] })
        }

        if(ii-1 === 0){
          interaction.editReply({ components: [rowfo] })
        } else if(ii === embeds.length){
          interaction.editReply({ components: [rowbo] })
        }
      })
      collector.on('end', () => {
        interaction.editReply({ components: [rowd]})
      })
  }
}
}