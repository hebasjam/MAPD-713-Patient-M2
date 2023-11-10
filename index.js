/**
 Milestone Project for MAPD-713 - M2
 Heba - 301357388
 Tareq - 301411225
 */

const restify = require('restify')
const mongoose = require('mongoose')
const config = require('./config/Config')
const apiRouter = require("./routes/PatientsRouter");


const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());
server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true});
});

const db = mongoose.connection;
db.on('error', (err) => console.log(err));
db.once('open', () => {
    apiRouter(server);
    console.log(`server started on port ${config.PORT}`)
})

