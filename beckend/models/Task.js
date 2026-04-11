const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    userId: { type: String, required: true },
    // NEW: We add a status field with a default of 'pending'
    status: { type: String, enum: ['pending', 'completed', 'deleted'], default: 'pending' }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);