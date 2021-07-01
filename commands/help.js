const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'help',
    description: 'Shows a list of commands',
    async execute(message, Member, args) {
        if(!args[0]) {
        const helpp = new Discord.MessageEmbed()
        .setTitle(`Commands`)
        .setFooter(`${message.client.user.username}`, message.client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor(color)
        const { commands } = message.client;
        commands.forEach(cmd => {
            helpp.addField(cmd.name, cmd.description);
        });
        await message.channel.send({ embeds: [helpp] });
    } else if(args[0]) {
        const helpp = new Discord.MessageEmbed()
        .setTitle(`${args[0]}`)
        .setFooter(`${message.client.user.username}`, message.client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor(color)
        const { commands } = message.client;
        const cmd = commands.find(c => c.name === args[0])
        helpp.addField(cmd.name, cmd.description)
        if(!cmd) {
            message.channel.send(
                new Discord.MessageEmbed()
                .setTitle(`Not found!`)
                .setColor('RED')
            )
        }
        await message.channel.send({ embeds: [helpp] });
    }
    }
}