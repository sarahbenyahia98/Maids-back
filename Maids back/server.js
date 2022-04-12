require("dotenv").config()

const express = require ('express' )
const app = express()
const mongoose = require ("mongoose")
const path = require('path')

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})

const db = mongoose.connection

db.on ("error", (error) => console.error(error))
db.once('open',() => console.log("Connected to DB"))

app.use(express.json())

app.use('/upload',express.static(path.join(__dirname,'upload')))


const reportRoute = require('./controllers/report')
app.use('/report',reportRoute)
require('./routes/user.routes.js')(app);
require('./routes/job.routes.js')(app);
require('./routes/message.routes.js')(app);
app.listen(3000, () => console.log("Server Started"))

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
/////////////////swagger

// swagger definition
var swaggerDefinition = {
    info: {
        title: 'Home Maids Application',
        version: 'V1.0',
        description: 'Une application pour vous aidez à trouver une aide managére',
    },
    host: 'localhost:3000',
    basePath: '/',
};
// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./swager.yml'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

/////////////////fin swagger
