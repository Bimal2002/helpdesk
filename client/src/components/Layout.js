import React from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Button, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Dashboard as DashboardIcon,
    Support as SupportIcon,
    People as PeopleIcon,
    ExitToApp as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin'] },
        { text: 'Tickets', icon: <SupportIcon />, path: '/tickets', roles: ['customer', 'agent', 'admin'] },
        { text: 'Customers', icon: <PeopleIcon />, path: '/customers', roles: ['agent', 'admin'] }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Helpdesk
                    </Typography>
                    {user && (
                        <>
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                Welcome, {user.name}
                            </Typography>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                {children}
            </Container>
        </Box>
    );
};

export default Layout; 