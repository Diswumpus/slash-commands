const Discord = require('discord.js');

module.exports = {
    name: 'registerr',
    description: 'Register a slash command!',
    async execute(message, Member, args) {
        const client = message.client
        if (!client.application?.owner) await client.application?.fetch();
        //https://discord.com/oauth2/authorize?client_id=841782635386109972&scope=bot+applications.commands
        const data = {
            name: 'create',
            description: 'Create a slash command!',
            options: [{
                name: 'name',
                type: 'STRING',
                description: 'The name of the slash command',
                required: true,
            },
            {
                name: 'description',
                type: 'STRING',
                description: 'The description of the slash command',
                required: true,
            },
            {
                name: 'reply',
                type: 'STRING',
                description: 'The reply of the slash command',
                required: true,
            },
            {
                name: 'embed',
                type: 'BOOLEAN',
                description: 'Should the reply be an embed?',
                required: false,
            }],
        };
        const deldata = {
            name: 'delete',
            description: 'Delete a slash command',
            options: [{
                name: 'id',
                type: 'STRING',
                description: 'The id of the slash command ( example: 2014 or 859935442472009768)',
                required: true,
            }],
        };
        const command = await client.application?.commands.create(deldata);
        //const command = await client.guilds.cache.get('842575277249921074')?.commands.create(deldata);
        console.log(command);
    }
}
