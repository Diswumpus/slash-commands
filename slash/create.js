const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const interactions = require('../interaction').get;
const wait = require('util').promisify(setTimeout);
const emojis = require('../emojis.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "create",
    c: "Server",
    description: "Create a slash command",
    usage: `name: String description: String reply: String (Not Required: embed: true|false)`,
    data: new SlashCommandBuilder()
        .setName(`create`)
        .setDescription("Create a slash command")
        .addStringOption(o => {
            return o.setName('name')
                .setDescription('The name of the command')
                .setRequired(true)
        })
        .addStringOption(o => {
            return o.setName('description')
                .setDescription('The description of the command')
                .setRequired(true)
        })
        .addStringOption(o => {
            return o.setName('reply')
                .setDescription('The reply of the command')
                .setRequired(true)
        })
        .addBooleanOption(o => {
            return o.setName('embed')
                .setDescription('If the reply should be an embed')
                .setRequired(false)
        })
        .addBooleanOption(o => {
            return o.setName('ephemeral')
                .setDescription('If the reply should be ephemeral')
                .setRequired(false)
        }),
    /**
* 
* @param {Discord.Client} client 
* @param {Discord.CommandInteraction} interaction 
*/
    async execute(client, interaction) {
        //Defer Command
        const m2 = await interaction.deferReply();
        // Check member permissions
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            const nembed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${emojis.flag_remove} Sorry you don't have enough permissions!`)
            await interaction.editReply({ embeds: [nembed] })
            return
        };
        // Get interaction options
        const name = interaction.options.get('name')?.value;
        const description = interaction.options?.get('description')?.value;
        const reply = interaction.options?.get('reply')?.value;
        const intembed = interaction.options?.get('embed')?.value || false;
        const option_1 = interaction.options?.get('option_1')?.value;
        const option_2 = interaction.options?.get('option_2')?.value;
        const eph = interaction.options.getBoolean('ephemeral') || false;
        //Check if guild premium and interaction options 1 & 2
        const prime = require('../models/premium');
        const gprime = await prime.findOne({
            guild: interaction.guild.id
        });
        //Return if guild is not premium
        if (gprime?.guild !== interaction.guild.id) {
            if (option_1 || option_2) {
                const noprime = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${emojis.crown} Your guild is not premium!\n\nOnly premium guilds can have command options!`)
                    .setTitle(`${emojis.x} Error!`)
                await interaction.reply({ embeds: [noprime] });
                setTimeout(async () => {
                    await interaction.deleteReply();
                }, 3000);
                return
            }
        }

        if (!client.application?.owner) await client.application?.fetch();
        const data = {
            name: name.toString().toLowerCase().replace(/ /g,"-"),
            description: description.toString(),
        };
        let err = {
            errored: false,
            err: ""
        }
        let command
        try {
            command = await client.guilds.cache.get(interaction.guild.id)?.commands.create(data);
        } catch(e) {
            err.errored = true
            err.err = e.toString()
        }
        //Create id for easy use
        let theid = Math.floor(Math.random() * 5000);
        let testid;
        let i = false;
        for (; ;) {
            //Find it and make sure its not a duplicate
            testid = await slash.findOne({
                id: theid
            })
            if (theid !== testid?.id || testid?.id === 'null') {
                i = true
            } else {
                theid = Math.floor(Math.random() * 5000);
            }
            if (i === true) { break; }
        }
        const mfilter = m => m.author.id === interaction.user.id;
        const ifilter = (i) => i.user.id === interaction.user.id;
        //Log
        require('../log').log(`${interaction.user.tag} Created \`/${command.name}\` on guild: \`${interaction.guild}\``, 'command', interaction)
        //Create the command in the database
        let dBase = new slash({
            id: command.id,
            qid: theid,
            guild: interaction.guild.id,
            reply: reply,
            name: command.name,
            embed: intembed,
            eph: eph,
            uses: 0
        });
        await dBase.save().catch(e => console.log(e));
        //Log
        require('../log').log(`${interaction.user.tag} Created \`/${command.name}\` on guild: \`${interaction.guild}\``, 'command')
        //Send message
        const embed = new Discord.MessageEmbed()
            .setTitle(`${require('../emojis.json').check} Created`)
            .addField('ID:', `${theid} ||(${command.id})||`, true)
            .addField('Name:', command.name, true)
            .addField('Description:', command.description, true)
            .setColor(color)
            .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
        await interaction.editReply({ embeds: [embed], components: [] })
    }
}