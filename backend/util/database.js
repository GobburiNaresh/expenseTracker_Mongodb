const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection

function connectDB(){
    mongoose.connect(process.env.MONGOODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
    });

    const db = mongoose.connection;

    db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    });

    db.once('open', () => {
    console.log('Connected to MongoDB');
    });
}

module.exports = connectDB;