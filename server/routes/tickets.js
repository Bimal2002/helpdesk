const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
    createTicket,
    getTickets,
    getTicket,
    updateTicketStatus,
    addNote,
    addComment,
    assignTicket
} = require('../controllers/ticketController');

// Apply auth middleware to all routes
router.use(auth);

// Get all tickets
router.get('/', getTickets);

// Get a single ticket
router.get('/:id', getTicket);

// Create a new ticket
router.post('/', createTicket);

// Update ticket status (agents and admins only)
router.put('/:id/status', authorize(['agent', 'admin']), updateTicketStatus);

// Add a note to a ticket
router.post('/:id/notes', addNote);

// Add a comment to a ticket
router.post('/:id/comments', addComment);

// Assign ticket to agent (admin only)
router.put('/:id/assign', authorize(['admin']), assignTicket);

module.exports = router; 