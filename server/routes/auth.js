const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).send('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(200).send('Registered Successfully');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Log the incoming request for debugging
        console.log('Login request received', { email, password });

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found'); // Log if the user does not exist
            return res.status(400).send('User not found');
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid credentials'); // Log if password doesn't match
            return res.status(400).send('Invalid credentials');
        }

        // Generate the JWT token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Log the generated token for debugging
        console.log('Token generated:', token);

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error.message); // Log the error message
        res.status(500).send('Server Error');
    }
});


module.exports = router;
