/**
 Milestone Project for MAPD-713 - M2
 Heba - 301357388
 Tareq - 301411225
 */


const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config/Config');
const apiRouter = require('./routes/PatientsRouter');

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// Improved MongoDB Connection Handling
// Removed deprecated options useNewUrlParser and useUnifiedTopology
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(config.PORT, () => {
            console.log(`Server started on port ${config.PORT}`);
            apiRouter(server); // Initialize API routes
        });
    })
    .catch(err => {
        console.error('Database connection failed', err);
        process.exit(1); // Exit if unable to connect to the database
    });

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));