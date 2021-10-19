const Discord = require('discord.js');

class ban {
    constructor(){
        /**
         * @type {Discord.GuildMember}
         */
        this.member = null
    }

    /**
     * @param {Discord.GuildMember} member 
     * @returns {ban}
     */
    setMember(member){
        this.member = member
        return this;
    }

    /**
     * @param {Discord.CommandInteraction} interaction 
     */
    async executeCommand(interaction){
        try {
            const banned = await this.member.ban({ reason: `Slash Command Executed. (Ban Function)`});
            return banned
        } catch(e){
            interaction.editReply({ content: `There was an error banning the member!\n\n\`\`\`xl\n${e}\n\`\`\`` })
            return e;
        }
    }
}

module.exports = ban;