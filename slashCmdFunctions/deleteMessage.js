const Discord = require('discord.js');

class deleteMessage {
    constructor(){
        /**
         * @type {Discord.Message}
         */
        this.message = null
    }

    /**
     * @param {Discord.Message} message 
     * @returns {ban}
     */
    setMessage(message){
        this.message = message
        return this;
    }

    /**
     * @param {Discord.CommandInteraction} interaction 
     */
    async executeCommand(interaction){
        try {
            const deleted = await this.message.delete();
            return deleted
        } catch(e){
            interaction.editReply({ content: `There was an error deleting the message!\n\n\`\`\`xl\n${e}\n\`\`\`` })
            return e;
        }
    }
}

module.exports = deleteMessage;