const premium = require('./premium');
const Discord = require('discord.js');
const guild = require('../events/guild');

module.exports.hasPremium = async (guildId) => {
    const prime = await premium.findOne({
        guild: guildId
    });
    return !!prime?.enabled;
}
