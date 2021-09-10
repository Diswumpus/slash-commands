const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const klawSync = require('klaw-sync')
const mongoose = require('mongoose');


mongoose.connect(config.mongoose, { useNewUrlParser: true, useUnifiedTopology: true })

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_INTEGRATIONS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"],
});
//...
client.once('ready', async () => {
    console.log('Ready! %s', client.user.tag);
    //Set presence
    client.user.setPresence({ activities: [{ name: `Creating slash commands in ${client.guilds.cache.size} guild` }], status: 'online' });
});
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
// Here we load all the commands into client.commands
for (const file of slashFiles) {
    const command = require(`./slash/${file}`);
    console.log(`loading slash/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.slashcmds.set(command.name, command);
}
const errorr = new Discord.MessageEmbed()
    .setTitle(`That's a 404`)
    .setColor(`YELLOW`)
    .setDescription(`This is a problem at our end we are clearing it up, please try again in a bit if it still does not work use ,problem`)
    .setImage(`https://cdn.tixte.com/uploads/turtlepaw.is-from.space/kow11oq1p9a.png`)
client.on('interaction', async interaction => {
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

client.on("message", message => {
    const args = message.content.split(" ").slice(1);
    const clean = text => {
        if (typeof (text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
    if (message.content.startsWith(config.prefix + "eval")) {
        if (message.author.id !== config.ownerID) return;
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled), { code: "xl" });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
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
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
client.on('message', async message => {
    const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}>`);
    if (message.content.match(mentionRegex)) {
        let currentPrefix = config.prefix;
        message.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`Hey there!`)
                .setDescription(`My prefix is \`${config.prefix}\``)
                .setColor('BLUE')]
        })
    }
});
client.on('message', async message => {
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
setInterval(async () => {
    const conditional = {
        expd: false
    }
    const results = await prime.find(conditional)

    if (results && results.length) {
        for (const result of results) {
            if(Number(result.exp) === 0) return
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
