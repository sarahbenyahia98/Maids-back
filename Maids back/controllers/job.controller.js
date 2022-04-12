const Job = require('../models/job.model.js');

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var nodemailer = require('nodemailer');
const Nexmo = require('nexmo');
const saltRounds = 10;
// Create and Save a new Note
exports.create = (req, res) => {
   
  
    // Create a Note
    let newJob =   new Job({
       
    ...req.body
   

        
    });
 // Save Note in the database
 newJob.save()
 .then(data => {
     res.json({data:data});
 }).catch(err => {
     res.status(500).send({
         message: err.message || "Some error occurred while creating the user."
     });
 });
};

// Retrieve and return all notes from the database.
exports.findAll = async (req, res) => {
   
    Job.find()
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
    Job.findById(req.params.jobId)
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
            message: "Error retrieving note with id " + req.params.jobId
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
    Job.findByIdAndUpdate(req.params.jobId, {
          
    nom: req.body.nom,
    description: req.body.description,
    price: req.body.price,
    time: req.body.time,
    idClient:req.body.idClient,
    idto:req.body.idto
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
    Job.findByIdAndRemove(req.params.jobId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.jobId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.jobId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.jobId
        });
    });
};