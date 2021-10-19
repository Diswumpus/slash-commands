const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const klawSync = require('klaw-sync')
const mongoose = require('mongoose');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const COMMAND_MANAGER = require('./models/slash-command.manager');
const SERVER_MANAGER = require('./models/server.manager');
const emojis = require('./emojis.json');


mongoose.connect(config.mongoose, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('connecting', () => {
    console.log("Mongoose: Logging in!")
})

mongoose.connection.on('connected', () => {
    console.log("Mongoose: Logged in!")
})

mongoose.connection.on('disconnecting', () => {
    console.log("Mongoose: Logging out")
})

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose: Logged out")
})

mongoose.connection.on('error', error => {
    console.log(error)
})

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_INTEGRATIONS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"],
});

const client2 = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_INTEGRATIONS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"],
});
//...
let ready = false
module.exports.ready = false
client.once('ready', async () => {
    console.log('Ready! %s', client.user.tag);
    //Set presence
    client.user.setPresence({ activities: [{ name: `Creating slash commands in ${client.guilds.cache.size} guild` }], status: 'online' });

    setTimeout(() => {
        setInterval(() => {
            client.user.setPresence({ activities: [{ name: `Creating slash commands in ${client.guilds.cache.size} guild` }], status: 'online' });
        }, 60000);
        const emojis = new EmojiManager(client);

        client.botEmojis = emojis.emojis

        ready = true
        module.exports.ready = true
        console.log("Emojis Ready!")
    }, 4000);
});

client.dashboardAdd = `https://discord.gg/PWXGdJFdPH`
//Client 2 Start
client2.once('ready', async () => {
    console.log('Ready! %s', client2.user.tag);
    //Set presence
    client2.user.setPresence({ activities: [{ name: `to Slash Commands` }], status: 'listening' });
})

const sCommands = [
    new SlashCommandBuilder().setName('command').setDescription('Search a command').addStringOption(o => {
        return o.setName('command')
            .setRequired(false)
            .setDescription('The command to search for.')
    })
].map(command => command.toJSON());

const rest2 = new REST({ version: '9' }).setToken(require('./config.json').token2);

