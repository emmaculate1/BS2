// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  MeetingRoom,
  BookOnline,
  Logout
} from '@mui/icons-material';
import BookingManagement from './BookingManagement';
import RoomManagement from './RoomManagement';

const drawerWidth = 240;

function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('bookings');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem 
          button 
          selected={selectedSection === 'dashboard'}
          onClick={() => setSelectedSection('dashboard')}
        >
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'bookings'}
          onClick={() => setSelectedSection('bookings')}
        >
          <ListItemIcon><BookOnline /></ListItemIcon>
          <ListItemText primary="Bookings" />
        </ListItem>
        <ListItem 
          button 
          selected={selectedSection === 'rooms'}
          onClick={() => setSelectedSection('rooms')}
        >
          <ListItemIcon><MeetingRoom /></ListItemIcon>
          <ListItemText primary="Rooms" />
        </ListItem>
      </List>
    </div>
  );

  const renderContent = () => {
    switch(selectedSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'bookings':
        return <BookingManagement />;
      case 'rooms':
        return <RoomManagement />;
      default:
        return <BookingManagement />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Room Booking Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}

function DashboardOverview() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    availableRooms: 0,
    totalRooms: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const bookingsRes = await fetch('http://localhost:5000/api/bookings');
      const roomsRes = await fetch('http://localhost:5000/api/rooms');
      const bookings = await bookingsRes.json();
      const rooms = await roomsRes.json();

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        availableRooms: rooms.filter(r => r.available).length,
        totalRooms: rooms.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography color="textSecondary" gutterBottom>
            Total Bookings
          </Typography>
          <Typography variant="h4">
            {stats.totalBookings}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: '#fff3e0' }}>
          <Typography color="textSecondary" gutterBottom>
            Pending Bookings
          </Typography>
          <Typography variant="h4" color="warning.main">
            {stats.pendingBookings}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: '#e8f5e8' }}>
          <Typography color="textSecondary" gutterBottom>
            Confirmed Bookings
          </Typography>
          <Typography variant="h4" color="success.main">
            {stats.confirmedBookings}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography color="textSecondary" gutterBottom>
            Available Rooms
          </Typography>
          <Typography variant="h4" color="primary">
            {stats.availableRooms} / {stats.totalRooms}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AdminDashboard;