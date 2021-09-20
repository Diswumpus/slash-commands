const Discord = require('discord.js');
const logModel = require('./models/buttonLogger');
const emojis = require('./emojis.json');

const loggerOptions = {
    message: Discord.Message,
    member: Discord.GuildMember,
    role: Discord.Role
}
class logger {
    /**
     * @param {loggerOptions} options 
     */
    constructor(options) {

        /**
         * The member who got the role.
         * @type {Discord.GuildMember}
         */
        this.member = options.member

        /**
         * The role the member got.
         * @type {Discord.Role}
         */
        this.role = options.role

        /**
         * The message for the button role.
         * @type {Discord.Message}
         */
        this.message = options.message

        /**
         * The channel the button role is in.
         * @type {Discord.Channel}
         */
        this.channel = this.message.channel
        /**
         * The guild.
         * @type {Discord.Guild}
         */
        this.guild = this.message.guild

        /**
         * The guilds log channel.
         * @type {Discord.TextChannel}
         */
        this.logChannel;
        this.logChannelData;
    }

    /**
     * Get the guilds log channel.
     * @param {Discord.Client} client 
     * @returns Promise<MongooseData>
     */
    async getChannel(client) {
        this.logChannelData = await logModel.findOne({
            guild: this.guild.id
        })
        this.logChannel = client.channels.cache.get(this.logChannelData.channel)
        return this.logChannel;
    }

    /**
     * Log it!
     * @param {Discord.Client} client 
     * @param {"ADD" | "REMOVE"} type
     * @returns Promise<Void>
     */
    async log(client, type) {
        await this.getChannel(client)

        const embed = new Discord.MessageEmbed()
            .setAuthor(this.member.user.tag, this.member.user.displayAvatarURL())
            .setTitle(`${emojis.role} Role ${type === "ADD" ? "Added" : "Removed"}`)
            .addField(`**Role ${type === "ADD" ? "Added" : "Removed"}:**`, `**${this.role}** ||(${this.role.id})||`)
            .addField(`**Member:**`, `**${this.member.user.username}** ||(${this.member.user.id}})||`)
            .addField(`**Channel:**`, `**${this.channel}** ||(${this.channel.id})||`)
            .addField(`**Message:**`, `**[\`Link\`](${this.message.url})** ||(${this.message.id})||`)
            .setColor(`${type === "ADD" ? "GREEN" : "RED"}`)
            .setTimestamp()

        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setStyle("LINK")
                    .setLabel("Jump to Message")
                    .setEmoji(emojis.join)
                    .setURL(this.message.url)
            )

        await this.logChannel.send({ embeds: [embed], components: [row] });
    }
}

module.exports = logger

/**
 * Add a log channel.
 * @param {Discord.Channel} channel 
 */
module.exports.addChannel = async (channel) => {
    await new logModel({
        guild: channel.guild.id,
        channel: channel.id
    }).save().catch(e => console.log(e))
}

/**
 * Delete a log channel.
 * @param {Discord.Channel} channel 
 */
module.exports.deleteChannel = async (channel) => {
    logModel.findOneAndDelete({
        guild: channel.guild.id,
        channel: channel.id
    })
}

/**
 * Delete a log channel.
 * @param {Discord.Channel} channel 
 */
module.exports.getChannel = async (guildId) => {
    return await logModel.findOne({
        guild: guildId
    })
}