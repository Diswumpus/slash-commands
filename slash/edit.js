const Discord = require('discord.js');
const color = require('../color.json').color;
const scommand = require('../models/slash-command');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'edit',
    description: 'Edits a command',
    data: new SlashCommandBuilder()
    .setName(`edit`)
    .setDescription("Edit a slash command")
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
            reply: interaction.options?.get('reply')?.value,
            embed: interaction.options?.get('embed')?.value
        }
        const optionschanged = {
            reply: 'Nothing Changed',
            embed: 'Nothing Changed'
        }

        const commandr = await scommand.findOne({
            qid: command_id,
            guild: interaction.guild.id
        })

        if(commandr){
            await scommand.findOne({
                qid: command_id,
                guild: interaction.guild.id
            }, async function(err, doc) {
                if(err) throw err;

                if(options.embed){
                    doc.embed = options.embed
                    optionschanged.embed = options.embed.toString()
                }
                if(options.reply){
                    doc.reply = options.reply
                    optionschanged.reply = options.reply.toString()
                }
                doc.save().catch(e => console.log(e))
            })

            const embed = new Discord.MessageEmbed()
            .setTitle(`${require('../emojis.json').check} Edited the command!`)
            .setColor(color)
            .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
            if(optionschanged.reply){
                embed.addField(`Reply Changed`, `${commandr.reply} -> ${optionschanged.reply}`)
            }
            if(optionschanged.embed){
                embed.addField(`Embed Changed`, `${commandr.embed} -> ${optionschanged.embed}`)
            }

            await interaction.reply({ embeds: [embed] })
        }
    }
}