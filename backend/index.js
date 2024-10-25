const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authroutes = require('./routes/auth.js')
const messageRoutes = require('./routes/messages');

// Create an instance of an Express app
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Set the port number for the server
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use('/auth', authroutes);
app.use('/message', messageRoutes);

// Sample route for the homepage
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
