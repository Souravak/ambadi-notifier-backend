const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const SECRET_KEY = 'SRV2025'; // same as frontend

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_secret_room', (secret) => {
    if (secret === SECRET_KEY) {
      socket.join(SECRET_KEY);
      console.log(`User ${socket.id} joined secret room`);
    } else {
      console.log(`User ${socket.id} tried to join with invalid secret`);
      socket.disconnect(); // or just ignore
    }
  });

  socket.on('send_notification', (data) => {
    if (data.secret === SECRET_KEY) {
      console.log('Sending notification:', data.title);
      socket.to(SECRET_KEY).emit('receive_notification', { title: data.title });
    } else {
      console.log('Unauthorized attempt to send notification.');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Notifier backend is running!');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
