const DBL = require('@top-gg/sdk');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const config = require('./config.json')
const webhook = new DBL.Webhook(config.DBL.auth);
const fetch = require('node-fetch');
const Discord = require('discord.js');
const port = config.port || 6000
const {
    WebhookClient
} = require('discord.js');
const webhookVote = new WebhookClient({ id: config.webhook_id, token: config.webhook_url, url: config.webhook});

/**
 * 
 * @param {Discord.Client} client 
 */
module.exports = async (client) => {
    app.get('/', (req, res) => {
        res.send('Currently Working.')
    })

    app.get('/dblwebhook', (req, res) => {
        res.send('Currently Working.')
    })

    app.post('/dblwebhook', webhook.listener(async (vote) => {
        const votedUser = await fetch(`https://discord.com/api/v8/users/${vote.user}`, {
            headers: {
                Authorization: `Bot ${config.token}`
            }
        }).then(res => res.json());


        console.log(`${votedUser.username} Just Voted!`);

        let userV = await User.findOne({
            id: vote.user
        });

        if (!userV) {
            await User.create({
                id: vote.user,
                votes: 1,
                lastVoted: Date.now()
            });

            userV = await User.findOne({
                id: vote.user
            });

        };

        const vote_number = userV.votes + 1 || 1;

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username}'s Voting System'`, `${client.user.displayAvatarURL()}`)
            .setColor('GREEN')
            .setTitle(`${votedUser.username} Just Voted`)
            .setDescription(`**${votedUser.username}#${votedUser.discriminator}** (${votedUser.id}) just voted **${client.user.username}**!`)
            .setFooter(`Vote #${vote_number}`)

        webhookVote.send({ embeds: [embed] });

        return await userV.updateOne({
            votes: vote_number,
            lastVoted: Date.now()
        });
    }));

    app.listen(port, () => {
        console.log(`Running Vote System on Port http://172.19.45.147:${port}/`);
    });
}