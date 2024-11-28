const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // #

require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
        console.log('MongoDB URI:', process.env.MONGODB_URI); 
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
