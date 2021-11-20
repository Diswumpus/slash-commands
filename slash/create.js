const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const interactions = require('../interaction').get;
const wait = require('util').promisify(setTimeout);
const emojis = require('../emojis.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "create",
    c: "Server",
    description: "Create a slash command",
    usage: `name: String description: String reply: String (Not Required: embed: true|false)`,
    data: new SlashCommandBuilder()
        .setName(`create`)
        .setDescription("Create a slash command")
        .addStringOption(o => {
            return o.setName('name')
                .setDescription('The name of the command')
                .setRequired(true)
        })
        .addStringOption(o => {
            return o.setName('description')
                .setDescription('The description of the command')
                .setRequired(true)
        })
        .addStringOption(o => {
            return o.setName('reply')
                .setDescription('The reply of the command')
                .setRequired(true)
        })
        .addBooleanOption(o => {
            return o.setName('embed')
                .setDescription('If the reply should be an embed')
                .setRequired(false)
        })
        .addBooleanOption(o => {
            return o.setName('ephemeral')
                .setDescription('If the reply should be ephemeral')
                .setRequired(false)
        })
        .addBooleanOption(o => {
            return o.setName("buttons")
                .setDescription(`Should the command have buttons?`)
        })
        .addStringOption(o => {
            return o.setName("button_reply")
            .setDescription(`Needed if you have buttons enabled if this is not filled out then it will reply with the reply.`)
        }),
    /**
* 
* @param {Discord.Client} client 
* @param {Discord.CommandInteraction} interaction 
*/
    async execute(client, interaction) {
        //Defer Command
        const m2 = await interaction.deferReply();
        // Check member permissions
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            const nembed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${emojis.flag_remove} Sorry you don't have enough permissions!`)
            await interaction.editReply({ embeds: [nembed] })
            return
        };
        // Get interaction options
        const name = interaction.options.getString("name");
        const description = interaction.options.getString('description');
        const reply = interaction.options.getString('reply');
        const intembed = interaction.options.getBoolean('embed') || false;
        const eph = interaction.options.getBoolean('ephemeral') || false;
        const buttons = interaction.options.getBoolean('buttons') || false;

        if (!client.application?.owner) await client.application?.fetch();
        const data = new SlashCommandBuilder()
            .setName(name.toString().toLowerCase().replace(/ /g, "-"))
            .setDescription(description.toString())
        let err = {
            errored: false,
            err: ""
        }
        let command
        try {
            command = await interaction.guild?.commands.create(data.toJSON());
        } catch (e) {
            err.errored = true
            err.err = e.toString()
            console.log(e)
        }
        //Create id for easy use
        let theid = Math.floor(Math.random() * 5000);
        let testid;
        let i = false;
        for (; ;) {
            //Find it and make sure its not a duplicate
            testid = await slash.findOne({
                id: theid
            })
            if (theid !== testid?.id || testid?.id === 'null') {
                i = true
            } else {
                theid = Math.floor(Math.random() * 5000);
            }
            if (i === true) { break; }
        }
        /**
         * 
         * @param {Discord.Message} m 
         * @returns {Boolean}
         */
        const mfilter = m => m.author.id === interaction.user.id;
        const ifilter = i => i.user.id === interaction.user.id;
        let buttonFn;
        const row = []
        const button = new Discord.MessageButton();
        if (buttons === true) {
            await interaction.editReply({
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor(color)
                        .setDescription(`Type the button label\n\nType \`cancel\` to cancel this command.`)
                ]
            })
            interaction.channel.awaitMessages({ filter: mfilter, max: 1 })
                .then(async m1 => {
                    if (m1.first().toString().toLowerCase().includes("cancel")) return interaction.editReply({ content: `Canceled` })
                    button.setLabel(m1.first().toString())
                    await interaction.editReply({
                        embeds: [
                            new Discord.MessageEmbed()
                                .setColor(color)
                                .setDescription(`Type the button emoji. (ID or emoji)\n\nType \`skip\` to not put an emoji on the button.\n\nType \`cancel\` to cancel this command.`)
                        ]
                    })
                    interaction.channel.awaitMessages({ filter: mfilter, max: 1 })
                        .then(async m2 => {
                            if (m2.first().toString().toLowerCase().includes("cancel")) return interaction.editReply({ content: `Canceled` })
                            if(!m2.first().toString().toLowerCase().includes("skip")){
                                button.setEmoji(m2.first().toString())
                            }
                            await interaction.editReply({
                                embeds: [
                                    new Discord.MessageEmbed()
                                        .setColor(color)
                                        .setDescription(`Use the menu below to set the button style\n\nType \`cancel\` to cancel this command.`)
                                ], components: [
                                    new Discord.MessageActionRow()
                                        .addComponents(
                                            new Discord.MessageSelectMenu()
                                                .setCustomId("style_menu")
                                                .setPlaceholder("Select a style")
                                                .addOptions([
                                                    {
                                                        label: 'Blurple',
                                                        value: 'PRIMARY',
                                                    },
                                                    {
                                                        label: 'Grey',
                                                        value: 'SECONDARY',
                                                    },
                                                    {
                                                        label: 'Green',
                                                        value: 'SUCCESS',
                                                    },
                                                    {
                                                        label: 'Red',
                                                        value: 'DANGER',
                                                    }
                                                ])
                                        )
                                ]
                            })
                            interaction.channel.awaitMessages({ filter: mfilter, max: 1 })
                                .then(async m3 => {
                                    if (m2.first().toString().toLowerCase().includes("cancel")) return interaction.editReply({ content: `Canceled` })
                                })
                            interaction.channel.awaitMessageComponent({ filter: ifilter })
                                .then(async i3 => {
                                    if (i3.customId === "style_menu") {
                                        button.setStyle(i3.values[0])
                                        row.push(new Discord.MessageActionRow().addComponents(button))
                                        await i3.update({
                                            embeds: [
                                                new Discord.MessageEmbed()
                                                    .setColor(color)
                                                    .setDescription(`Use the menu below to set the button function`)
                                            ], components: [
                                                new Discord.MessageActionRow()
                                                    .addComponents(
                                                        new Discord.MessageSelectMenu()
                                                            .setCustomId("fn_menu")
                                                            .setPlaceholder("Select a function")
                                                            .addOptions([
                                                                {
                                                                    label: 'Delete message after 10s',
                                                                    value: 'MESSAGE_DELETE',
                                                                },
                                                                {
                                                                    label: 'Reply to button',
                                                                    value: 'REPLY',
                                                                }
                                                            ])
                                                    )
                                            ]
                                        })
                                        interaction.channel.awaitMessageComponent({ filter: ifilter })
                                        .then(async i4 => {
                                            if(i4.customId === "fn_menu"){
                                                buttonFn = i4.values[0]
                                                await createCommand();
                                            }
                                        })
                                    }
                                })

                        })
                })
        }
        if(buttons === false) await createCommand();
        async function createCommand() {
            //Log
            await require('../log').log(`${interaction.user.tag} Created \`/${command.name}\` on guild: \`${interaction.guild}\``, 'command', interaction)
            //Create the command in the database
            let dBase = new slash({
                id: command.id,
                qid: theid,
                guild: interaction.guild.id,
                reply: reply,
                name: command.name,
                embed: intembed,
                eph: eph,
                uses: 0,
                rows: row,
                buttonFn: buttonFn||null,
                buttonReply: interaction.options.getString("button_reply")||null
            });
            await dBase.save().catch(e => console.log(e));
            //Log
            require('../log').log(`${interaction.user.tag} Created \`/${command.name}\` on guild: \`${interaction.guild}\``, 'command')
            //Send message
            const embed = new Discord.MessageEmbed()
                .setTitle(`${require('../emojis.json').check} Created`)
                .addField('<:id:863464329725607936> ID:', `${theid} ||(${command.id})||`, true)
                .addField('<:slashCommand:872317151451705385> Name:', command.name, true)
                .addField('<:messages:863464329667411998> Description:', command.description, true)
                .addField('<:reply:880278277040795658> Reply:', `${reply}`, true)
                .setColor(color)
                .addField(`${require('../color.json').links_blank}`, `${require('../color.json').links}`)
            await interaction.editReply({ embeds: [embed], components: [] });
        }
    }
}
