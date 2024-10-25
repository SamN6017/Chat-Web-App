const mongoose = require('mongoose');

// Define the Message schema
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },  // Refers to the User who sends the message
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },  // Refers to the User who receives the message
    content: {
        type: String,
        required: true
    },  // Actual message text
}, { timestamps: true });  // Adds createdAt and updatedAt fields

// Create and export the Message model
module.exports = mongoose.model('Message', messageSchema);
