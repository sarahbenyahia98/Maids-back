const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job'
        },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        }]
});

module.exports = mongoose.model('Report', reportSchema);