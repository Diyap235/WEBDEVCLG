const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Models
const User = require('./models/User');
const Task = require('./models/Task');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON data from the frontend

// MongoDB Connection (Local)
mongoose.connect('mongodb://127.0.0.1:27017/taskmanager', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB successfully!'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ==========================================
// AUTHENTICATION APIs
// ==========================================

// Register User
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(400).json({ error: "Registration failed. Email might already exist." });
    }
});

// Login User
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        
        if (user) {
            // In a simple app, we just return the user's ID to store in localStorage
            res.status(200).json({ message: "Login successful!", userId: user._id, username: user.username });
        } else {
            res.status(401).json({ error: "Invalid email or password." });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error during login." });
    }
});

// ==========================================
// TASK APIs
// ==========================================

// Create a Task
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const newTask = new Task({ title, description, userId });
        await newTask.save();
        res.status(201).json({ message: "Task created!", task: newTask });
    } catch (error) {
        res.status(400).json({ error: "Failed to create task." });
    }
});

// Get All Tasks (for a specific user)
app.get('/tasks/:userId', async (req, res) => {
    try {
        // Find tasks that match the userId provided in the URL
        const tasks = await Task.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks." });
    }
});

// Delete a Task
app.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task." });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});