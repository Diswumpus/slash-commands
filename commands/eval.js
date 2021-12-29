const Discord = require('discord.js');
const color = require('../color.json').color;
const scommand = require('../models/slash-command');
const config = require('../config.json');
const owners = new Array(config.ownerID, config.owner2ID);
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'eval',
    c: "Dev",
    description: 'Eval some code!',
    usage: `code: jsString`,
    data: new SlashCommandBuilder()
        .setName(`eval`)
        .setDescription("Eval some code!")
        .addStringOption(o => {
            return o.setName('code')
                .setDescription('The code you want to eval')
                .setRequired(true)
        }),
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const code = interaction.options?.get('code')?.value;

        const clean = text => {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        if (owners.includes(interaction.user.id)) {
            try {
                let evaled = eval(code);

                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);

                const embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(`\`\`\`\nxl\n${clean(evaled)}\n\`\`\``)
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
