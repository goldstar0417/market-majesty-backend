const express = require('express');
const config = require('./config/config');
const Api = require('./router');
const enet = require('enet');

const app = express();
const PORT = config.port || 3000;
const ENET_PORT = 9000;
const ENET_HOST = "127.0.0.1";

// Initialize ENet server
enet.createServer({
    address: new enet.Address(ENET_HOST, ENET_PORT),
    peers: 32,
    channels: 2,
    down: 0,
    up: 0
}, (err, host) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('ENet server running on', ENET_HOST, ENET_PORT);

    host.on('connect', peer => {
        console.log('Client connected:', peer._address);

        peer.on('message', (packet, channel) => {
            const message = packet.data().toString();
            console.log('Received:', message);

            peer.send(channel, Buffer.from('Server reply: ' + message));
        });

        peer.on('disconnect', () => {
            console.log('Client disconnected:', peer._address);
        });
    });

    host.start();
});

app.use(express.json());
app.use("/api", Api);
app.listen(PORT, () => {
    console.log(`REST API running on port ${PORT}`);

});