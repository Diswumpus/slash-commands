const Discord = require("discord.js");
const color = require("./color.json").color;
const emojis = require('./emojis.json');

/**
 * Checks if a member has a permission if they don't the bot will reply/edit to the interaction.
 * @param {Discord.PermissionString} permission 
 * @param {Discord.CommandInteraction} interaction 
 */
 module.exports.checkPermissions = async (permission, interaction) => {
    const hasPerms = interaction.member.permissions.has(permission);

    const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(`${emojis.flag_remove} Sorry you don't have enough permissions!`)
    if(!hasPerms) {
        if(interaction.replied || interaction.deferred){
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }     
    }
}

module.exports.createEmbedFromText = (text) => {
    return new Discord.MessageEmbed()
    .setDescription(text)
    .setColor(color)
}