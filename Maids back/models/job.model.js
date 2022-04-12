const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    price:Number,
    description:String
}, {
    timestamps: true
});

module.exports = mongoose.model('job', JobSchema);