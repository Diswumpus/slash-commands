const Discord = require('discord.js');
const color = require('../color.json').color;
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'help',
    description: 'Shows a list of commands',
    data: new SlashCommandBuilder()
    .setName(`help`)
    .setDescription("Show's a list of commands")
    .addStringOption(option => {
        return option.setName('command_name')
        .setDescription('The name of the command')
    }),
    async execute(client, interaction) {
        const cmddd = interaction.options?.get('command_name')?.value;
        if(!cmddd) {
        const helpp = new Discord.MessageEmbed()
        .setTitle(`${require('../emojis.json').tb} Commands`)
        .setFooter(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor(color)
        .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
        const commands = client.slashcmds;
        commands.forEach(cmd => {
            helpp.addField(`Name: ${cmd.name}`, `Description: ${cmd.description}`, true);
        });
        await interaction.reply({ embeds: [helpp] });
    } else if(cmddd) {
        const helpp = new Discord.MessageEmbed()
        .setFooter(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor('BLURPLE')
        .setTitle(`${require('../emojis.json').tb}`)
        .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
        const commands = client.slashcmds;
        const cmd = commands.find(c => c.name === cmddd)
        helpp.addField(`Name: ${cmd.name}`, `Description: ${cmd.description}`)
        if(!cmd) {
            const notfound = new Discord.MessageEmbed()
            .setTitle(`${require('../emojis.json').x} Not found!`)
            .setColor('RED')
            .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
            await interaction.reply({ embeds: [notfound] })
        }
        await interaction.reply({ embeds: [helpp] });
    }
    }
}