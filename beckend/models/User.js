const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Bring in the security package

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// ==========================================
// SECURITY HOOK: Hash password before saving
// ==========================================
UserSchema.pre('save', async function(next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    try {
        // Generate a "salt" (random characters) and mix it with the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);