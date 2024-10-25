const express = require('express');
const router = express.Router();
const User = require('../db/user.model');
const authenticateToken = require('../middleware/authenticateToken'); // JWT middleware

// Route to get all users except the logged-in user
router.get('/users', authenticateToken, async (req, res) => {
    try {
        // Fetch all users except the one with the logged-in user ID
        const users = await User.find({ _id: { $ne: req.user.id } });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }

        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

module.exports = router;
