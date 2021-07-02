const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    guild: String,
    id: String,
    enabled: String,
    exp: String,
    expd: Boolean,
    redeemedAt: String,
    plan: String
});

const sModel = module.exports = mongoose.model('s-premium', sSchema);