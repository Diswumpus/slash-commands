//Get all packages/files
const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const br = require('../models/button-roles');
const color = require('../color.json').color;
const owner = require('../config.json');
const { v4: uuidv4 } = require('uuid');
const { checkPermissions } = require("../functions");
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
    name: "create-button-roles",
    description: "Create Button Roles!",
    c: "buttonroles",
    data: new SlashCommandBuilder()
        .setName("create-button-roles")
        .setDescription("Create Button Roles!")
        .addStringOption(o => {
            return o.setName("style")
                .setDescription("The style for the buttons")
                .setRequired(false)
                .addChoice("Blurple", "PRIMARY")
                .addChoice("Grey", "SECONDARY")
                .addChoice("Green", "SUCCESS")
                .addChoice("Red", "DANGER")
                .addChoice("Random", "random")
        })
        .addStringOption(o => {
            return o.setName("color")
                .setDescription("The color for the embed")
                .setRequired(false)
                .addChoice("Blurple", "BLURPLE")
                .addChoice("Navy", "NAVY")
                .addChoice("Darker Grey", "DARKER_GREY")
                .addChoice("Grey", "GREY")
                .addChoice("Red", "RED")
                .addChoice("Orange", "ORANGE")
                .addChoice("Gold", "GOLD")
                .addChoice("Fuchsia", "FUCHSIA")
                .addChoice("Vivid Pink", "LUMINOUS_VIVID_PINK")
                .addChoice("Purple", "PURPLE")
                .addChoice("Yellow", "YELLOW")
                .addChoice("Blue", "BLUE")
                .addChoice("Green", "GREEN")
                .addChoice("Aqua", "AQUA")
                .addChoice("White", "WHITE")
                .addChoice("Black", "DEFAULT")
        })
        .addStringOption(o => {
            return o.setName("description")
                .setDescription("The description for the embed")
                .setRequired(false)
        }),
    /**
   * 
   * @param {Discord.Client} client 
   * @param {Discord.CommandInteraction} interaction 
   */
    async execute(client, interaction) {
        await checkPermissions("MANAGE_ROLES", interaction);
        //await interaction.defer()

        /**
         * @type {Discord.Role[]}
         */
        let roles = new Array();
        /**
         * @type {Discord.TextChannel}
         */
        let channel;

        const embeds = {
            roles: new MessageEmbed().setColor(color).setDescription(`Mention the roles for the button roles.\n\nExample \`@Green @Blue\` (You can have up to 8)`),
            channel: new MessageEmbed().setColor(color).setDescription(`Mention the channel you want the button role to be in.\n\nExample: \`#general\``),
            done: new MessageEmbed().setColor(color).setTitle(`${client.botEmojis.b_check} Created`)
        }

        interaction.reply({ embeds: [embeds.channel] })

        interaction.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1, time: 1000000 }).then(async m => {
            channel = m.first().mentions.channels.first()

            m.first().delete()

            interaction.editReply({ embeds: [embeds.roles] })

            interaction.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1, time: 100000000 }).then(async m2 => {
                const m3 = m2.first()

                let i = 0
                for (const role of m3.mentions.roles.entries()) {
                    if (i === 8) break;
                    i++
                    roles.push(role[1])
                }
                const colorStyles = {
                    styles: ["DANGER", "PRIMARY", "SECONDARY", "SUCCESS"],
                }
                function randomColor(){
                    return colorStyles.styles[Math.round(Math.random() * colorStyles.styles.length)];
                }
                if (channel.permissionsFor(interaction.guild.me).has('SEND_MESSAGES')) {
                    const buttons = {
                        style: interaction.options.getString("style") === "random" ? randomColor() : interaction.options.get('style')?.value || randomColor(),
                        r1: function () {
                            if (roles[0]) {
                                return new MessageButton()
                                    .setCustomId(roles[0]?.id || "NULL")
                                    .setLabel(roles[0]?.name || "NULL")
                                    .setStyle(buttons.style)
                            }
                        },
                        r2: function () {
                            if (roles[1]) {
                                return new MessageButton()
                                    .setCustomId(roles[1]?.id || "NULL")
                                    .setLabel(roles[1]?.name || "NULL")
                                    .setStyle(buttons.style)
                            }
                        },
                        r3: function () {
                            if (roles[2]) {
                                return new MessageButton()
                                    .setCustomId(roles[2]?.id || "NULL")
                                    .setLabel(roles[2]?.name || "NULL")
                                    .setStyle(buttons.style)
                            }
                        },
                        r4: function () {
                            if (roles[3]) {
                                return new MessageButton()
                                    .setCustomId(roles[3]?.id || "NULL")
                                    .setLabel(roles[3]?.name || "NULL")
                                    .setStyle(buttons.style)
                            }
                        },
                        r5: function () {
                            if (roles[4]) {
                                return new MessageButton()
                                    .setCustomId(roles[4]?.id || "NULL")
                                    .setLabel(roles[4]?.name || "NULL")
                                    .setStyle(buttons.style)
                            }
                        },
                        r6: function () {
                            if (roles[5]) {
                                return new MessageButton()
                                    .setCustomId(roles[5]?.id || "NULL")
                                    .setLabel(roles[5]?.name || "NULL")
                                    .setStyle(buttons.style)
                            }
                        },
                        r7: function () {
                            if (roles[6]) {
                                return new MessageButton()
                                    .setCustomId(roles[6]?.id || "NULL")
                                    .setLabel(roles[6]?.name || "NULL")
                                    .setStyle(buttons.style)
                            }
                        },
                        r8: function () {
                            if (roles[7]) {
                                return new MessageButton()
                                    .setCustomId(roles[7]?.id || "NULL")
                                    .setLabel(roles[7]?.name || "NULL")
                                    .setStyle(buttons.style)
                            }
                        },
                        allButtons: function () {
                            const roless = [
                                new MessageActionRow()
                            ]
                            if (roles[0]) {
                                roless[0].addComponents(this.r1())
                            }
                            if (roles[1]) {
                                roless[0].addComponents(this.r2())
                            }
                            if (roles[2]) {
                                roless[0].addComponents(this.r3())
                            }
                            if (roles[3]) {
                                roless[0].addComponents(this.r4())
                            }
                            if (roles[4]) {
                                roless[0].addComponents(this.r5())
                            }
                            if (roles[5]) {
                                roless.push(new MessageActionRow())
                                roless[1].addComponents(this.r6())
                            }
                            if (roles[6]) {
                                roless[1].addComponents(this.r7())
                            }
                            if (roles[7]) {
                                roless[1].addComponents(this.r8())
                            }
                            return roless
                        },
                        uuid: uuidv4(),
                        getEmbed: function () {
                            const embed = {
                                color: interaction.options?.get('color')?.value || color,
                                description: interaction.options.get('description')?.value
                            }
                            return new MessageEmbed()
                                .setColor(embed.color)
                                .setDescription(embed.description || `Use the buttons below to get some roles!`)
                        }
                    }
                    
                    const getRoles = () => {
                        const roleArr = []
                        roles.forEach(e => roleArr.push(e.name))
                        return roleArr.join();
                    }
                    const PAYLOAD = {
                        components: [
                            new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setStyle("SECONDARY")
                                        .setLabel("Send")
                                        .setEmoji(client.botEmojis.join.show)
                                        .setCustomId("send_btns")
                                )
                        ],
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`Button Roles`)
                                .addField(`${client.botEmojis.role} Roles:`, getRoles())
                                .addField(`${client.botEmojis.channel} Channel:`, channel.name)
                                .setColor(color)
                        ]
                    }
                    await interaction.editReply(PAYLOAD);
                    /** @type {Discord.Message} */
                    const message = await interaction.fetchReply();
                    message.awaitMessageComponent({ filter: i=>i.user.id===interaction.user.id })
                    .then(async i => {
                        const SENT_MESSAGE = await channel.send({ embeds: [buttons.getEmbed()], components: buttons.allButtons() })
                        i.update({ embeds: [embeds.done], components: [new MessageActionRow().addComponents(new MessageButton().setLabel("Jump to Message").setStyle('LINK').setURL(SENT_MESSAGE.url).setEmoji(require('../emojis.json').link))] })
                        require('../log').log(`${interaction.user.tag} Created button roles on guild: \`${interaction.guild}\``, 'command', interaction.guild)
                        await new br({
                            guild: interaction.guild.id,
                            id: buttons.uuid,
                            roles: {
                                r1: roles[0]?.role?.id || null,
                                r2: roles[1]?.role?.id || null,
                                r3: roles[2]?.role?.id || null,
                                r4: roles[3]?.role?.id || null,
                                r5: roles[4]?.role?.id || null,
                                r6: roles[5]?.role?.id || null,
                                r7: roles[6]?.role?.id || null,
                                r8: roles[7]?.role?.id || null
                            },
                            button_ID: {
                                r1: roles[0]?.role?.id || null,
                                r2: roles[1]?.role?.id || null,
                                r3: roles[2]?.role?.id || null,
                                r4: roles[3]?.role?.id || null,
                                r5: roles[4]?.role?.id || null,
                                r6: roles[5]?.role?.id || null,
                                r7: roles[6]?.role?.id || null,
                                r8: roles[7]?.role?.id || null
                            },
                            messageID: SENT_MESSAGE.id
                        }).save().catch(e => console.log(e))
                    })
                }
            })
        })
    }
}