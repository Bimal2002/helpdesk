const Ticket = require('../models/Ticket');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
// Create a new ticket
const createTicket = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        const ticket = new Ticket({
            title,
            description,
            customer: req.user._id
        });

        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error: error.message });
    }
};

// Get all tickets (with role-based filtering)
const getTickets = async (req, res) => {
    try {
        let query = {};
        
        // Customers can only see their own tickets
        if (req.user.role === 'customer') {
            query.customer = req.user._id;
        }
        
        const tickets = await Ticket.find(query)
            .populate('customer', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ updatedAt: -1 });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};

// Get a single ticket
const getTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('customer', 'name email')
            .populate('assignedTo', 'name email')
            .populate('notes.author', 'name email')
            .populate('comments.author', 'name email');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check if user has access to this ticket
        if (req.user.role === 'customer' && ticket.customer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ticket', error: error.message });
    }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Only agents and admins can update status
        if (req.user.role === 'customer') {
            return res.status(403).json({ message: 'Access denied' });
        }

        ticket.status = status;
        await ticket.save();

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket', error: error.message });
    }
};

// Add a note to a ticket
const addNote = async (req, res) => {
    try {
        const { content } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check if user has access to this ticket
        if (req.user.role === 'customer' && ticket.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        ticket.notes.push({
            content,
            author: req.user._id
        });

        await ticket.save();
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error adding note', error: error.message });
    }
};

const assignTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { agentId } = req.body;

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const agent = await User.findById(agentId);
        if (!agent || agent.role !== 'agent') {
            return res.status(400).json({ message: 'Invalid agent ID' });
        }

        ticket.assignedTo = agentId;
        await ticket.save();

        res.json({
            message: 'Ticket assigned successfully',
            ticket: {
                id: ticket._id,
                title: ticket.title,
                assignedTo: {
                    id: agent._id,
                    name: agent.name,
                    email: agent.email
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning ticket', error: error.message });
    }
};

// Add a comment to a ticket
const addComment = async (req, res) => {
    try {
        const { text, author } = req.body;
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check if user has access to this ticket
        if (req.user.role === 'customer' && ticket.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        ticket.comments.push({
            text,
            author: req.user._id,
            timestamp: new Date()
        });

        await ticket.save();
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

module.exports = {
    createTicket,
    getTickets,
    getTicket,
    updateTicketStatus,
    addNote,
    addComment,
    assignTicket
}; 