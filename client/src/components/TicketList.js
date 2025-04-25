import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Typography,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import { Edit as EditIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { ticketAPI } from '../api';

const TicketList = ({ onViewTicket }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await ticketAPI.getTickets();
            setTickets(response.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch tickets');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'primary';
            case 'in_progress':
                return 'warning';
            case 'resolved':
                return 'success';
            case 'closed':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatCategory = (category) => {
        if (!category) return 'General';
        return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    };

    const formatPriority = (priority) => {
        if (!priority) return 'Medium';
        return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket._id}>
                            <TableCell>{ticket.title}</TableCell>
                            <TableCell>
                                <Chip 
                                    label={formatCategory(ticket.category)}
                                    variant="outlined"
                                    color="primary"
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={formatPriority(ticket.priority)}
                                    color={getPriorityColor(ticket.priority)}
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={ticket.status || 'Open'}
                                    color={getStatusColor(ticket.status)}
                                />
                            </TableCell>
                            <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => onViewTicket(ticket)}
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    {ticket.status === 'open' && (
                                        <IconButton
                                            size="small"
                                            onClick={() => onViewTicket(ticket)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TicketList; 