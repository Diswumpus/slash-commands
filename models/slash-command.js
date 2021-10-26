const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    id: String,
    qid: String,
    guild: String,
    reply: String,
    name: String,
    embed: Boolean,
    uses: Number,
    option1: String,
    option2: String,
    eph: Boolean,
    rows: [Object],
    buttonFn: String,
    buttonReply: String
});

const sModel = module.exports = mongoose.model('s-commands', sSchema);