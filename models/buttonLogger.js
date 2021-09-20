const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    guild: String,
    channel: String
});

const sModel = module.exports = mongoose.model('s-brLog', sSchema);