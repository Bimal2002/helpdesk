const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
    getUsers,
    createUser,
    getProfile,
    updateProfile,
    getAgents
} = require('../controllers/userController');

// Apply auth middleware to all routes
router.use(auth);

// Get user profile
router.get('/profile', getProfile);

// Get all agents (admin only)
router.get('/agents', authorize(['admin']), getAgents);

// Admin routes
router.get('/', authorize(['admin']), getUsers);
router.post('/', authorize(['admin']), createUser);

module.exports = router; 