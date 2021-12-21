//Get all packages/files
const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const br = require('../models/button-roles');
const color = require('../color.json').color;
const owner = require('../config.json');
const { v4: uuidv4 } = require('uuid');
const { checkPermissions } = require("../functions");
const { SlashCommandBuilder } = require('@discordjs/builders');
const WebhookBuilder = require("../Util/webhookBuilder");
const { disableAllButtons } = require("../Util/util");


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
        })
        .addStringOption(o => {
            return o.setName("detailed")
                .setDescription(`Weather it should show all the roles in embeds.`)
                .addChoice("Embeds High", "EMBEDS_H")
                .addChoice("Embeds Low", "EMBEDS_L")
                .addChoice("One Embed", "EMBED")
                .addChoice("None", "NONE")
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
            channel = m.first().mentions.channels.first() || interaction.guild.channels.cache.find(e => e.name.toLowerCase() == m.first().content.toLowerCase()) || interaction.guild.channels.cache.get(m.first());

            if (channel?.client == null) {
                embeds.roles.setFooter(`Incorrect channel! The channel has been changed to ${interaction.channel.name}.`, client.botEmojis.failed.url)
                channel = interaction.channel;
            }

            interaction.editReply({ embeds: [embeds.roles] })

            interaction.channel.awaitMessages({ filter: m => m.author.id === interaction.user.id, max: 1, time: 100000000 }).then(async m2 => {
                const m3 = m2.first()
                const roleArray = [];
                m3.content.split(" ").forEach(e => roleArray.push(interaction.guild.roles.cache.get(e)));
                const mentions = m3.mentions.roles.size > 0 ? m3.mentions.roles.entries() : roleArray;
                let i = 0
                for (const role of mentions) {
                    if (i === 8) break;
                    i++
                    roles.push(Array.isArray(mentions) ? role : role[1])
                }
                const colorStyles = {
                    styles: ["DANGER", "PRIMARY", "SECONDARY", "SUCCESS"],
                }
                function randomColor() {
                    return colorStyles.styles[Math.round(Math.random() * colorStyles.styles.length - 1)];
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
                            if (interaction.options.getString("detailed") == null || interaction.options.getString("detailed") === "NONE") {
                                const embed = {
                                    color: interaction.options?.get('color')?.value || color,
                                    description: interaction.options.get('description')?.value
                                }

                                return [new MessageEmbed()
                                    .setColor(embed.color)
                                    .setDescription(embed.description || `Choose some roles!`)]
                            } else {
                                let utilPos = 0;
                                /**
                                 * @type {"EMBEDS_H"|"EMBEDS_L"|"EMBED"}
                                 */
                                const optionSelected = interaction.options.getString("detailed");
                                // ["Embeds High", "EMBEDS_H"]
                                // ["Embeds Low", "EMBEDS_L"],
                                // ["One Embed", "EMBED"],
                                // ["None", "NONE"]
                                if (optionSelected == "EMBED") {
                                    return [
                                        new MessageEmbed()
                                            .setColor(embed.color)
                                            .addField(`${client.botEmojis.sroles} Roles:`, `${roles.map(e => {
                                                utilPos++
                                                return `${utilPos == roles.length ? client.botEmojis.reply.show : client.botEmojis.stem.show} ${e.name}`
                                            })}`)
                                    ]
                                } else if (optionSelected == "EMBEDS_H") {
                                    const EMBEDSSS = [];
                                    roles.forEach(e => {
                                        EMBEDSSS.push(new MessageEmbed()
                                            .setTitle(e.name)
                                            .addField(`Permissions`, e.permissions.toArray().map(e => "`" + e + "`"))
                                            .addField(`Emoji`, e.unicodeEmoji || "None")
                                            .addField(`ID`, e.id)
                                            .addField(`Position`, `${e.position}`)
                                            .addField(`Hoisted`, `${e.hoist}`)
                                            .setColor(e.color || "#9DA8B3")
                                            .setThumbnail(e.iconURL())
                                        )
                                    })
                                    return EMBEDSSS
                                } else if (optionSelected == "EMBEDS_L") {
                                    const EMBEDSSS = [];
                                    roles.forEach(e => {
                                        EMBEDSSS.push(
                                            new MessageEmbed()
                                            .setTitle(e.name)
                                            .setColor(e.color || "#9DA8B3")
                                            .setThumbnail(e.iconURL())
                                        )
                                    })
                                    return EMBEDSSS
                                }
                            }

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
                                        .setCustomId("send_btns"),
                                    new MessageButton()
                                        .setCustomId("send_btns_wh")
                                        .setLabel("Send as webhook")
                                        .setEmoji(client.botEmojis.bot_add.show)
                                        .setStyle("SECONDARY")
                                )
                        ],
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`Button Roles`)
                                .addField(`${client.botEmojis.role} Roles:`, roles.map(e => e.toString()).join(", "))
                                .addField(`${client.botEmojis.channel} Channel:`, channel.toString())
                                .setColor(color)
                        ]
                    }
                    await interaction.editReply(PAYLOAD);
                    /** @type {Discord.Message} */
                    const message = await interaction.fetchReply();
                    const WebHook = new WebhookBuilder().setChannel(channel);
                    let SENT_MESSAGE;
                    message.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id })
                        .then(async i => {
                            if (i.customId === 'send_btns_wh') {
                                await i.update({
                                    embeds: [
                                        {
                                            title: `${client.botEmojis.bot_add} Webhook Name`,
                                            description: `Enter the name/username of the webhook.`,
                                            color: color
                                        },

                                    ], components: [
                                        disableAllButtons([
                                            new MessageButton()
                                                .setStyle("SECONDARY")
                                                .setLabel("Send")
                                                .setEmoji(client.botEmojis.join.show)
                                                .setCustomId("send_btns"),
                                            new MessageButton()
                                                .setCustomId("send_btns_wh")
                                                .setLabel("Send as webhook")
                                                .setEmoji(client.botEmojis.bot_add.show)
                                                .setStyle("SECONDARY")
                                        ])
                                    ]
                                });
                                const WhMessage1 = await (await interaction.channel.awaitMessages({ filter: i => i.author.id === interaction.user.id, max: 1 })).first();

                                WebHook.setName(WhMessage1.content);

                                await interaction.editReply({
                                    embeds: [
                                        {
                                            title: `${client.botEmojis.bot_add} Webhook Avatar`,
                                            description: `Enter the avatar/profile picture of the webhook.\n\nEnter \`Skip\` to skip this!`,
                                            color: color
                                        }
                                    ]
                                });

                                const WhMessage2 = await (await interaction.channel.awaitMessages({ filter: i => i.author.id === interaction.user.id, max: 1 })).first();
                                let avC = WhMessage2.content;
                                if (avC.toLowerCase() == "skip") avC = null;
                                if (WhMessage2.attachments.size > 0) avC = WhMessage2.attachments.first().url;
                                if (avC != null) WebHook.setAvatar(avC)
                                const TooManyWhs = await (await channel.fetchWebhooks());
                                if (TooManyWhs.size == 10) {
                                    TooManyWhs.first().delete(`Too many webhooks!`)
                                    embeds.done.setFooter(`Deleted 1 webhook! Reason: Too many webhooks`, client.botEmojis.failed.url)
                                }
                                SENT_MESSAGE = await WebHook.CreateAndSend({ embeds: buttons.getEmbed(), components: buttons.allButtons() })
                            } else if (i.customId === "send_btns") {
                                SENT_MESSAGE = await channel.send({ embeds: buttons.getEmbed(), components: buttons.allButtons() })
                            }
                            const EndPayload = { embeds: [embeds.done], components: [new MessageActionRow().addComponents(new MessageButton().setLabel("Jump to Message").setStyle('LINK').setURL(SENT_MESSAGE.url).setEmoji(client.botEmojis.link))] };
                            i.replied ? interaction.editReply(EndPayload) : i.update(EndPayload);
                            require('../log').log(`${interaction.user.tag} Created button roles on guild: \`${interaction.guild}\``, 'command', interaction.guild, interaction.user)
                            await new br({ //~~Err here!!~~ Fixed
                                guild: interaction.guild.id,
                                id: buttons.uuid,
                                roles: {
                                    r1: roles[0]?.id || null,
                                    r2: roles[1]?.id || null,
                                    r3: roles[2]?.id || null,
                                    r4: roles[3]?.id || null,
                                    r5: roles[4]?.id || null,
                                    r6: roles[5]?.id || null,
                                    r7: roles[6]?.id || null,
                                    r8: roles[7]?.id || null
                                },
                                button_ID: {
                                    r1: roles[0]?.id || null,
                                    r2: roles[1]?.id || null,
                                    r3: roles[2]?.id || null,
                                    r4: roles[3]?.id || null,
                                    r5: roles[4]?.id || null,
                                    r6: roles[5]?.id || null,
                                    r7: roles[6]?.id || null,
                                    r8: roles[7]?.id || null
                                },
                                messageID: SENT_MESSAGE.id
                            }).save().catch(e => console.log(e))
                        })
                }
            })
        })
    }
}
