const User = require('../models/message.model.js');

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var nodemailer = require('nodemailer');
const Nexmo = require('nexmo');
const saltRounds = 10;
// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request
    if(!req.body.nom) {
        return res.status(400).send({
            message: "job content can not be empty"
        });
    }
  
    // Create a Note
    let newuser = new User({
       
    nom: req.body.nom,
    description: req.body.description,
    img: req.body.img

        
    });
 // Save Note in the database
 newuser.save()
 .then(data => {
     res.send(data);
 }).catch(err => {
     res.status(500).send({
         message: err.message || "Some error occurred while creating the user."
     });
 });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    User.findById(req.params.jobId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.msgId
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.msgId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.msgId
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.nom) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
  
    
    // Find note and update it with the request body
    User.findByIdAndUpdate(req.params.jobId, {
          
        nom: req.body.nom,
        description: req.body.description,
        img: req.body.img
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.jobId
            });
        }
        res.send(note);
        
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.jobId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.jobId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.jobId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.msgId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.msgId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.msgId
        });
    });
};