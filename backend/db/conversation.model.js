const mongoose = require('mongoose');

// Define the Conversation schema
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],  // Array of participants (Users) in the conversation
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: []
    }],
}, { timestamps: true });  // Adds createdAt and updatedAt fields

// Create and export the Conversation model
module.exports = mongoose.model('Conversation', conversationSchema);
