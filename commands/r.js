const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'registerr',
    description: 'Register a slash command!',
    async execute(message, Member, args) {
        const client = message.client
        if (!client.application?.owner) await client.application?.fetch();
        const prime = {
            name: 'edit',
            description: 'Edits a command',
            options: [{
                name: 'command_id',
                type: 'STRING',
                description: 'What command? (ex. 1038)',
                required: true,
            },
            {
                name: 'reply',
                type: 'STRING',
                description: 'The reply of the command you want to change',
                required: false,
            },
            {
                name: 'embed',
                type: 'BOOLEAN',
                description: 'Should the reply be an embed?',
                required: false,
            }],
        };
        const command = await client.application?.commands.create(prime);
        //const command = await client.guilds.cache.get('834199640702320650')?.commands.create(prime);
        console.log(command);
    }
}
