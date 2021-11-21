//Get all packages/files
const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const color = require('../color.json').color;
const { v4: uuidv4 } = require('uuid');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkPermissions, createEmbedFromText } = require('../functions');
const menuRole = require("../models/menu");

module.exports = {
    name: "menu",
    description: "Add, remove, or delete your role menu.",
    c: "buttonroles",
    data: new SlashCommandBuilder()
        .setName("menu")
        .setDescription("Add, remove, or delete your role menu.")
        .addSubcommand(s => {
            return s.setName("add")
            .setDescription(`Add a role to the role menu`)
            .addRoleOption(o => o.setName("role").setDescription(`The role to add.`).setRequired(true))
            .addStringOption(o => o.setName("name").setDescription(`The name of the item.`))
            .addStringOption(o => o.setName("emoji").setDescription(`The emoji of the item.`))
        })
        .addSubcommand(s => {
            return s.setName("remove")
            .setDescription(`Remove a role from the role menu.`)
            .addRoleOption(o => o.setName("role").setDescription("The role to remove.").setRequired(true))
        }),
    /**
   * 
   * @param {Discord.Client} client 
   * @param {Discord.CommandInteraction} interaction 
   */
    async execute(client, interaction) {
        await checkPermissions("MANAGE_ROLES", interaction);
        await interaction.deferReply();
        
        const options = {
            role: interaction.options.getRole("role"),
            name: interaction.options.getString("name") || interaction.options.getRole("role").name || null,
            emoji: interaction.options.getString("emoji")
        }

        /**
         * @type {"add"|"remove"}
         */
        const subcommand = interaction.options.getSubcommand();

        const res1 = await menuRole.findOne({
            guildID: interaction.guild.id
        });
        if(subcommand === "add"){
            if(!res1){
                await new menuRole({
                    guildID: interaction.guild.id,
                    roles: new Map()
                }).save().catch(e => console.log(e));
            }

            const doc = await menuRole.findOne({
                guildID: interaction.guild.id
            })

            doc.roles.set(options.role.id, { roleID: options.role.id, name: options.name, emoji: options.emoji })

            doc.save().catch(e => console.log(e));

            await interaction.editReply({ embeds: [createEmbedFromText(`${client.botEmojis.check_} Added ${options.role} to the role menu!`)]});
        } else if(subcommand === "remove"){
            if(!res1) {
                await interaction.editReply(`${client.botEmojis.failed} Your guild has not set up the role menu yet!`);
            }
            const doc = await menuRole.findOne({
                guildID: interaction.guild.id
            })

            doc.roles.delete(options.role.id)

            doc.save().catch(e => console.log(e));

            await interaction.editReply({ embeds: [createEmbedFromText(`${client.botEmojis.check_} Removed ${options.role} from the role menu!`)]});
        }
    }
}