//Get all packages/files
const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const color = require('../../color.json').color;
const { v4: uuidv4 } = require('uuid');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkPermissions, createEmbedFromText } = require('../../functions');
const menuRole = require("../../models/menu");

module.exports = {
    name: "role",
    description: "Show the role menu.",
    c: "buttonroles",
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Show the role menu.")
        .addSubcommand(s => {
            return s.setName("menu")
                .setDescription(`Show the role menu.`)
        }),
    /**
   * 
   * @param {Discord.Client} client 
   * @param {Discord.CommandInteraction} interaction 
   */
    async execute(client, interaction) {
        const res = await menuRole.findOne({
            guildID: interaction.guild.id
        });

        const menu = new Discord.MessageSelectMenu()
            .setCustomId("role_menu")
            .setPlaceholder("Pick some roles")

        for (const role of res.roles.values()) {
            menu.addOptions([
                {
                    label: role.name,
                    emoji: role.emoji,
                    value: role.roleID
                }
            ])
        }

        await interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`Use the menu below to get some roles!`)], components: [new MessageActionRow().addComponents(menu)]
        });
    }
}