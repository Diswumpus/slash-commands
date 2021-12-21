const Discord = require("discord.js");
const { WebhookClient, Channel } = Discord;

module.exports = class WebhookBuilder {
    constructor(){
        /**
         * The name of the webhook.
         * @type {String}
         */
        this.name = null;

        /**
         * The avatar of the webhook. Must start with `https` or `http`.
         * @type {String}
         */
        this.avatar = null;

        /**
         * The channel to create the webhook in.
         * @type {Discord.Channel}
         */
        this.channel = null;

        /**
         * The current webhook created. Used for fetching the webhook.
         * @type {Discord.Webhook}
         */
        this.webhook = null;
    }

    /**
     * Sets the name of the webhook.
     * @param {String} name 
     * @returns {WebhookBuilder}
     */
    setName(name){
        this.name = name
        return this;
    }

    /**
     * Sets the avatar of the webhook.
     * @param {String} avatar 
     * @returns {WebhookBuilder}
     */
    setAvatar(avatar){
        this.avatar = avatar
        return this;
    }

    /**
     * Sets the channel of the webhook.
     * @param {String} channel 
     * @returns {WebhookBuilder}
     */
    setChannel(channel){
        this.channel = channel
        return this;
    }

    /**
     * Creates the webhook and then sends the payload.
     * *Tip: This is an application-owned webhook so it can send components!*
     * @param {String|Discord.MessagePayload|Discord.WebhookMessageOptions} name 
     * @returns {WebhookBuilder}
     */
    async CreateAndSend(payload, reason){
        /**
         * @type {Discord.TextChannel} //For easy access to options.
         */
        const channel = this.channel;

        const webhook = this.webhook = await channel.createWebhook(this.name, {
            avatar: this.avatar,
            reason: reason || "No reason."
        })

        return await webhook.send(payload);
    }

    /**
     * Fetches the current webhook.
     * @returns {Discord.Webhook}
     */
    fetchWebhook(){
        return this.webhook;
    }
};