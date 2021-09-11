const Discord = require('discord.js');
const color = require('../color.json').color;
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'leave',
    description: 'Leaves a server',
    devOnly: true,
    data: new SlashCommandBuilder()
    .setName(`leave`)
    .setDescription("Leaves a server")
    .addStringOption(o => {
        return o.setRequired(true)
        .setName('guild_id')
        .setDescription('The id of the guild')
    }),
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const guild = interaction.options?.get('guild_id')?.value;

        const guildl = await client.guilds.cache.get(guild).leave()

        const embed = new Discord.MessageEmbed()
        .setTitle(`${require('../emojis.json').x} Left the guild!`)
        .setColor(color)
        .setDescription(`Left guild ${guildl.name} (${guildl.id})`)
        .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
        await interaction.reply({ embeds: [embed] });
    }
}