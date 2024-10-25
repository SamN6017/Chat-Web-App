const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // To hash and compare passwords
const User = require('../db/user.model');

// Helper function to generate avatar URL based on gender and username
const generateAvatar = (username, gender) => {
    const baseAvatarURL = 'https://avatar.iran.liara.run/public/';
    const avatarType = gender === 'male' ? 'boy' : 'girl';
    return `${baseAvatarURL}${avatarType}?username=${username}`;
};

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password, gender } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate default avatar based on gender
        const profilepic = generateAvatar(username, gender);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            gender,
            profilepic
        });

        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Successful login
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Logout route (basic example)
router.post('/logout', (req, res) => {
    // Clear session or token logic can go here
    res.json({ message: 'User logged out successfully' });
});

module.exports = router;
