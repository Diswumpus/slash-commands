const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    guildID: String,
    roles: Map
});

const sModel = module.exports = mongoose.model('s-menu', sSchema);