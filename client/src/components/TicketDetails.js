import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Alert,
    Snackbar,
    Paper
} from '@mui/material';
import ticketAPI from '../api/ticketAPI';
import { useAuth } from '../context/AuthContext';

const TicketDetails = ({ ticket, open, onClose, onUpdate }) => {
    const { user, logout } = useAuth();
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ticket) {
            setStatus(ticket.status || '');
        }
    }, [ticket]);

    const handleCommentSubmit = async () => {
        if (!comment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        try {
            setLoading(true);
            const commentData = {
                text: comment.trim(),
                author: {
                    _id: user._id,
                    name: user.name
                },
                timestamp: new Date().toISOString()
            };

            const response = await ticketAPI.addComment(ticket._id, commentData);
            
            if (response.status === 200 || response.status === 201) {
                setComment('');
                setSuccess('Comment added successfully');
                onUpdate();
            } else {
                throw new Error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            if (error.response?.status === 401) {
                setError('Your session has expired. Please login again.');
                logout();
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to add comment. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            setLoading(true);
            await ticketAPI.updateStatus(ticket._id, status);
            setSuccess('Status updated successfully');
            onUpdate();
        } catch (error) {
            console.error('Error updating status:', error);
            if (error.response?.status === 401) {
                setError('Please login again to update status');
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to update status');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'primary';
            case 'pending':
                return 'warning';
            case 'closed':
                return 'success';
            default:
                return 'default';
        }
    };

    if (!ticket) return null;

    const isAdmin = user?.role === 'admin';
    const isAgent = user?.role === 'agent';
    const isCustomer = user?.role === 'customer';
    const canUpdateStatus = isAdmin || isAgent;
    const canAddComments = isAdmin || isAgent || (isCustomer && ticket.customer === user._id);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Ticket #{ticket._id}</Typography>
                    <Chip
                        label={ticket.status}
                        color={getStatusColor(ticket.status)}
                    />
                </Box>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>{ticket.title}</Typography>
                        <Typography variant="body1" paragraph>{ticket.description}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Created by: {ticket.customer?.name || 'Unknown'} | 
                            Last Updated: {new Date(ticket.updatedAt).toLocaleString()}
                        </Typography>
                    </Grid>

                    {canUpdateStatus && (
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Update Status</Typography>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={status}
                                    label="Status"
                                    onChange={(e) => setStatus(e.target.value)}
                                    disabled={loading}
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="closed">Closed</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                onClick={handleStatusUpdate}
                                disabled={loading || status === ticket.status}
                                sx={{ mt: 2 }}
                            >
                                Update Status
                            </Button>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Comments</Typography>
                        {ticket.comments?.length > 0 ? (
                            ticket.comments.map((comment, index) => (
                                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {comment.author?.name || 'Unknown'} - {new Date(comment.timestamp).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>{comment.text}</Typography>
                                </Paper>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No comments yet
                            </Typography>
                        )}
                    </Grid>

                    {canAddComments && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Add Comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={loading}
                                error={!!error}
                                helperText={error}
                                sx={{ mt: 2 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleCommentSubmit}
                                disabled={loading || !comment.trim()}
                                sx={{ mt: 2 }}
                            >
                                {loading ? 'Adding...' : 'Add Comment'}
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Close</Button>
            </DialogActions>
            <Snackbar
                open={!!success}
                autoHideDuration={3000}
                onClose={() => setSuccess('')}
                message={success}
            />
        </Dialog>
    );
};

export default TicketDetails; 