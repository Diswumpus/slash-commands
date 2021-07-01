const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Shows a list of commands',
    async execute(client, interaction) {
        const cmddd = interaction.options?.find(c => c?.name === 'command_name')?.value;
        if(!cmddd) {
        const helpp = new Discord.MessageEmbed()
        .setTitle(`Commands`)
        .setFooter(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor('BLURPLE')
        const { commands } = client;
        commands.forEach(cmd => {
            helpp.addField(cmd.name, cmd.description);
        });
        await interaction.reply({ embeds: [helpp] });
    } else if(cmddd) {
        const helpp = new Discord.MessageEmbed()
        .setFooter(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor('BLURPLE')
        const { commands } = client;
        const cmd = commands.find(c => c.name === cmddd)
        helpp.addField(cmd.name, cmd.description)
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