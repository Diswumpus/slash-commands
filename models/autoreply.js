const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    guildID: String,
    replys: Map
});

const sModel = module.exports = mongoose.model('s-autoreply', sSchema);