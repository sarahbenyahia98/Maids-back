const { string } = require('assert-plus');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    phone:{
        type:String,
        unique :true
    },
    address:String,
    job:String,
    urlImg:String
}, {
    timestamps: true
});

module.exports = mongoose.model('user', UserSchema);