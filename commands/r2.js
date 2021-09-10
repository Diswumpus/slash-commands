const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'registerrr',
    description: 'Register a slash command!',
    async execute(message, Member, args) {
        const client = message.client
        if (!client.application?.owner) await client.application?.fetch();
        if(message.author.id !== require('../config.json').ownerID) return
        const prime = {
            name: 'list',
            description: 'Lists the guilds commands',
            options: [{
                name: 'ephemeral',
                type: 'BOOLEAN',
                description: 'Make it so only you can see the message',
                required: false,
            },
            {
                name: 'global',
                type: 'BOOLEAN',
                description: 'See every command',
                required: false,
            }],
        };
        const command = await client.application?.commands.create(prime);
        await client.guilds.cache.get('842575277249921074')?.commands.create(prime);//const command = await client.guilds.cache.get('834199640702320650')?.commands.create(prime);
        console.log(command);
    }
}
