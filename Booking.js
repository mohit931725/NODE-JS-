// server.js

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// --- Configuration ---
const TOTAL_SEATS = 20;
const LOCK_TIMEOUT_MS = 1 * 60 * 1000; // 1 minute

// --- In-Memory Data Store ---
// Using an object for fast seat lookups by ID
const seats = {};

// Initialize all seats as 'available'
for (let i = 1; i <= TOTAL_SEATS; i++) {
  seats[i] = {
    status: 'available', // can be 'available', 'locked', or 'booked'
    lockTimestamp: null
  };
}


// --- Helper Function to Check for Expired Locks ---
function isLockExpired(seat) {
  if (seat.status !== 'locked' || !seat.lockTimestamp) {
    return false;
  }
  return (Date.now() - seat.lockTimestamp) > LOCK_TIMEOUT_MS;
}


// --- API Endpoints ---

/**
 * ## GET /seats
 * Retrieves the current status of all seats.
 */
app.get('/seats', (req, res) => {
  // Before sending, check for and release any expired locks
  for (const seatId in seats) {
    const seat = seats[seatId];
    if (isLockExpired(seat)) {
      seat.status = 'available';
      seat.lockTimestamp = null;
    }
  }
  res.status(200).json(seats);
});


/**
 * ## POST /seats/lock/:id
 * Attempts to lock a specific seat for booking.
 */
app.post('/seats/lock/:id', (req, res) => {
  const seatId = req.params.id;
  const seat = seats[seatId];

  if (!seat) {
    return res.status(404).json({ message: 'Seat not found.' });
  }

  // Release the lock if it has expired
  if (isLockExpired(seat)) {
    seat.status = 'available';
    seat.lockTimestamp = null;
  }

  // Now, check the status
  if (seat.status === 'available') {
    seat.status = 'locked';
    seat.lockTimestamp = Date.now();
    res.status(200).json({ message: `Seat ${seatId} locked successfully. Confirm within 1 minute.` });
  } else if (seat.status === 'locked') {
    res.status(400).json({ message: `Seat ${seatId} is currently locked.` });
  } else { // 'booked'
    res.status(400).json({ message: `Seat ${seatId} is already booked.` });
  }
});


/**
 * ## POST /seats/confirm/:id
 * Confirms the booking for a previously locked seat.
 */
app.post('/seats/confirm/:id', (req, res) => {
  const seatId = req.params.id;
  const seat = seats[seatId];

  if (!seat) {
    return res.status(404).json({ message: 'Seat not found.' });
  }

  // Check if the lock is valid (locked and not expired)
  if (seat.status === 'locked' && !isLockExpired(seat)) {
    seat.status = 'booked';
    seat.lockTimestamp = null; // Clear the lock timer
    res.status(200).json({ message: `Seat ${seatId} booked successfully!` });
  } else if (seat.status === 'locked' && isLockExpired(seat)) {
    // If the lock expired, release it
    seat.status = 'available';
    seat.lockTimestamp = null;
    res.status(400).json({ message: 'Lock on the seat has expired. Please lock it again.' });
  } else {
    // If seat is 'available' or already 'booked'
    res.status(400).json({ message: 'Seat is not locked and cannot be booked' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Ticket booking server running on http://localhost:${PORT}`);
});
