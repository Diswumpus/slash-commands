const Discord = require('discord.js');
const color = require('../color.json').color;
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'auto-tag',
    c: "Dev",
    description: 'Leaves a server',
    devOnly: true,
    usage: `guild_id: GuildID`,
    data: new SlashCommandBuilder()
        .setName(`auto-tag`)
        .setDescription("Auto tags!")
        .addSubcommand(o => {
            o
        }),
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        
    }
}