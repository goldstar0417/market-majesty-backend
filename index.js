const express = require('express');
const config = require('./config/config');
const enet = require('enet');

const app = express();
const PORT = config.port || 3000;
const ENET_PORT = 1234;

// Initialize ENet server
const server = enet.createServer({
    address: {
        address: '127.0.0.1',
        port: ENET_PORT
    },
    peers: 32, // Maximum number of peers
    channels: 2, // Number of channels
    down: 0, // Download bandwidth limit (0 for no limit)
    up: 0 // Upload bandwidth limit (0 for no limit)
});

// Handle ENet events
server.on('connect', (peer) => {
    console.log('Client connected:', peer.address());
});

server.on('message', (peer, packet, channel) => {
    console.log('Received message from:', peer.address());
    // Handle game state updates here
    // packet.data() contains the message
});

server.on('disconnect', (peer) => {
    console.log('Client disconnected:', peer.address());
});

app.use(express.json());
app.listen(PORT, () => {
    console.log(`REST API running on port ${PORT}`);
    console.log(`ENet server running on port ${ENET_PORT}`);
});