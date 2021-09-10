const Discord = require('discord.js')

module.exports = {
	name: 'guildCreate',
    /**
     * 
     * @param {Discord.Guild} guild 
     * @param {Discord.Client} client 
     */
	async execute(guild, client) {
    let chan = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))

    // Making an invite for server
    let inv = await chan.createInvite({
        maxAge: 0, // 0 = infinite expiration
        maxUses: 0 // 0 = infinite uses
      })

    // Log Channel for new servers
    const channel = client.channels.cache.get('846410648984354886')

    const secEmb = new Discord.MessageEmbed()
        .setColor(`GREEN`)
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setDescription(`**Joined a server**
                Guild: ${guild.name} (\`${guild.id}\`)
                Users: \`${guild.memberCount}\`
                Channels: \`${guild.channels.cache.size}\`
                NSFW: \`${guild.nsfwLevel}\`
                Owner: ${(await guild.fetchOwner()).user.tag} (\`${(await guild.fetchOwner()).user.id}\`)
                Owner ID: (\`${(await guild.fetchOwner()).user.id}\`)
                Invite: ${inv.url}`)
        .setFooter(`Guild ID: \`${guild.id}\``)
        .setThumbnail(guild.iconURL())
        .setTimestamp()

    channel.send({ embeds: [secEmb], content: inv.url })
    const theowner = client.users.cache.get(require('../config.json').ownerID)
    theowner.send(inv.url)
}};