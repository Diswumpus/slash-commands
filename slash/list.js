const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const ownerid = require('../config.json').ownerID;
const owner2id = require('../config.json').owner2ID;
const dt = require('discord-turtle');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: "list",
  c: "Server",
  description: "List the guilds commands",
  usage: `Not required: ephemeral: true|false global: true|false`,
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription(`Lists the guilds commands`)
    .addBooleanOption(option => {
      return option.setName('ephemeral')
        .setDescription('Make it so only you can see the message')
        .setRequired(false)
    })
    .addBooleanOption(option => {
      return option.setName('global')
        .setDescription('See every command')
        .setRequired(false)
    }),
  /**
* 
* @param {Discord.Client} client 
* @param {Discord.CommandInteraction} interaction 
*/
  async execute(client, interaction) {
    // Check member permissions
    if (interaction.member.permissions.has('MANAGE_MESSAGES') || interaction.user.id === ownerid || interaction.user.id === owner2id) {
      //Get options
      const ephemeral = interaction.options?.get('ephemeral')?.value || false;
      const global = interaction.options?.get('global')?.value || false;
      //Check if message is going to be ephemeral
      let eph;
      if (ephemeral === true) {
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
      if (global === true) {
        if (interaction.user.id === ownerid || interaction.user.id === owner2id) {
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
      const embeds = [];

      let i = 1;
      let i2 = 0;

      let text = "";
      let textLengths = []
      let pages = []
      let currentPage = "";
      let msgCount = 0;
      for (const c of commands) {
        let content = `**${client.botEmojis.info} Command: ${c.name}**\n${client.botEmojis.profile} ID: ${c.qid}\n${chart} Uses: ${c.uses || '0'}\n\n`
        let textToAdd = content
        currentPage += textToAdd;
        msgCount++;
        if (msgCount % 10 == 0) {
          pages.push(currentPage)
          currentPage = []
        }
      }
      if (currentPage.length > 0) pages.push(currentPage)
      let ii = 0
      for (const textt of pages) {
        embeds.push(new Discord.MessageEmbed().setColor(color).setAuthor(interaction.user.tag, interaction.user.displayAvatarURL()).setDescription(textt))
      }
      const buttons = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId("<")
            .setEmoji(client.botEmojis.leave)
            .setStyle("SECONDARY"),
          new Discord.MessageButton()
            .setCustomId("pagesdonttouch")
            .setLabel(`${i} of ${embeds.length}`)
            .setStyle("SECONDARY")
            .setDisabled(true),
          new Discord.MessageButton()
            .setCustomId(">")
            .setEmoji(client.botEmojis.join)
            .setStyle("SECONDARY")
        )
      if (embeds.length < 2) {
        buttons.components[0].setDisabled(true)
        buttons.components[2].setDisabled(true)
      }
      await interaction.reply({ embeds: [embeds[i2]], components: [buttons], ephemeral: eph });

      /**
       * @type {Discord.Message}
       */
      const m = await interaction.fetchReply();

      const collector = interaction.channel.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id })

      collector.on("collect", async i3 => {
        if (i3.customId === "<") {
          if (embeds.length === 1) {
            //...
          } else if (i2 === 0) {
            i2 = embeds.length - 1
            i = embeds.length
          } else {
            i2--
            i--
          }

          buttons.components[1].setLabel(`${i} of ${embeds.length}`)
          i3.update({ embeds: [embeds[i2]], components: [buttons] })
        } else if (i3.customId === ">") {
          if (embeds.length === 1) {
            //...
          } else if (i2 + 1 === embeds.length) {
            i2 = 0
            i = 1
          } else {
            i2++
            i++
          }

          buttons.components[1].setLabel(`${i} of ${embeds.length}`)
          i3.update({ embeds: [embeds[i2]], components: [buttons] })
        }
      })
    }
  }
}