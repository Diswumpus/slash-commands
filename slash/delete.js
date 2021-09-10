const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const owner = require('../config.json');

module.exports = {
    name: "delete",
    async execute(client, interaction) {
        // Check member permissions
        if (interaction.member.permissions.has('MANAGE_MESSAGES') || interaction.user.id === owner.ownerID || interaction.user.id === owner.owner2ID) {
            // Get interaction options
            const cmdid = interaction.options?.find(c => c?.name === 'id')?.value;
            //Delete it
            //Check if it is custom id
            if (cmdid.length < 4 || cmdid.length === 4) {
                let commandData = await slash.findOne({
                    qid: cmdid
                });
                interaction.guild.commands.delete(commandData.id)
                await slash.findOneAndRemove({
                    qid: cmdid
                })
            } else {
                interaction.guild.commands.delete(cmdid)
                await slash.findOneAndRemove({
                    id: cmdid
                })
            }
            //Log
            require('../log').log(`${interaction.user.tag} deleted \`/${commandData?.name}\` on guild: \`${interaction.guild}\``, 'command')
            //Remove command from database
            //Reply
            const embed = new Discord.MessageEmbed()
                .setTitle(`${require('../emojis.json').check} Deleted`)
                .setColor(color)
                .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
            await interaction.reply({ embeds: [embed] })
        }
    }
}