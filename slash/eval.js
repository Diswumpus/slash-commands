const Discord = require('discord.js');
const color = require('../color.json').color;
const scommand = require('../models/slash-command');
const config = require('../config.json');
const owners = new Array(config.ownerID, config.owner2ID);

module.exports = {
    name: 'eval',
    description: 'Eval some code!',
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const code = interaction.options?.find(c => c?.name === 'code')?.value;

        const clean = text => {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        if(owners.includes(interaction.user.id)){
                try {
                    let evaled = eval(code);
        
                    if (typeof evaled !== "string")
                        evaled = require("util").inspect(evaled);
        
                        const embed = new Discord.MessageEmbed()
                        .setColor(color)
                        .setDescription(`\`\`\`\njs\n${clean(evaled)}\n\`\`\``)
                    await interaction.reply({ embeds: [embed] });
                } catch (err) {
                    const eembed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`${require('../emojis.json').xmark} \`Error\``)
                    .setDescription(`\`\`\`xl\n${clean(err)}\n\`\`\``)
                    await interaction.reply({ embeds: [eembed] }); //message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
                }
        }
    }
}