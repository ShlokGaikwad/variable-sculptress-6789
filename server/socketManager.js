// socketManager.js
const socketIO = require('socket.io');

function initializeSocket(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle multiplayer events here

    // Example: Broadcasting a message to all connected clients
    socket.on('chatMessage', (message) => {
      io.emit('chatMessage', message);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

module.exports = initializeSocket;
