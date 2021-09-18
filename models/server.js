const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    guild: String,
    options: {
        color: String
    }
});

const Model = module.exports = mongoose.model('server', Schema);