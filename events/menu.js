const { color } = require('../color.json');
const Discord = require('discord.js');
const br = require('../models/menu');
const { oneLineCommaListsOr } = require('common-tags');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Discord.ButtonInteraction} interaction 
     * @param {Discord.Client} client 
     */
    async execute(interaction, client) {
        //if (!interaction.isSelectMenu()) return

        if (interaction.customId !== "role_menu") return
        const results = await br.findOne({
            guildID: interaction.guild.id
        })

        const addedRoles = [];
        const removedRoles = [];

        const brLog = require('../buttonLogger')
        for (const role of interaction.values) {
            interaction.member.roles.add(role);

            let ltype;
            if (interaction.member.roles.cache.has(role)) {
                interaction.member.roles.remove(role)
                ltype = "REMOVE"
                removedRoles.push(interaction.guild.roles.cache.get(role))
            } else {
                interaction.member.roles.add(role)
                ltype = "ADD"
                addedRoles.push(interaction.guild.roles.cache.get(role))
            }
            const brlogger = await new brLog({ message: interaction.message, member: interaction.member, role: interaction.guild.roles.cache.get(role) }).log(client, ltype)
        }

        /**
         * @type {Discord.TextChannel}
         */
        const permChannel = interaction.channel
        permChannel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
            USE_EXTERNAL_EMOJIS: true
        });

        const embed = new Discord.MessageEmbed()
        .setColor(color)
        .addField(`Roles Added:`, addedRoles.length > 0 ? oneLineCommaListsOr`${addedRoles}` : "No roles added")
        .addField(`Roles Removed:`, removedRoles.length > 0 ? oneLineCommaListsOr`${removedRoles}` : "No roles removed")
        .setThumbnail("https://cdn.discordapp.com/emojis/863829023293571082.png?size=96")
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};