const Discord = require('discord.js');
const color = require('../color.json').color;
const scommand = require('../models/slash-command');
const { SlashCommandBuilder } = require('@discordjs/builders');
const emojis = require('../emojis.json');

module.exports = {
    name: 'edit',
    c: "Server",
    description: 'Edits a command',
    usage: `Not required: reply: String embed: True|False`,
    data: new SlashCommandBuilder()
        .setName(`edit`)
        .setDescription("Edit a slash command")
        .addStringOption(o => {
            return o.setName("command_id")
            .setDescription(`The ID of the command`)
            .setRequired(true)
        })
        .addStringOption(o => {
            return o.setName('reply')
                .setDescription('The reply for the command')
        })
        .addBooleanOption(o => {
            return o.setName('embed')
                .setDescription('If the reply should be an embed')
        }),
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const command_id = interaction.options?.find(c => c?.name === 'command_id')?.value;

        const options = {
            reply: interaction.options.getString('reply'),
            embed: interaction.options.getString('embed')
        }
        const optionschanged = {
            reply: 'Nothing Changed',
            embed: 'Nothing Changed'
        }

        const commandr = await scommand.findOne({
            qid: command_id,
            guild: interaction.guild.id
        })

        if (commandr) {
            const doc = await scommand.findOne({
                qid: command_id,
                guild: interaction.guild.id
            })

            if (options.embed) {
                doc.embed = options.embed
                optionschanged.embed = options.embed.toString()
            }
            if (options.reply) {
                doc.reply = options.reply
                optionschanged.reply = options.reply.toString()
            }
            await doc.save().catch(e => console.log(e))

            const embed = new Discord.MessageEmbed()
                .setTitle(`${require('../emojis.json').check} Edited the command!`)
                .setColor(color)
                .addField(`${require('../color.json').links_blank}`, `${require('../color.json').links}`)
            if (optionschanged.reply) {
                embed.addField(`Reply Changed`, `${commandr.reply} -> ${optionschanged.reply}`)
            }
            if (optionschanged.embed) {
                embed.addField(`Embed Changed`, `${commandr.embed} -> ${optionschanged.embed}`)
            }

            await interaction.reply({ embeds: [embed] })
        } else {
            await interaction.reply(`${emojis.failed} I could not find that command!`)
        }
    }
}