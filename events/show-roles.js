const Events = require("../Events");
const Mongoose = require("mongoose");
const Discord = require("discord.js");
const { errorMessage } = require("../functions");

module.exports = {
    name: Events.interactionCreate,
    /**
     * 
     * @param {Discord.ButtonInteraction|Discord.ContextMenuInteraction} interaction 
     * @param {Discord.Client} client 
     */
    async execute(interaction, client) {
        const member = interaction?.options?.getMember("user") || interaction.member;
        if(member.user.bot) return errorMessage(`This user is a bot!`, interaction);
        if(interaction.customId != "VIEW_ALL_ROLES" && interaction.commandName != "Show All Roles") return;
        const btnRoles = require("../models/button-roles");
        //Fetch guild
        const GuildBRoles = await btnRoles.find({ guild: interaction.guild.id });
        const AllGuildRoles = [];

        for (const role of GuildBRoles){
            AllGuildRoles.push(role.roles?.r1 || null)
            AllGuildRoles.push(role.roles?.r2 || null)
            AllGuildRoles.push(role.roles?.r3 || null)
            AllGuildRoles.push(role.roles?.r4 || null)
            AllGuildRoles.push(role.roles?.r5 || null)
            AllGuildRoles.push(role.roles?.r6 || null)
            AllGuildRoles.push(role.roles?.r7 || null)
            AllGuildRoles.push(role.roles?.r8 || null)
        };
        const hasRoles = [];
        /**
         * @type {Discord.GuildMemberRoleManager}
         */
        const Roles = member.roles;
        let p = 0;
        let p2 = 0;
        for (const Role of Roles.cache.values()) {
            if (AllGuildRoles.includes(Role.id)){
                p2++
            }
        }
        for (const Role of Roles.cache.values()) {
            if (AllGuildRoles.includes(Role.id)){
                hasRoles.push(`${p == p2-1 ? client.botEmojis.reply.show : client.botEmojis.stem.show} ${Role.toString()}`);
                p++
            }
        }
        if(p == 0) return errorMessage(`This user has no roles!`, interaction);
        await interaction.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor(require("../color.json").color)
                .addField(`${client.botEmojis.sroles} ${member.user.id == interaction.user.id ? "You're Roles" : `${member.nickname || member.user.username}'s Roles`}:`, hasRoles.join("\n"))
            ],
            ephemeral: true
        });
    }
}