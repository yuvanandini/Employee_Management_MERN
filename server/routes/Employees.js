const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const Employee = require('../models/Employee');
const middleware = require('../middleware/auth');
const mongoose = require('mongoose');

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
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Employee creation route
router.post('/', middleware, async (req, res) => {
    console.log('Incoming request body:', req.body);
    console.log('Incoming headers:', req.headers);

    try {
        const { name, email, mobile, designation, courses, gender } = req.body;

        if (!name || !email || !mobile || !designation || !courses || !gender) {
            return res.status(400).json({ msg: 'Please fill all fields' });
        }

        let existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ msg: 'Employee with this email already exists' });
        }

        const newEmployee = new Employee({
            name,
            email,
            mobile,
            designation,
            courses: courses.split(','), // Split into an array
            gender
        });

        await newEmployee.save();
        res.status(201).json({ msg: 'Employee created successfully' });
    } catch (err) {
        console.error('Error creating employee:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

// Get all employees route
router.get('/', middleware, async (req, res) => {
    console.log('Request received to get all employees');
    try {
        const employees = await Employee.find();
        console.log('Employees retrieved:', employees);
        res.json(employees);
    } catch (err) {
        console.error('Error retrieving employees:', err.message);
        res.status(500).send('Server Error');
    }
});


// Get employee by ID
router.get('/:id', middleware, async (req, res) => {
    const { id } = req.params; // Extract the ID from the URL
    console.log('Fetching employee with ID:', id);

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ID format:', id);
        return res.status(400).send('Invalid ID format');
    }

    try {
        // Query MongoDB for the employee with the given ID using findById
        const employee = await Employee.findById(id); // Mongoose automatically converts string to ObjectId

        if (!employee) {
            console.log('Employee not found for ID:', id);
            return res.status(404).send('Employee not found');
        }

        console.log('Employee found:', employee); // Log the employee details
        res.json(employee); // Send the employee data as JSON response
    } catch (err) {
        console.error('Error fetching employee:', err.message); // Log any error encountered
        res.status(500).send('Server Error');
    }
});


module.exports = router;