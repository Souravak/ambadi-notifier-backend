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

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room: ${roomCode}`);
  });

  socket.on('send_notification', (data) => {
    const { room, title } = data;
    if (!room || !title) return;

    console.log(`Sending to ${room}: ${title}`);
    socket.to(room).emit('receive_notification', { title });
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

