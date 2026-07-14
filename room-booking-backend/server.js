// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock data storage
let bookings = [
  {
    id: 1,
    roomNumber: '101',
    guestName: 'John Doe',
    checkIn: '2024-03-20',
    checkOut: '2024-03-25',
    status: 'pending',
    guests: 2,
    email: 'john@example.com',
    phone: '123-456-7890'
  },
  {
    id: 2,
    roomNumber: '102',
    guestName: 'Jane Smith',
    checkIn: '2024-03-22',
    checkOut: '2024-03-24',
    status: 'confirmed',
    guests: 1,
    email: 'jane@example.com',
    phone: '098-765-4321'
  },
  {
    id: 3,
    roomNumber: '103',
    guestName: 'Bob Wilson',
    checkIn: '2024-03-21',
    checkOut: '2024-03-23',
    status: 'pending',
    guests: 3,
    email: 'bob@example.com',
    phone: '555-123-4567'
  }
];

let rooms = [
  { number: '101', type: 'Single', capacity: 2, price: 100, available: true },
  { number: '102', type: 'Double', capacity: 2, price: 150, available: true },
  { number: '103', type: 'Suite', capacity: 4, price: 250, available: true },
  { number: '104', type: 'Single', capacity: 2, price: 100, available: false },
  { number: '105', type: 'Double', capacity: 2, price: 150, available: true }
];

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// Get all rooms
app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

// Update booking status
app.put('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const bookingIndex = bookings.findIndex(b => b.id === parseInt(id));
  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = status;
    res.json(bookings[bookingIndex]);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
});

// Create new booking
app.post('/api/bookings', (req, res) => {
  const newBooking = {
    id: bookings.length + 1,
    ...req.body,
    status: 'pending'
  };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});