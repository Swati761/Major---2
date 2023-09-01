const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    passphrase: {
        type: String,
        trim: true
    },
    pubKey: {
        type: String,
        trim: true
    },
    pvtKey: {
        type: String,
        trim: true
    },
    adminUsername: {
        type: String,
        trim: true,
    },
    memberUsernames: {
        type: [String],
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: String,
    }
}, { timestamps: true });


module.exports = groupSchema;