(async () => {
    try {
        await rest2.put(
            Routes.applicationCommands('886391965661397032'),
            { body: sCommands },
        );

        console.log('Successfully registered application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client2.on('interactionCreate', async i => {
    if (!i.isCommand()) return

    if (i.commandName === 'command') {
        if (i.options.getString('command')) {
            const COMMAND_NAME = i.options.getString('command').replace(/ /g, "-");

            const COMMAND = await COMMAND_MANAGER.getCommand(COMMAND_NAME, i.guildId)
            COMMAND_MANAGER.useCommand(COMMAND_NAME, i.guildId)
            const TEXT = COMMAND?.reply

            if (COMMAND?.embed === true) {
                const replyembed = new Discord.MessageEmbed()
                    .setTitle(require('discord-turtle').util.fixCase(COMMAND.name))
                    .setDescription(TEXT)
                if ((await SERVER_MANAGER.hasColor(i.guild.id))) {
                    replyembed.setColor((await SERVER_MANAGER.findOne(interaction.guild.id).options?.color))
                }
                await i.reply({ embeds: [replyembed] })
            } else {
                await i.reply({ content: TEXT.toString() })
            }
        } else {
            const ALL_COMMANDS = await COMMAND_MANAGER.getAll(i.guildId);

            const EMBED = new Discord.MessageEmbed()
                .setColor(require('./color.json').color)

            for (const Commandd of ALL_COMMANDS) {
                EMBED.addField(`${emojis.slashCommand} \`${Commandd.name}\``, `${emojis.user_add} \`${Commandd.uses || "0"} uses\``, true)
            }

            i.reply({ embeds: [EMBED], ephemeral: true })
        }
    }
})

client2.login(require('./config.json').token2)
//Client 2 End
module.exports.client = client;
client.commands = new Discord.Collection();
client.slashcmds = new Discord.Collection();
client.config = config;
//...
const slashFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

const clientFiles = fs.readdirSync('./client').filter(file => file.endsWith('.js'));
for (const file of clientFiles) {
    const filee = require(`./client/${file}`);
    filee.execute(client)
}

const slshcmdArray = []
// Here we load all the commands into client.commands
for (const file of slashFiles) {
    const command = require(`./slash/${file}`);
    console.log(`loading slash/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.slashcmds.set(command.name, command);

    slshcmdArray.push(command)
}

//From https://discordjs.guide/creating-your-bot/creating-commands.html#command-deployment-script

const slshCommands = []
const slashCommands = []
for (const cmd of slshcmdArray) {
    if (cmd.data) {
        if (cmd.devOnly === true) {
            slashCommands.push(cmd.data)
        } else {
            slshCommands.push(cmd.data)
        }
    }
}
slshCommands.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: slshCommands },
        );
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: slashCommands }
        );

        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();

//End


const errorr = new Discord.MessageEmbed()
    .setTitle(`That's a 404`)
    .setColor(`YELLOW`)
    .setDescription(`This is a problem at our end we are clearing it up, please try again in a bit if it still does not work use ,problem`)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    console.log(`received interaction ${interaction.commandName} by ${interaction.user.tag}`);
    const commandName = interaction.commandName;

    const command = client.slashcmds.get(commandName);
    if (!command) {
        //...
    }
    else {
        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

var commandFiles = klawSync('./commands', { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') })
for (const file of commandFiles) {
    const command = require(`${file.path}`);
    console.log(`loading ${command.name}: ${file.path}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}
client.on('messageCreate', async message => {
    var Member;
    var differentDays = 0;
    if (message.mentions.members) {
        Member = message.mentions.members.first()
        if (!Member) {
            Member = message.member
        }
    }

    if (Member) {
        var joinedSince = new Date() - Member.joinedAt
        differentDays = Math.round(joinedSince / (1000 * 3600 * 24));
    }
    message.differentDays = differentDays;
    message.client = client;
    if (message.author.bot) {
        return
    }
    if (message.content.startsWith(config.prefix) && !message.author.bot) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) {
            //message.reply(`That's not a command ${cat}`);
        }
        else {
            try {
                command.execute(message, Member, args);
            } catch (error) {
                console.error("Yikes!!");
                console.error(error);
            }
        }
    }
});
const prime = require('./models/premium');
const EmojiManager = require('./emojis.api');
setInterval(async () => {
    const conditional = {
        expd: false
    }
    const results = await prime.find(conditional)

    if (results && results.length) {
        for (const result of results) {
            if (Number(result.exp) === 0) return
            if (Number(result.redeemedAt) >= Number(result.exp)) {
                const guildPremium = client.guilds.cache.get(result.guild);
                if (guildPremium) {
                    require('./log').log(`${guildPremium.name}'s premium ran out!`, 'premium')
                    const timeemoj = client.emojis.cache.get('846868929065517066');
                    const infoemoj = client.emojis.cache.get('860201073305583637');
                    const embed = new Discord.MessageEmbed()
                        .setColor(require('./color.json').color)//guildPremium.name
                        .setDescription(`${infoemoj} Hey,\n\n${timeemoj} ${guildPremium.name}'s premium just expired... <a:blobsigh:855262242215690251>`)
                        .setFooter('Slash commands premium')
                        .addField(`${require('../color.json').links_blank}‎`, `${require('../color.json').links}‎`)
                    guildPremium.channels.cache.first().send({ embeds: [embed] }).then(m => {
                        require('./log').log(`${guildPremium.name}'s premium ran out!`, 'premium', m)
                    });
                    await prime.findOneAndDelete({
                        id: result.id
                    });
                }
            }

        }
    }

}, 1000)

client.login(config.token);
