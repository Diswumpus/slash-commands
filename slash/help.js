const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'help',
    description: 'Shows a list of commands',
    async execute(client, interaction) {
        const cmddd = interaction.options?.find(c => c?.name === 'command_name')?.value;
        if(!cmddd) {
        const helpp = new Discord.MessageEmbed()
        .setTitle(`Commands`)
        .setFooter(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor(color)
        const commands = client.slashcmds;
        commands.forEach(cmd => {
            helpp.addField(`Name: ${cmd.name}`, `Description: ${cmd.description}`, true);
        });
        await interaction.reply({ embeds: [helpp] });
    } else if(cmddd) {
        const helpp = new Discord.MessageEmbed()
        .setFooter(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor('BLURPLE')
        const commands = client.slashcmds;
        const cmd = commands.find(c => c.name === cmddd)
        helpp.addField(`Name: ${cmd.name}`, `Description: ${cmd.description}`)
        if(!cmd) {
            const notfound = new Discord.MessageEmbed()
            .setTitle(`Not found!`)
            .setColor('RED')
            await interaction.reply({ embeds: [notfound] })
        }
        await interaction.reply({ embeds: [helpp] });
    }
    }
}