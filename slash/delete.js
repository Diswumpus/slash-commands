const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const owner = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "delete",
    c: "Server",
    usage: `id: SlashCommandID`,
    data: new SlashCommandBuilder()
        .setName(`delete`)
        .setDescription("Delete a slash command")
        .addStringOption(o => {
            return o.setName('id')
                .setDescription('The id of the command (0000 or snowflake)')
        }),
        /**
         * @param {Discord.Client} client 
         * @param {Discord.Interaction} interaction 
         */
    async execute(client, interaction) {
        // Check member permissions
        if (interaction.member.permissions.has('MANAGE_MESSAGES') || interaction.user.id === owner.ownerID || interaction.user.id === owner.owner2ID) {
            // Get interaction options
            const cmdid = interaction.options.getString('id');

            let commandData;
            //Delete it
            //Check if it is custom id
            if (cmdid.length < 4 || cmdid.length === 4) {
                commandData = await slash.findOneAndDelete({
                    qid: cmdid
                });
                await interaction.guild.commands.delete(commandData.id)
            } else {
                commandData = await slash.findOneAndDelete({
                    id: cmdid
                })
                await interaction.guild.commands.delete(cmdid)
            }
            //Log
            await require('../log').log(`${interaction.user.tag} deleted \`/${commandData?.name}\` on guild: \`${interaction.guild}\``, 'command', interaction.guild)
            //Remove command from database
            //Reply
            const replyEmbed = new Discord.MessageEmbed()
                .setTitle(`${require('../emojis.json').check} Deleted`)
                .setDescription(`The command has been deleted!`)
                .setColor(color)
                .addField(`${require('../color.json').links_blank}`, `${require('../color.json').links}`)
            await interaction.reply({ embeds: [replyEmbed] })
        }
    }
}