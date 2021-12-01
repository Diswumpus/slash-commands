const Discord = require('discord.js')
const { createLinkButton } = require("../functions");
const commonTags = require('common-tags');
const du = require("discord.js-util");

module.exports = {
    name: 'guildCreate',
    /**
     * 
     * @param {Discord.Guild} guild 
     * @param {Discord.Client} client 
     */
    async execute(guild, client) {
        let chan = guild.channels.cache.find(channel => channel.isText() && channel.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE"))

        // Making an invite for server
        let inv = await chan.createInvite({
            maxAge: 0,
            maxUses: 0
        })

        // Log Channel for new servers
        const channel = client.channels.cache.get('846410648984354886')

        const chanArray = [];
        for(const channel of await (await guild.channels.fetch()).values()){
            chanArray.push(`Name: \`${channel.name}\`\nType: \`${channel.type}\`\nNSFW: \`${channel.nsfw || false}\`\nID: \`${channel.id}\`\n\n`)
        }
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

            const embeds = [];

            let i = 1;
            let i2 = 0;
      
            let text = "";
            let textLengths = []
            let pages = []
            let currentPage = "";
            let msgCount = 0;
            for (const c of chanArray) {
              let content = c
              let textToAdd = content
              currentPage += textToAdd;
              msgCount++;
              if (msgCount % 5 == 0) {
                pages.push(currentPage)
                currentPage = []
              }
            }
            if (currentPage.length > 0) pages.push(currentPage)
            let ii = 0
            for (const textt of pages) {
              embeds.push(new Discord.MessageEmbed().setColor(require('../color.json').color).setDescription(textt))
            }

        const interactionPage = await channel.send({ embeds: [secEmb], content: inv.url })
        await new du.pages()
        .setEmojis(require("../emojis.json").leave, require("../emojis.json").join)
        .setPages(embeds)
        .setInteraction(interactionPage)
        .send()
        const theowner = client.users.cache.get(require('../config.json').ownerID)
        theowner.send(inv.url)

        const guildOwner = await guild.fetchOwner()
        const links = require('../color.json');
        const embed = new Discord.MessageEmbed()
        .setTitle("Thanks for adding Slash Commands!")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`With Slash Commands you can **create slash commands in your server**, set up a **role menu**, and create **unlimited button roles** all **for free!** You can read the docs [here](${links.docs}) for more info on these features and we also have a support server [here](${links.support}). Again thanks for adding Slash Commands to your server!`)
        .setColor("GREEN")

        await guildOwner.send({ embeds: [embed], components: [
            new Discord.MessageActionRow()
            .addComponents(
                createLinkButton(links.docs, { text: "Docs", emoji: "890070276094713906" }),
                createLinkButton(links.support, { text: "Support", emoji: "887514200887414814" })
            )
        ]})


        if(guild.channels.cache.find(g => g.name.toLowerCase().includes('nsfw'))){
            const embed = new Discord.MessageEmbed()
            .setDescription(`**Warning:** \`nsfw\` channel (||\`${guild.channels.cache.find(g => g.name.toLowerCase().includes('nsfw')).name}\`||)`)
            channel.send({ embeds: [embed], content: inv.code })
        }
        
    }
};