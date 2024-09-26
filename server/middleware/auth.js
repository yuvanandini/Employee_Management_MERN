const jwt = require('jsonwebtoken');

// Middleware for authentication
module.exports = function(req, res, next) {
    console.log('Incoming headers:', req.headers); // Log all incoming headers

    // Extract the token either from 'x-token' or 'Authorization' header
    let token = req.header('x-token') || req.header('Authorization')?.split(' ')[1];

    console.log('Token received:', token); // Log the token received
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ msg: 'No token provided' }); // Return a JSON response with an error message
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret
        req.user = decoded.user; // Store the user data from the token in the request
        console.log('Token verified. User:', req.user); // Log the decoded user

        next(); // Move on to the next middleware or route handler
    } catch (err) {
        console.error('Token verification error:', err.message); // Log the specific JWT error
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expired' });
        }
        return res.status(401).json({ msg: 'Invalid Token' });
    }
};
