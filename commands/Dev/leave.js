const Discord = require('discord.js');
const color = require('../../color.json').color;
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'leave',
    c: "Dev",
    description: 'Leaves a server',
    devOnly: true,
    usage: `guild_id: GuildID`,
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
        if (interaction.user.id !== require('../../config.json').ownerID) return

        const guild = interaction.options?.get('guild_id')?.value;

        if(!client.guilds.cache.has(guild)) return interaction.reply(`<:failed:899071447811624980> I'm not in that guild!`)
        const guildl = await client.guilds.cache.get(guild).leave()

        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.check} Left the guild!`)
            .setColor(color)
            .setDescription(`Left guild ${guildl.name} (${guildl.id})`)
            .addField(`${require('../../color.json').links_blank}‎`, `${require('../../color.json').links}‎`)
        await interaction.reply({ embeds: [embed] });
    }
}