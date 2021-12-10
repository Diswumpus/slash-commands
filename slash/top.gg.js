const Discord = require('discord.js');
const color = require('../color.json').color;
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'topgg',
    c: "Commands",
    description: 'Top.gg',
    devOnly: true,
    usage: ``,
    data: new SlashCommandBuilder()
        .setName(`topgg`)
        .setDescription("Top.gg")
        .addSubcommand(o => {
            return o.setName("vote")
            .setDescription("Vote for the bot!")
        })
        .addSubcommandGroup(sg => {
            return sg.setName("store")
            .setDescription(`The vote store!`)
            .addSubcommand(s => {
                return s.setName("buy")
                .setDescription(`Buy something from the shop.`)
                .addStringOption(o => o.setName("id").setDescription("The ID of the item.").setRequired(true))
            })
            .addSubcommand(s => {
                return s.setName("browse")
                .setDescription(`Browse the shop.`)
            })
        }),
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        
    }
}