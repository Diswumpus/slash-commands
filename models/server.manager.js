const Discord = require('discord.js');
const Server = require('./server');

module.exports.findOne = async (guildId) => {
    const res = await Server.findOne({
        guild: guildId
    });
    return res;
}

module.exports.hasColor = async (guildId) => {
    return !!(await this.findOne(guildId).options?.color)
}