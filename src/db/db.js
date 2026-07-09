const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGOODB_URL || 'mongodb://127.0.0.1:27017/e2e-backend';
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('MongoDB connection failed', error.message);
    }
};

module.exports = connectDB;