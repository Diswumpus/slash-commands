const mongoose = require('mongoose');

const sSchema = new mongoose.Schema({
    guild: String,
    id: String,
    roles: {
        r1: String,
        r2: String,
        r3: String,
        r4: String,
        r5: String,
        r6: String,
        r7: String,
        r8: String
    },
    button_ID: {
        r1: String,
        r2: String,
        r3: String,
        r4: String,
        r5: String,
        r6: String,
        r7: String,
        r8: String
    },
    messageID: String,
});

const sModel = module.exports = mongoose.model('s-br', sSchema);