const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); 
const cors = require('cors'); // Add this to allow frontend to talk to backend

dotenv.config();
const app = express();

// MIDDLEWARE - CRITICAL FIX
app.use(cors()); // Allows your HTML files to talk to the server
app.use(express.json()); // Tells Express to read JSON data from fetch()
app.use(express.urlencoded({ extended: true }));

// REGISTER ROUTE
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        
        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// LOGIN ROUTE
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && user.password === password) {
            res.status(200).json({ 
                message: "Login successful", 
                userId: user._id, 
                username: user.username 
            });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// For Vercel
module.exports = app;

// Local testing
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}