const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    id: String,
    qid: String,
    guild: String,
    reply: String,
    name: String,
    embed: Boolean
});

const sModel = module.exports = mongoose.model('s-commands', sSchema);