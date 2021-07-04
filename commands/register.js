const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'register',
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
            },
            {
                name: 'option_1',
                type: 'STRING',
                description: 'What command options (Use {option_1} on reply)',
                required: false,
            },
            {
                name: 'option_2',
                type: 'STRING',
                description: 'What command options (Use {option_2} on reply)',
                required: false,
            }],
        };
        const prime = {
            name: 'create-code',
            description: 'Create a premium code!!',
            options: [{
                name: 'time',
                type: 'STRING',
                description: 'For how long?',
                required: true,
                choices: [
					{
						name: 'Lifetime',
						value: 'lifetime',
					},
					{
						name: 'Month',
						value: 'month',
					},
					{
						name: 'Year',
						value: 'year',
					},
				],
            }],
        };
        const command = await client.application?.commands.create(data);
        //const command = await client.guilds.cache.get('842575277249921074')?.commands.create(data);
        console.log(command);
    }
}
