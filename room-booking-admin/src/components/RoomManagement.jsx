// src/components/RoomManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Switch,
  FormControlLabel
} from '@mui/material';
import { MeetingRoom, CheckCircle, Cancel } from '@mui/icons-material';

function RoomManagement() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const toggleRoomAvailability = async (roomNumber, currentStatus) => {
    // In a real app, you would update this in the backend
    const updatedRooms = rooms.map(room =>
      room.number === roomNumber 
        ? { ...room, available: !currentStatus }
        : room
    );
    setRooms(updatedRooms);
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Room Management
        </Typography>
        <Typography variant="body2" color="textSecondary">
          View and manage room availability
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.number}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MeetingRoom sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Room {room.number}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Type: {room.type}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Capacity: {room.capacity} guests
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Price: ${room.price}/night
                </Typography>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={room.available ? 'Available' : 'Booked'} 
                    color={room.available ? 'success' : 'error'}
                    icon={room.available ? <CheckCircle /> : <Cancel />}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={room.available}
                        onChange={() => toggleRoomAvailability(room.number, room.available)}
                        color="primary"
                      />
                    }
                    label="Toggle"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default RoomManagement;