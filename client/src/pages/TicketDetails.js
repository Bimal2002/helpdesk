import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
    content: yup.string().required('Note content is required'),
});

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [status, setStatus] = useState('');

    const formik = useFormik({
        initialValues: {
            content: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await axios.post(`http://localhost:5000/api/tickets/${id}/notes`, values);
                formik.resetForm();
                fetchTicket();
            } catch (error) {
                console.error('Error adding note:', error);
            }
        },
    });

    const fetchTicket = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/tickets/${id}`);
            setTicket(response.data);
            setStatus(response.data.status);
        } catch (error) {
            console.error('Error fetching ticket:', error);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;
        try {
            await axios.put(`http://localhost:5000/api/tickets/${id}/status`, {
                status: newStatus
            });
            setStatus(newStatus);
            fetchTicket();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
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

    if (!ticket) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">{ticket.title}</Typography>
                {(user.role === 'agent' || user.role === 'admin') && (
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="closed">Closed</MenuItem>
                        </Select>
                    </FormControl>
                )}
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Description
                        </Typography>
                        <Typography>{ticket.description}</Typography>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Notes
                        </Typography>
                        <List>
                            {ticket.notes.map((note, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar>{note.author.name[0]}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={note.author.name}
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {new Date(note.createdAt).toLocaleString()}
                                                    </Typography>
                                                    <br />
                                                    {note.content}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < ticket.notes.length - 1 && <Divider variant="inset" component="li" />}
                                </React.Fragment>
                            ))}
                        </List>

                        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                id="content"
                                name="content"
                                label="Add a note"
                                value={formik.values.content}
                                onChange={formik.handleChange}
                                error={formik.touched.content && Boolean(formik.errors.content)}
                                helperText={formik.touched.content && formik.errors.content}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Add Note
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Ticket Information
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography color="textSecondary">Status</Typography>
                            <Chip
                                label={ticket.status}
                                color={getStatusColor(ticket.status)}
                                sx={{ mt: 1 }}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography color="textSecondary">Customer</Typography>
                            <Typography>{ticket.customer.name}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography color="textSecondary">Created</Typography>
                            <Typography>
                                {new Date(ticket.createdAt).toLocaleString()}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography color="textSecondary">Last Updated</Typography>
                            <Typography>
                                {new Date(ticket.updatedAt).toLocaleString()}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TicketDetails; 