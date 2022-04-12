module.exports = (app) => {
    const user = require('../controllers/job.controller.js');

    // Create a new Note
    app.post('/createjob', user.create);
 
    // Retrieve all Notes
    app.get('/alljobs', user.findAll);

    // Retrieve a single Note with noteId
    app.get('/getjob/:jobId', user.findOne);

    // Update a Note with noteId
    app.put('/updatejob/:jobId', user.update);

    // Delete a Note with noteId
    app.delete('/deletejob/:jobId', user.delete);

    
}