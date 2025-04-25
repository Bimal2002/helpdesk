const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

// Get all users (admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Create a new user (admin only)
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new User({
            name,
            email,
            password,
            role
        });

        await user.save();

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user._id);

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Get all agents
const getAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: 'agent' }).select('_id name email');
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agents', error: error.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    getProfile,
    updateProfile,
    getAgents
}; 