const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    guild: String,
    options: {
        color: String
    }
});

const sModel = module.exports = mongoose.model('s-server', sSchema);