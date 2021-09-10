const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'registerr',
    description: 'Register a slash command!',
    async execute(message, Member, args) {
        const client = message.client
        if (!client.application?.owner) await client.application?.fetch();
        if(message.author.id !== require('../config.json').ownerID) return
        const prime = {
            name: 'eval',
            description: 'Eval some code',
            options: [{
                name: 'code',
                type: 'STRING',
                description: 'The code to eval',
                required: true,
            }],
        };
        //const command = await client.application?.commands.create(prime);
        const command = await client.guilds.cache.get('842575277249921074')?.commands.create(prime);
        console.log(command);
    }
}
