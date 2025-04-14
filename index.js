const express = require('express');
const config = require('./config/config');
const Api = require('./router');
const enet = require('enet');

const app = express();
const PORT = config.port || 3000;
const ENET_PORT = 9000;
const ENET_HOST = "127.0.0.1";

let players = []
let connectedPeers = [];

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
        console.log('Client connected:', peer.address());
            connectedPeers.push(peer);     
            peer.on('message', (packet, channel) => {
                try {
                    // Correctly parse ENet packet data
                    let buffer = packet.data();
                    let message = buffer.toString('utf8', 0, buffer.length);
                    
                    // Optional: Remove any non-printable characters from the start
                    message = message.replace(/^[^\x20-\x7E]+/, '');
            
                    const data = JSON.parse(message);
                    if(data.type == "update_position") {
                        let updatedData = [];
                        players.forEach(async player => {
                            if(player.id == data.id) {
                                const buffer = {
                                    id: player.id,
                                    position: {
                                        x: data.x,
                                        y: data.y
                                    }
                                }
                                updatedData.push(buffer);
                            } else {
                                updatedData.push(player);
                            }
                        })
                        players = updatedData;
                        broadcastPositions(host);
                    } else if(data.type == "register") {
                        let existed = players.find(item => item.socket?.address() == peer.address());
                        if(!existed || existed.length < 1) {
                            players.push({id: data.id, position:{ x:0, y:0 }, socket: peer});      
                        }
                    } else if(data.type == "update_follower") {
                        let updatedData = [];
                        players.forEach(async player => {
                            if(player.id == data.id) {
                                let buffer = player;
                                buffer[data.name] = {x: data.x, y: data.y};
                                updatedData.push(buffer);
                            } else {
                                updatedData.push(player);
                            }
                        })
                        players = updatedData;
                        broadcastFollowers(host, data.name);
                    } else if(data.type == "update_color") {
                        const updatedData = {
                            id: data.id,
                            tiles: data.tiles
                        }
                        broadcastColorChange(host, updatedData);
                    }
                } catch (e) {
                    console.error('Error parsing packet:', e);
                }
            });

            peer.on('disconnect', () => {
                console.log('Client disconnected:', peer.address());
                let filteredPlayeresplayers = players.filter(player => player.socket?.address() == peer.address());
                players = filteredPlayeresplayers;
                // delete players[peerId];
                broadcastPositions(host);
            });
    });

    host.start();
});


function broadcastPositions(host) {
    let fetchData = [];
    players.forEach(player => {
        if(player.position.x != 0 && player.position.y != 0)
            fetchData.push({
                id: player.id,
                position: player.position
            })
    })
    const payload = JSON.stringify({ type: 'positions', players: fetchData });

    connectedPeers.length > 0 && connectedPeers.forEach((peer) => {   
        peer.send(0, Buffer.from(payload, 'utf8'));
    });
}

function broadcastFollowers(host, follower) {
    let fetchData = [];
    players.forEach(player => {
        if(player[follower]) {
            fetchData.push({
                id: player.id,
                name: follower,
                position :  player[follower]
            });
        }
    })
    const payload = JSON.stringify({ type: 'followers', players: fetchData });

    connectedPeers.length > 0 && connectedPeers.forEach((peer) => {   
        peer.send(0, Buffer.from(payload, 'utf8'));
    });
}

function broadcastColorChange(host, data) {
    var fetchData = {
        id: data.id,
        tiles: data.tiles
    }
    const payload = JSON.stringify({ type: 'colors', colors: fetchData });
    connectedPeers.length > 0 && connectedPeers.forEach((peer) => {   
        peer.send(0, Buffer.from(payload, 'utf8'));
    });
}

app.use(express.json());
app.use("/api", Api);
app.listen(PORT, () => {
    console.log(`REST API running on port ${PORT}`);

});