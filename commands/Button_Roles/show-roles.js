//Get all packages/files
const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const color = require('../../color.json').color;
const { v4: uuidv4 } = require('uuid');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkPermissions, createEmbedFromText, errorMessage } = require('../../functions');
const btnRoles = require("../../models/button-roles");

module.exports = {
    name: "show-roles",
    description: "Creates a \"Show Roles\" button on a message or create a new message.",
    c: "buttonroles",
    data: new SlashCommandBuilder()
        .setName("show-roles")
        .setDescription("Creates a \"Show Roles\" button on a message or create a new message.")
        .addChannelOption(e => e.setName(`channel`).setRequired(false).setDescription(`The channel of the message or to send it in.`))
        .addStringOption(e => e.setName(`message_id`).setDescription(`This will add a button to the message.`)),
    /**
   * 
   * @param {Discord.Client} client 
   * @param {Discord.CommandInteraction} interaction 
   */
    async execute(client, interaction) {
        await checkPermissions("MANAGE_ROLES", interaction);
        //Fetch guild
        const GuildBRoles = await btnRoles.find({ guild: interaction.guild.id });
        //Fetch options
        /**
         * @type {Discord.TextChannel}
         */
        const Channel = interaction.options.getChannel("channel") || interaction.channel;
        const Messages = await (await Channel.messages.fetch());
        const Message = Messages.get(interaction.options.getString(`message_id`));
        let SentMessage;
        if(!Message && interaction.options.getString(`messageID`) != null) return errorMessage(`Message not found!`, interaction);
        //Check if to edit or send
        if(Message != null){
            let IsCorrectMessage;
            GuildBRoles.forEach(e => {
                if(e.messageID === Message.id) IsCorrectMessage = true;
            });

            if(IsCorrectMessage == true){
                Message.components.push(
                    {
                        type: 1,
                        components: [
                            new MessageButton()
                            .setCustomId(`VIEW_ALL_ROLES`)
                            .setEmoji(client.botEmojis.sroles.show)
                            .setLabel(`Show my roles`)
                            .setStyle("SECONDARY")
                        ]
                    }
                )
                SentMessage = await Message.edit({
                    components: Message.components
                })
            }
        } else {
            SentMessage = await Channel.send({
                content: `\u200b`,
                components: [
                    {
                        type: 1,
                        components: [
                            new MessageButton()
                            .setCustomId(`VIEW_ALL_ROLES`)
                            .setEmoji(client.botEmojis.sroles.show)
                            .setLabel(`Show my roles`)
                            .setStyle("SECONDARY")
                        ]
                    }
                ]
            })
        }
        await interaction.reply({
            embeds: [createEmbedFromText(`${client.botEmojis.b_check} Created!`)],
            components: [
                {
                    type: 1,
                    components: [
                        new MessageButton()
                        .setURL(SentMessage.url)
                        .setStyle("LINK")
                        .setLabel(`View Message`)
                        .setEmoji(client.botEmojis.link.show)
                    ]
                }
            ],
            ephemeral: true
        })
    }
};