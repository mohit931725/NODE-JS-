// server.js

// 1. Import Express
const express = require('express');

// 2. Initialize the Express app
const app = express();
const PORT = 3000;

// 3. Add middleware to parse JSON request bodies
// This is crucial for POST requests to read data from the request body.
app.use(express.json());

// --- In-Memory Data Store ---
// An array to hold our collection of playing cards.
let cards = [
  { id: 1, suit: 'Hearts', value: 'Ace' },
  { id: 2, suit: 'Spades', value: 'King' },
  { id: 3, suit: 'Diamonds', value: 'Queen' },
];

// A simple counter to ensure new cards get a unique ID.
let nextId = 4;


// --- API Endpoints (Routes) ---

// ## GET /cards - Retrieve all playing cards
// Responds with the entire collection of cards.
app.get('/cards', (req, res) => {
  res.status(200).json(cards);
});


// ## GET /cards/:id - Retrieve a single card by its ID
// Uses a route parameter ':id' to find a specific card.
app.get('/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = cards.find(c => c.id === cardId);

  if (card) {
    res.status(200).json(card);
  } else {
    // If no card is found, send a 404 Not Found response.
    res.status(404).json({ message: 'Card not found' });
  }
});


// ## POST /cards - Add a new card to the collection
// Creates a new card using the data from the request body.
app.post('/cards', (req, res) => {
  const { suit, value } = req.body;

  // Basic validation to ensure suit and value are provided.
  if (!suit || !value) {
    return res.status(400).json({ message: 'Suit and value are required properties.' });
  }

  const newCard = {
    id: nextId++, // Assign the next available ID and then increment the counter
    suit: suit,
    value: value,
  };

  cards.push(newCard);

  // Respond with status 201 Created and the new card object.
  res.status(201).json(newCard);
});


// ## DELETE /cards/:id - Remove a card from the collection by ID
// Finds a card by its ID and removes it from the array.
app.delete('/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const cardIndex = cards.findIndex(c => c.id === cardId);

  if (cardIndex !== -1) {
    // .splice() removes elements and returns an array of the removed elements.
    const removedCard = cards.splice(cardIndex, 1);
    res.status(200).json({
      message: `Card with ID ${cardId} removed.`,
      card: removedCard[0] // Send the card that was deleted
    });
  } else {
    // If the card doesn't exist, send a 404 response.
    res.status(404).json({ message: 'Card not found' });
  }
});


// 4. Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
