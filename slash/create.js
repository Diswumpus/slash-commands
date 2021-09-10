const Discord = require("discord.js");
const slash = require('../models/slash-command');
const color = require('../color.json').color;
const interactions = require('../interaction').get;
const wait = require('util').promisify(setTimeout);
const emojis = require('../emojis.json');

module.exports = {
    name: "create",
    description: "Remove your data!",
    async execute(client, interaction) {
        //Defer Command
        const m2 = await interaction.defer();
        // Check member permissions
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            const nembed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`${emojis.flag_remove} Sorry you don't have enough permissions!`)
            await interaction.editReply({ embeds: [nembed] })
            return
        };
        // Get interaction options
        const name = interaction.options?.find(c => c?.name === 'name')?.value;
        const description = interaction.options?.find(c => c?.name === 'description')?.value;
        const reply = interaction.options?.find(c => c?.name === 'reply')?.value;
        const intembed = interaction.options?.find(c => c?.name === 'embed')?.value || false;
        const option_1 = interaction.options?.find(c => c?.name === 'option_1')?.value;
        const option_2 = interaction.options?.find(c => c?.name === 'option_2')?.value;
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
        let data;
        if (!option_1 || !option_2) {
            data = {
                name: name.toLowerCase(),
                description: description,
            };
        } else if (option_1) {
            data = {
                name: name.toLowerCase(),
                description: description,
                options: [{
                    name: option_1,
                    type: 'STRING',
                    description: option_1,
                    required: true,
                }],
            };
        } else if (option_2) {
            data = {
                name: name.toLowerCase(),
                description: description,
                options: [{
                    name: option_2,
                    type: 'STRING',
                    description: option_2,
                    required: true,
                }],
            };
        } else if (option_1 && option_2) {
            data = {
                name: name.toLowerCase(),
                description: description,
                options: [{
                    name: option_1,
                    type: 'STRING',
                    description: option_1,
                    required: true,
                },
                {
                    name: option_2,
                    type: 'STRING',
                    description: option_2,
                    required: true,
                }],
            };
        }
        const command = await client.guilds.cache.get(interaction.guild.id)?.commands.create(data);
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
            option1: option_1,
            option2: option_2
        });
        await dBase.save().catch(e => console.log(e));
        //Log
        require('../log').log(`${interaction.user.tag} Created \`/${command.name}\` on guild: \`${interaction.guild}\``, 'command')
        //Send message
        const embed = new Discord.MessageEmbed()
            .setTitle(`${require('../emojis.json').check} Created`)
            .addField('ID:', `${theid} ||( ${command.id} )||`, true)
            .addField('Name:', command.name, true)
            .addField('Description:', command.description, true)
            .setColor(color)
            .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
        await interaction.editReply({ embeds: [embed], components: [] })
    }
}