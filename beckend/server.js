const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require(path.join(__dirname, 'models', 'User'));
const Task = require(path.join(__dirname, 'models', 'Task'));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB!'))
    .catch(err => console.error('❌ MongoDB error:', err));

// ===== REGISTER ROUTE =====
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        console.log("Registration attempt:", { username, email });
        
        // Prevent crashing if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered. Try logging in." });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        console.log("User registered successfully!");
        res.status(201).json({ message: "Registration successful!" });
    } catch (err) {
        console.error("REGISTRATION ERROR:", err.message);
        console.error("Full error:", err);
        res.status(400).json({ error: err.message || "Registration failed" });
    }
});

// ===== LOGIN ROUTE =====
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ 
                message: "Login successful!", 
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

// ===== CREATE TASK =====
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const newTask = new Task({ title, description, userId });
        await newTask.save();
        res.status(201).json({ message: "Task created!", task: newTask });
    } catch (error) {
        res.status(400).json({ error: "Failed to create task" });
    }
});

// ===== GET TASKS =====
app.get('/tasks/:userId', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// ===== UPDATE TASK STATUS =====
app.put('/tasks/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

// ===== DELETE TASK =====
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, { status: 'deleted' });
        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

// ===== START SERVER / VERCEL EXPORT =====
// This tells Vercel to use this file as a Serverless Function
module.exports = app;

// This keeps it working on your laptop without breaking Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}