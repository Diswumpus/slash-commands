const Discord = require('discord.js');
const color = require('../color.json').color;
const { SlashCommandBuilder } = require('@discordjs/builders');
const emojis = require('../emojis.json');

module.exports = {
    name: 'help',
    c: "Commands",
    description: 'Shows a list of commands',
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription("Show's a list of commands")
        .addStringOption(option => {
            return option.setName('command_name')
                .setDescription('The name of the command')
                .setAutocomplete(true)
        }),
    /**
 * @param {Discord.AutocompleteInteraction} interaction
 * @param {Discord.Client} client 
 */
    async autocomplete(client, interaction) {
        /**
         * 
         * @param {""|"Commands"|"Server"|"ButtonRoles"} c 
         * @returns 
         */
        function getCategory(c) {
            if (c === "") {
                return "👀"
            } else if (c === "Commands") {
                return "⭐"
            } else if (c === "ButtonRoles") {
                return "👆"
            } else if (c === "Server") {
                return "⚙️"
            }
        }
        let options = [];
        for (const cmd of client.commands.values()) {
            if (!cmd) continue
            options.push({ name: `${getCategory(cmd.c)} ${standardizeText(cmd.name)}`, value: `${cmd.name}` })
        }
        const focused = interaction.options.getFocused();
        if (focused) {
            options = options.filter(e => {
                return e.value.includes(focused)
            })
        }
        if (options.length >= 24) options.length = 24
        if (options.length === 0) return
        await interaction.respond(options)//.catch(e => console.log(e));
    },
    async execute(client, interaction) {
        const cmddd = interaction.options.getString('command_name');
        if (!cmddd) {
            const commands = [];
            client.slashcmds.forEach(c => { commands.push(c) })
            let commandsList = {
                commands: ``,
                buttonRoles: ``,
                server: ``
            }

            let commandNames = {
                commands: `${emojis.slashCommand} Commands`,
                buttonRoles: `${emojis.discordon} Button Roles`,
                server: `${emojis.channel} Server`
            }

            const codeblock = (text) => {
                return "`" + text + "`" + "," + " "
            }
            for (const commandd of commands) {
                if(!commandd || typeof commandd?.name !== "string" || typeof commandd?.c !== "string") continue
                if (commandd.c.toLowerCase() === "commands") {
                    commandsList.commands += codeblock(commandd.name)
                } else if (commandd.c.toLowerCase() === "buttonroles") {
                    commandsList.buttonRoles += codeblock(commandd.name)
                } else if (commandd.c.toLowerCase() === "server") {
                    commandsList.server += codeblock(commandd.name)
                }
            }
            const sliceLast = (text) => {
                return text.slice(0, text.lastIndexOf(","));
            }
            commandsList.commands = sliceLast(commandsList.commands)
            commandsList.server = sliceLast(commandsList.server)
            commandsList.buttonRoles = sliceLast(commandsList.buttonRoles)
            const helpp = new Discord.MessageEmbed()
                .setTitle(`${require('../emojis.json').slashCommand} Slash (/) Commands`)
                .setFooter(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
                .setColor(color)
                .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
                .addField(commandNames.commands, commandsList.commands)
                .addField(commandNames.buttonRoles, commandsList.buttonRoles)
                .addField(commandNames.server, commandsList.server)
            await interaction.reply({ embeds: [helpp] });
        } else if (cmddd) {
            const commands = client.slashcmds;
            const cmd = commands.find(c => c.name === cmddd)
            const helpp = new Discord.MessageEmbed()
                .setFooter(`${client.user.username}`, client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
                .setColor(color)
                .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
                .setTitle(`${require('../emojis.json').slashCommand} ${cmd.c} › ${cmd.name}`)
                .setDescription(cmd.description)
                .addField(`${emojis.verifybadge} Usage`, `\`\`\`/${cmd.name} ${cmd.usage || " "}\`\`\``)
            if (!cmd) {
                const notfound = new Discord.MessageEmbed()
                    .setTitle(`${require('../emojis.json').xmark} Not found!`)
                    .setColor('RED')
                    .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
                return await interaction.reply({ embeds: [notfound] })
            }
            await interaction.reply({ embeds: [helpp] });
        }
    }
}