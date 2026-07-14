// src/components/BookingManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/bookings');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result); // Log to see the structure
      
      // Handle different response structures
      if (Array.isArray(result)) {
        // If it's a direct array
        setBookings(result);
      } else if (result.data && Array.isArray(result.data)) {
        // If it's { success: true, data: [...] }
        setBookings(result.data);
      } else if (result.bookings && Array.isArray(result.bookings)) {
        // If it's { bookings: [...] }
        setBookings(result.bookings);
      } else {
        console.error('Unexpected data format:', result);
        setBookings([]);
        setError('Received invalid data format from server');
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (booking, action) => {
    setSelectedBooking(booking);
    setActionType(action);
    setOpenDialog(true);
  };

  const confirmAction = async () => {
    try {
      const newStatus = actionType === 'accept' ? 'confirmed' : 'rejected';
      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchBookings();
        setOpenDialog(false);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to update booking'}`);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Network error: Could not update booking');
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      rejected: 'error'
    };
    return <Chip 
      label={status ? status.toUpperCase() : 'UNKNOWN'} 
      color={colors[status] || 'default'} 
      size="small" 
    />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">
          Error loading bookings: {error}
          <Button 
            sx={{ ml: 2 }} 
            size="small" 
            onClick={fetchBookings}
            variant="outlined"
          >
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Booking Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Review and manage all booking requests
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={fetchBookings}
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {bookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No bookings found
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>Guest Name</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.roomNumber || 'N/A'}</TableCell>
                  <TableCell>{booking.guestName || 'N/A'}</TableCell>
                  <TableCell>{booking.checkIn || 'N/A'}</TableCell>
                  <TableCell>{booking.checkOut || 'N/A'}</TableCell>
                  <TableCell>{booking.guests || 'N/A'}</TableCell>
                  <TableCell>{getStatusChip(booking.status)}</TableCell>
                  <TableCell>
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="small"
                          color="success"
                          onClick={() => handleAction(booking, 'accept')}
                          startIcon={<CheckIcon />}
                          sx={{ mr: 1 }}
                          variant="outlined"
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleAction(booking, 'reject')}
                          startIcon={<CloseIcon />}
                          variant="outlined"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {booking.status !== 'pending' && (
                      <Typography variant="caption" color="textSecondary">
                        No actions available
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {actionType === 'accept' ? 'Accept Booking' : 'Reject Booking'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType} the booking for <strong>{selectedBooking?.guestName}</strong>?
          </Typography>
          {selectedBooking && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Room:</strong> {selectedBooking.roomNumber}<br />
                <strong>Check In:</strong> {selectedBooking.checkIn}<br />
                <strong>Check Out:</strong> {selectedBooking.checkOut}<br />
                <strong>Guests:</strong> {selectedBooking.guests}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmAction} 
            color={actionType === 'accept' ? 'success' : 'error'}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BookingManagement;