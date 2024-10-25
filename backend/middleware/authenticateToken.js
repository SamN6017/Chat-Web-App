const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token and get the user ID
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded;  // Attach the user data to the request
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
