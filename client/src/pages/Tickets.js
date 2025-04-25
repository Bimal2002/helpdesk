import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
});

const Tickets = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [open, setOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await axios.post('http://localhost:5000/api/tickets', values);
                formik.resetForm();
                setOpen(false);
                fetchTickets();
            } catch (error) {
                console.error('Error creating ticket:', error);
            }
        },
    });

    const fetchTickets = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tickets');
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

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

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
    };

    const handleTicketClick = (ticketId) => {
        navigate(`/tickets/${ticketId}`);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Tickets</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    New Ticket
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Last Updated</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket._id}>
                                <TableCell>{ticket.title}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={ticket.status}
                                        color={getStatusColor(ticket.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{ticket.customer.name}</TableCell>
                                <TableCell>
                                    {new Date(ticket.updatedAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleTicketClick(ticket._id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Ticket</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Title"
                            type="text"
                            fullWidth
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                        <TextField
                            margin="dense"
                            id="description"
                            label="Description"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Tickets; 