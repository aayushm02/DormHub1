const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/dorm-rating-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Dorm Schema
const dormSchema = new mongoose.Schema({
  name: String,
  description: String,
  ratings: [{ score: Number, comment: String }],
});
const Dorm = mongoose.model('Dorm', dormSchema);

// Item Schema (for rent/buy marketplace)
const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ['rent', 'sale'] },
  price: Number,
  createdAt: { type: Date, default: Date.now },
});
const Item = mongoose.model('Item', itemSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// API Routes - Dorms
app.get('/api/dorms', async (req, res) => {
  try {
    const dorms = await Dorm.find();
    res.json(dorms);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/dorms', async (req, res) => {
  try {
    const dorm = new Dorm(req.body);
    await dorm.save();
    res.json(dorm);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/ratings', async (req, res) => {
  try {
    const { dormId, score, comment } = req.body;
    const dorm = await Dorm.findById(dormId);
    if (!dorm) return res.status(404).json({ error: 'Dorm not found' });
    dorm.ratings.push({ score, comment });
    await dorm.save();
    res.json({ score, comment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// API Routes - Items (Rent/Buy)
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Socket.IO for chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', async ({ recipient, content }) => {
    try {
      const message = new Message({ sender: socket.id, recipient, content });
      await message.save();
      io.to(recipient).emit('receiveMessage', { sender: socket.id, content });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(5000, () => console.log('Server running on http://localhost:5000'));