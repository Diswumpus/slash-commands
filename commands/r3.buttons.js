const Discord = require('discord.js');
const color = require('../color.json').color;

module.exports = {
    name: 'rb',
    description: 'Register a slash command!',
    async execute(message, Member, args) {
        const client = message.client
        if (!client.application?.owner) await client.application?.fetch();
        if(message.author.id !== require('../config.json').ownerID) return
        const prime = {
            name: 'create-button-roles',
            description: 'Create button roles!',
            options: [{
                name: 'style',
                type: 'STRING',
                description: 'The button style',
                required: false,
                choices: [
                    {
                        name: 'Red',
                        value: 'DANGER',
                    },
                    {
                        name: 'Blurple',
                        value: 'PRIMARY',
                    },
                    {
                        name: 'Grey',
                        value: 'SECONDARY',
                    },
                    {
                        name: 'Green',
                        value: 'SUCCESS'
                    },
                ],
            },
            {
                name: 'color',
                type: 'STRING',
                description: 'The embed color',
                required: false,
                choices: [
                    {
                        name: 'Black',
                        value: 'DEFAULT',
                    },
                    {
                        name: 'White',
                        value: 'WHITE',
                    },
                    {
                        name: 'Aqua',
                        value: 'AQUA',
                    },
                    {
                        name: 'Green',
                        value: 'GREEN'
                    },
                    {
                        name: 'Blue',
                        value: 'BLUE'
                    },
                    {
                        name: 'Yellow',
                        value: 'YELLOW'
                    },
                    {
                        name: 'Purple',
                        value: 'PURPLE'
                    },
                    {
                        name: 'Vivid Pink',
                        value: 'LUMINOUS_VIVID_PINK'
                    },
                    {
                        name: 'Fuchsia',
                        value: 'FUCHSIA'
                    },
                    {
                        name: 'Gold',
                        value: 'GOLD'
                    },
                    {
                        name: 'Orange',
                        value: 'ORANGE'
                    },
                    {
                        name: 'Red',
                        value: 'RED'
                    },
                    {
                        name: 'Grey',
                        value: 'GREY'
                    },
                    {
                        name: 'Darker Grey',
                        value: 'DARKER_GREY'
                    },
                    {
                        name: 'Navy',
                        value: 'NAVY'
                    },
                ],
            },
            {
                name: 'description',
                type: 'STRING',
                description: 'The embed description',
                required: false,
            }],
        };
        const command = await client.application?.commands.create(prime);
        await client.guilds.cache.get('842575277249921074')?.commands.create(prime);//const command = await client.guilds.cache.get('834199640702320650')?.commands.create(prime);
        console.log(command);
    }
}
