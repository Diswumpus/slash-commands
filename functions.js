const Discord = require("discord.js");
const color = require("./color.json").color;
const emojis = require('./emojis.json');
const prime = require('./models/premium');

/**
 * Checks if a member has a permission if they don't the bot will reply/edit to the interaction.
 * @param {Discord.PermissionString} permission 
 * @param {Discord.CommandInteraction} interaction 
 */
module.exports.checkPermissions = async (permission, interaction, customEmbed) => {
    const hasPerms = interaction.member.permissions.has(permission);

    const embed = customEmbed || new Discord.MessageEmbed()
        .setColor(color)
        .setDescription(`${emojis.flag_remove} Sorry you don't have enough permissions!`)
    if (!hasPerms) {
        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}

module.exports.createEmbedFromText = (text) => {
    return new Discord.MessageEmbed()
        .setDescription(text)
        .setColor(color)
}

/**
 * Creates a link button.
 * @param {String} link 
 * @param {Object} options 
 * @param {String} [options.text]
 * @param {String} [options.emoji]
 */
module.exports.createLinkButton = (link, options) => {
    return new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel(options.text)
    .setEmoji(options.emoji)
    .setURL(link)
}
module.exports.counter = class Counter {
    constructor() {
        /**
         * The count on the counter.
         * @type {Number}
         * @readonly
         */
        this.count = 0;

        /**
         * The max count on the counter.
         * @type {Number}
         */
        this.maxCount = 0;

        /**
         * The emoji for the button.
         * @type {String}
         */
        this.emoji = null;
    }

    /**
     * Sets the emoji for the button.
     * @param {String} emoji 
     * @returns {Counter}
     */
    setEmoji(emoji) {
        if (!emoji) throw new TypeError(`emoji is a required arg.`)
        if (typeof emoji !== "string") throw new TypeError(`emoji must be a number.`)

        this.emoji = emoji
        return emoji;
    }

    /**
     * Sets the max count on the counter.
     * @param {Number} count 
     * @returns {Counter}
     */
    setMaxCount(count) {
        if (!count) throw new TypeError(`count is a required arg.`)
        if (typeof count !== "number") throw new TypeError(`count must be a number.`)

        this.maxCount = count
        return this;
    }

    /**
     * Creates the buttons for the counter.
     * @returns {Discord.MessageButton}
     */
    createButtons() {
        return new Discord.MessageButton()
            .setCustomId("count-do-not-touch")
            .setDisabled(true)
            .setEmoji(this.emoji)
            .setLabel(`${this.count}/${this.maxCount}`)
            .setStyle("SECONDARY");
    }

    /**
     * Adds numbers to the counter and updates button.
     * @param {Discord.Message} message
     */
    async addCount(message) {
        if (!message) throw new TypeError(`message is a required arg.`)

        this.count++

        await message.edit({ components: [new Discord.MessageActionRow().addComponents(this.createButtons())] });
    }
}

/**
 * Creates a premium code.
 * @param {"month" | "year" | "lifetime"} time 
 */
module.exports.createPremiumCode = async (time) => {
    let expiresAt;
    let code;
    let done = false;

    const plans = ["month", "year", "lifetime"]
    //Get code gen package
    const voucher_codes = require('voucher-code-generator');
    //Create a code with for loop
    for (; ;) {
      const codePremium = voucher_codes.generate({
        pattern: "####-####-####",
      });

      code = codePremium.toString().toUpperCase();
      let codefind = prime.findOne({
        id: code
      });
      //Check if its not in database
      if (!codefind.id || codefind.id === 'null') done = true
      //Break if done is true
      if (done === true) break;
    }
    //Get expAt
    if (time === "month") {
      expiresAt = Date.now() + 2592000000;
    } else if (time === "year") {
      expiresAt = Date.now() + (2592000000 * 12);
    } else if (time === "min") {
      expiresAt = Date.now() + 1000
    } else if (time === 'lifetime') {
      expiresAt = 0
    }
    //Save prime code
    let codeSave = new prime({
      guild: null,
      id: code,
      exp: expiresAt,
      plan: time
    });
    codeSave.save().catch(e => console.log(e));

    return {
        expiresAt: expiresAt,
        code: code,
        plan: plans[time],
        time: time,
        guild: null
    }
}

module.exports.activatePremium = async (id, guildID, event) => {
    //Check if there is one
    let findone = await prime.findOne({
        id: id
    })
    //If there is no prime code
    if (!findone || findone.guild) {
        return { res: null, err: "Not found" }
    }
    //Delete code data...
    await prime.findOneAndDelete({
        id: id
    });
    //Get time
    let time = findone.plan;
    let expiresAt;
    if (time === "month") {
        expiresAt = Date.now() + 2592000000;
    } else if (time === "year") {
        expiresAt = Date.now() + (2592000000 * 12);
    } else if (time === "min") {
        expiresAt = Date.now() + 1000
    } else if (time === 'lifetime') {
        expiresAt = 0
    }
    //Save file
    let newSave = new prime({
        guild: guildID,
        id: id,
        enabled: true,
        exp: expiresAt,
        expd: false,
        redeemedAt: Date.now()
    });
    await newSave.save().catch(e => console.log(e));
    //Log
    require('../log').log(`${interaction.user.tag} enabled premium on guild: \`${interaction.guild}\`${event ? ` ${event}` : ""}`, 'premium')

    return { res: newSave, err: null }
}

/**
 * 
 * @param {Discord.MessageActionRow} row 
 */
module.exports.disableButtons = (row) => {
    for(const button of row.components){
        button.setDisabled(true)
    }
    return row;
}