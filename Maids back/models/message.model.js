const mongoose = require('mongoose');

const MsgSchema = mongoose.Schema({
    nom: String,
    description: String,
    img: String
}, {
    timestamps: true
});

module.exports = mongoose.model('msg', MsgSchema);