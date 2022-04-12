module.exports = (app) => {
    const msg = require('../controllers/message.controller.js');

    // Create a new Note
    app.post('/createMsg', msg.create);
 
    // Retrieve all Notes
    app.get('/allMsgs', msg.findAll);

    // Retrieve a single Note with noteId
    app.get('/getMsg/:msgId', msg.findOne);

    // Update a Note with noteId
    app.put('/updateMsg/:msgId', msg.update);

    // Delete a Note with noteId
    app.delete('/deleteMsg/:msgId', msg.delete);

    
}