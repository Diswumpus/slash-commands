const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    userID: String,
    code: String,
    description: String,
    title: String,
    approved: Boolean,
    mID: String
});

const sModel = module.exports = mongoose.model('s-template', sSchema);