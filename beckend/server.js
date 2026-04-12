const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// NEW: Load environment variables from the .env file
require('dotenv').config(); 

const User = require(path.join(__dirname, 'models', 'User'));
const Task = require(path.join(__dirname, 'models', 'Task'));

const app = express();

// MIDDLEWARE - CRITICAL FIX
app.use(cors()); // Allows your HTML files to talk to the server
app.use(express.json()); // Tells Express to read JSON data from fetch()
app.use(express.urlencoded({ extended: true }));

// REGISTER ROUTE
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
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
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ message: "Login successful!", userId: user._id, username: user.username });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

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

app.get('/tasks/:userId', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// ==========================================
// NEW: UPDATE TASK STATUS (Mark as Done)
// ==========================================
app.put('/tasks/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Failed to update task status" });
    }
});

// ==========================================
// UPDATED: SOFT DELETE (Hide from dashboard, keep for analytics)
// ==========================================
app.delete('/tasks/:id', async (req, res) => {
    try {
        // We update the status to 'deleted' instead of destroying the record completely
        await Task.findByIdAndUpdate(req.params.id, { status: 'deleted' });
        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});