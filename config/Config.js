module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    URL: process.env.BASE_URL || 'http://localhost:3000',
    MONGODB_URI: process.env.MONGODB_URI ||
    'mongodb+srv://Heba_123:Heba_123@cluster0.r6mmeb8.mongodb.net/patientsapp?retryWrites=true&w=majority'
}