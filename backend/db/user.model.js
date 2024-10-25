const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    profilepic: { type: String },
}, { timestamps: true });

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
