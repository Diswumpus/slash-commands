const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const ownerid = require('../config.json').ownerID;
const owner2id = require('../config.json').owner2ID;
const dt = require('discord-turtle');
const emojis = require('../emojis.json');
const ser = require('../models/server');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const premiumM = require('../models/premium.manager');

module.exports = {
  name: "server",
  description: "Manage the server settings!",
  data: new SlashCommandBuilder()
  .setName(`server`)
  .setDescription("Manage the server settings!"),
      /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
  async execute(client, interaction){
      //interaction.deferReply()

      const res = await ser.findOne({ guild: interaction.guild.id })
    const buttons = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('setColor')
        .setEmoji(emojis.flag_redoid)
        .setLabel(`Set Embed Color`)
        .setStyle("SECONDARY"),
    )
    let ccolor;
    const cancelButton = new MessageButton()
    .setCustomId('cancel')
    .setEmoji(emojis.flag_removeid)
    .setLabel(`Cancel`)
    .setStyle("DANGER")
    const colors = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId('colors')
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder(`Select a color`)
        .addOptions(
            {
                label: 'Black',
                value: 'DEFAULT',
            },
            {
                label: 'White',
                value: 'WHITE',
            },
            {
                label: 'Aqua',
                value: 'AQUA',
            },
            {
                label: 'Green',
                value: 'GREEN'
            },
            {
                label: 'Blue',
                value: 'BLUE',
            },
            {
                label: 'Yellow',
                value: 'YELLOW'
            },
            {
                label: 'Purple',
                value: 'PURPLE'
            },
            {
                label: 'Vivid Pink',
                value: 'LUMINOUS_VIVID_PINK'
            },
            {
                label: 'Fuchsia',
                value: 'FUCHSIA'
            },
            {
                label: 'Gold',
                value: 'GOLD'
            },
            {
                label: 'Orange',
                value: 'ORANGE'
            },
            {
                label: 'Red',
                value: 'RED'
            },
            {
                label: 'Grey',
                value: 'GREY'
            },
            {
                label: 'Darker Grey',
                value: 'DARKER_GREY'
            },
            {
                label: 'Navy',
                value: 'NAVY'
            },
            {
                label: "Blurple",
                value: "BLURPLE"
            }
        )
    )

    const filter = i=>i.user.id===interaction.user.id
    const embeds = {
        serverSettings: new MessageEmbed()
        .setColor(color)
        .addField(`Basic Settings`, `${emojis.reply} **Embed Color:** \`${res?.options?.color || "Black"}\``)
        .setTitle(`Server Settings`),
        noPrime: new MessageEmbed()
        .setColor(color)
        .setAuthor(`Your guild does not have premium! Changing the embed color is a premium feature`, `https://cdn.discordapp.com/emojis/${emojis.crownid}.png?v=1`, `${require('../color.json').website}premium`),
        userverSettings: async function(){
            const res2 = await ser.findOne({ guild: interaction.guild.id })
            let colorr;

            if(ccolor){
                colorr = ccolor
            } else if(res2?.options?.color){
                colorr = res2?.options?.color
            } else {
                colorr = "Black"
            }

            const embedd = new MessageEmbed()
            .setColor(color)
            .addField(`Basic Settings`, `${emojis.reply} **Embed Color:** \`${colorr}\``)
            .setTitle(`Server Settings`)

            return embedd
        },
        useSM: new MessageEmbed().setDescription(`Use the menu below to select a color`).setColor(color)
    }

        interaction.reply({ embeds: [embeds.serverSettings], components: [buttons] })
        
        const collector = await interaction.channel.createMessageComponentCollector({ filter: filter, message: interaction.fetchReply(), time: 1000000 })

        collector.on('collect', async i => {
            if(i.customId === 'setColor'){
                if(premiumM.hasPremium(interaction.guild.id)){
                await i.update({ embeds: [embeds.useSM], components: [new MessageActionRow().addComponents(cancelButton), colors] })
                interaction.channel.awaitMessageComponent({ time: 600000, filter: filter }).then(async i2 => {
                    if(i2.customId === 'cancel'){
                        i2.update({ embeds: [(await embeds.userverSettings())], components: [buttons] })
                    } else if(i2.customId === 'colors'){
                        const RESULT = await ser.findOne({ guild: interaction.guild.id });

                        if(RESULT){
                        await ser.findOne({
                            guild: interaction.guild.id
                        }, async function(err, doc) {
                            if(err) console.log(err)

                            doc.options.color = i2.values[0]

                            doc.save().catch(e => console.log(e))
                        })
                    } else {
                        new ser({
                            guild: interaction.guild.id,
                            options: {
                                color: i2.values[0]
                            }
                        }).save().catch(e => console.log(e))
                    }
                        ccolor = i2.values[0]

                        i2.update({ embeds: [(await embeds.userverSettings())], components: [buttons] })
                    }
                })
            } else {
                i.reply({ embeds: [embeds.noPrime], ephemeral: true })
            }
            }
        })
  }
}