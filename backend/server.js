const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const analyticsRoutes = require('./routes/analyticsRoutes');

// --- Initial Server Setup ---
dotenv.config();
const app = express();
const server = http.createServer(app);

// --- Database Connection ---
connectDB();

// --- WebSocket (Socket.IO) Setup ---
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});

// --- Core Middlewares ---
app.use(cors());
app.use(express.json());

// Middleware to attach the `io` instance to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/reports', analyticsRoutes);

io.on('connection', (socket) => {
  console.log(`[Socket.IO] User Connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`[Server] Successfully started on http://localhost:${PORT}`));