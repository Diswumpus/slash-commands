const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const emojis = require('../emojis.json');
const dt = require('discord-turtle');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "create-color-roles",
    c: "Server",
    description: "Slash Commands Premium!",
    usage: ``,
    data: new SlashCommandBuilder()
        .setName('create-color-roles')
        .setDescription(`Creates color roles for button roles!`),
    /**
* 
* @param {Discord.Client} client 
* @param {Discord.CommandInteraction} interaction 
*/
    async execute(client, interaction) {
        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES)) {
            const nembed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${emojis.flag_remove} Sorry you don't have enough permissions!`)
            await interaction.reply({ embeds: [nembed] })
            return
        };
        require('../log').log(`${interaction.user.tag} Created color roles on guild: ${interaction.guild}`, 'command', interaction.guild, interaction.user)
        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`Creating roles...`)
        function createButton(p) {
            return new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId("pos-dont-touch")
                        .setDisabled(true)
                        .setStyle("SECONDARY")
                        .setLabel(`6/${p}`)
                        .setEmoji("<:role:863829023293571082>")
                );
        }
        await interaction.reply({ embeds: [embed], components: [createButton(0)] })
        const roles = [
            { name: "🫐｜Purple", color: "PURPLE" },
            { name: "🔵｜Blue", color: "BLUE" },
            { name: "🍎｜Red", color: "RED" },
            { name: "🍏｜Green", color: "DARK_GREEN" },
            { name: "🪙｜Gold", color: "GOLD" },
            { name: "🧶｜Teal", color: "#008080" }
        ]

        const createdRoles = [];

        let i = 0;
        for (const role of roles) {
            i++
            const createdRole = await interaction.guild.roles.create({
                color: role.color,
                name: role.name,
                reason: "Color command",
                mentionable: false
            });
            createdRoles.push(createdRole);
            await interaction.editReply({ embeds: [embed], components: [createButton(i)] })
        }

        await interaction.editReply({
            embeds: [new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${require('../emojis.json').check} Created Roles!`)
            ]
        })
    }
}