const Discord = require("discord.js");
const slash = require('../../models/slash-command');
const color = require('../../color.json').color;
const ownerid = require('../../config.json').ownerID;
const owner2id = require('../../config.json').owner2ID;
const dt = require('discord-turtle');
const emojis = require('../../emojis.json');
const ser = require('../../models/server');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const premiumM = require('../../models/premium.manager');

module.exports = {
    name: "server",
    c: "Server",
    description: "Manage the server settings!",
    data: new SlashCommandBuilder()
        .setName(`server`)
        .setDescription("Manage the server settings."),
    /**
   * 
   * @param {Discord.Client} client 
   * @param {Discord.CommandInteraction} interaction 
   */
    async execute(client, interaction) {
        //interaction.deferReply()

        const res = await ser.findOne({ guild: interaction.guild.id })
        const res2 = await require('../../buttonLogger').getChannel(interaction.guild.id)
        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('setColor')
                    .setEmoji(emojis.flag_redoid)
                    .setLabel(`Set Embed Color`)
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId('setLog')
                    .setEmoji(emojis.channel_redo)
                    .setLabel(`Set Log Channel`)
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId('close')
                    .setEmoji(emojis.leave)
                    .setLabel(`Close`)
                    .setStyle("SECONDARY"),
            )
        let ccolor;
        let logChan;
        const cancelButton = new MessageButton()
            .setCustomId('cancel')
            .setEmoji(emojis.flag_removeid)
            .setLabel(`Cancel`)
            .setStyle("SECONDARY")
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

        const filter = i => i.user.id === interaction.user.id
        const embeds = {
            serverSettings: new MessageEmbed()
                .setColor(color)
                .addField(`Basic Settings`, `${emojis.stem} **Log Channel:** ${res2?.channel ? `<#${res2?.channel}>` : "None"}\n${emojis.reply} **Embed Color:** \`${res?.options?.color || "Black"}\``)
                .setTitle(`Server Settings`),
            noPrime: new MessageEmbed()
                .setColor(color)
                .setAuthor(`Your guild does not have premium! Changing the embed color is a premium feature`, `https://cdn.discordapp.com/emojis/${emojis.crownid}.png?v=1`, `${require('../../color.json').website}premium`),
            close: new MessageEmbed()
                .setColor(color)
                .setTitle(`Server Settings`)
                .setDescription(`${emojis.idle.emoji} You have finished editing your settings.`),
            userverSettings: async function () {
                const res2 = await ser.findOne({ guild: interaction.guild.id })
                let colorr;

                if (ccolor) {
                    colorr = ccolor
                } else if (res2?.options?.color) {
                    colorr = res2?.options?.color
                } else {
                    colorr = "Black"
                }

                const embedd = new MessageEmbed()
                    .setColor(color)
                    .addField(`Basic Settings`, `${emojis.stem} **Log Channel:** ${logChan || "None"}\n${emojis.reply} **Embed Color:** \`${colorr}\``)
                    .setTitle(`Server Settings`)

                return embedd
            },
            mentionChannel: new MessageEmbed().setDescription(`Mention a channel for the bot to log to.`).setColor(color),
            useSM: new MessageEmbed().setDescription(`Use the menu below to select a color`).setColor(color),
        }

        interaction.reply({ embeds: [embeds.serverSettings], components: [buttons] })

        const collector = await interaction.channel.createMessageComponentCollector({ filter: filter, message: interaction.fetchReply(), time: 1000000 })

        collector.on('end', async () => {
            interaction.editReply({ embeds: [embeds.close], components: [] });
        })
        collector.on('collect', async i => {
            if (i.customId === 'setColor') {
                var hasPremium = await premiumM.hasPremium(interaction.guild.id)
                if (hasPremium) {
                    await i.update({ embeds: [embeds.useSM], components: [new MessageActionRow().addComponents(cancelButton), colors] })
                    interaction.channel.awaitMessageComponent({ time: 600000, filter: filter }).then(async i2 => {
                        if (i2.customId === 'cancel') {
                            i2.update({ embeds: [(await embeds.userverSettings())], components: [buttons] })
                        } else if (i2.customId === 'colors') {
                            const RESULT = await ser.findOne({ guild: interaction.guild.id });

                            if (RESULT) {
                                await ser.findOne({
                                    guild: interaction.guild.id
                                }, async function (err, doc) {
                                    if (err) console.log(err)

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
            } else if (i.customId === 'setLog') {
                const logManager = require('../../buttonLogger');

                i.update({ embeds: [embeds.mentionChannel], components: [new MessageActionRow().addComponents(cancelButton)] })
                interaction.channel.awaitMessageComponent({ time: 600000, filter: filter }).then(async i3 => {
                    return i3.update({ embeds: [(await embeds.userverSettings())], components: [buttons] })
                })
                interaction.channel.awaitMessages({ time: 600000, filter: m => m.author.id === interaction.user.id, max: 1 })
                    .then(async m => {
                        const chann = m.first().mentions.channels.first()
                        logManager.addChannel(chann)
                        logChan = chann

                        interaction.editReply({ embeds: [(await embeds.userverSettings())], components: [buttons] })
                    })
            } else if (i.customId === 'close') {
                return i.update({ embeds: [embeds.close], components: [] });
            }
        })
    }
}