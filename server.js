const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // You can specify your frontend URL here
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('send_notification', (data) => {
    console.log('Sending notification:', data);
    socket.broadcast.emit('receive_notification', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Notifier backend is running!');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


