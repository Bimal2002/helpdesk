import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TicketList from '../components/TicketList';
import TicketForm from '../components/TicketForm';
import TicketDetails from '../components/TicketDetails';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalTickets: 0,
        activeTickets: 0,
        pendingTickets: 0,
        closedTickets: 0
    });
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch tickets
                const ticketsResponse = await axios.get('http://localhost:5000/api/tickets');
                const tickets = ticketsResponse.data || [];

                // Calculate stats from tickets
                const newStats = {
                    totalTickets: tickets.length,
                    activeTickets: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
                    pendingTickets: tickets.filter(t => t.status === 'pending').length,
                    closedTickets: tickets.filter(t => t.status === 'closed' || t.status === 'resolved').length
                };
                setStats(newStats);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshKey]);

    const handleCreateTicket = () => {
        setCreateDialogOpen(true);
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setViewDialogOpen(true);
    };

    const handleTicketCreated = () => {
        setCreateDialogOpen(false);
        setRefreshKey(prev => prev + 1);
    };

    const handleTicketUpdated = () => {
        setViewDialogOpen(false);
        setRefreshKey(prev => prev + 1);
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Dashboard
                </Typography>
                <Box>
                    <Tooltip title="Refresh">
                        <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreateTicket}
                    >
                        Create New Ticket
                    </Button>
                </Box>
            </Box>

            {stats.totalTickets > 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                            <Typography color="textSecondary" gutterBottom>
                                Total Tickets
                            </Typography>
                            <Typography variant="h4">
                                {stats.totalTickets}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                            <Typography color="textSecondary" gutterBottom>
                                Active Tickets
                            </Typography>
                            <Typography variant="h4">
                                {stats.activeTickets}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                            <Typography color="textSecondary" gutterBottom>
                                Pending Tickets
                            </Typography>
                            <Typography variant="h4">
                                {stats.pendingTickets}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                            <Typography color="textSecondary" gutterBottom>
                                Closed Tickets
                            </Typography>
                            <Typography variant="h4">
                                {stats.closedTickets}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    All Tickets
                </Typography>
                <TicketList onViewTicket={handleViewTicket} />
            </Box>

            {/* Create Ticket Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Create New Ticket</DialogTitle>
                <DialogContent>
                    <TicketForm onTicketCreated={handleTicketCreated} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* View Ticket Dialog */}
            <TicketDetails
                ticket={selectedTicket}
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                onUpdate={handleTicketUpdated}
            />
        </Box>
    );
};

export default Dashboard; 