const express = require('express');
const router = express.Router();
const Message = require('../db/message.model');
const Conversation = require('../db/conversation.model');
const User = require('../db/user.model');

// Send a new message
router.post('/send', async (req, res) => {

    const { senderId, recipientId, content } = req.body;
    console.log(content);
    try {
        // Check if both sender and recipient exist
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);
        if (!sender || !recipient) {
            return res.status(400).json({ message: 'Invalid sender or recipient' });
        }

        // Create a new message
        const newMessage = new Message({
            sender: senderId,
            recipient: recipientId,
            content
        });

        // Save the message to the database
        await newMessage.save();

        // Find or create a conversation between the sender and recipient
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        if (!conversation) {
            // Create a new conversation if it doesn't exist
            conversation = new Conversation({
                participants: [senderId, recipientId],
                messages: [newMessage._id]
            });
        } else {
            // Add the new message to the conversation
            conversation.messages.push(newMessage._id);
        }

        // Update lastMessageAt
        conversation.lastMessageAt = new Date();

        // Save the conversation
        await conversation.save();

        res.status(201).json({ message: 'Message sent successfully', messageData: newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
});

// Get all messages in a conversation
router.get('/conversation/:conversationId', async (req, res) => {
    const { conversationId } = req.params;

    try {
        // Find the conversation and populate the messages and participants
        const conversation = await Conversation.findById(conversationId)
            .populate('messages')
            .populate('participants', 'username email profilepic');

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving conversation', error });
    }
});

// Get all conversations for a user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find all conversations where the user is a participant
        const conversations = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'username email profilepic')
            .sort({ lastMessageAt: -1 });  // Sort by the latest message

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving conversations', error });
    }
});

module.exports = router;
