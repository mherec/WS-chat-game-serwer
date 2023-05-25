const express = require('express');
const app = express()
const wsPort = 8000
const postPort = 8001
const WebSocket = require('ws')
const chat = require('./engine/chat');
// Replace key update here
const key = '';

let nextId = 75478;
const clients = new Map();

app.use(express.static('web'));

let players = [{com: "game", key: key}];


const wss = new WebSocket.Server({ port: wsPort });

wss.broadcast = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
};

wss.on('connection', function connection(ws, req) {

    const id = nextId++;
    let pozX;
    let pozY;
    let username;
    clients.set(id, ws);

    console.log('Connected, ID:', id, players);

    ws.on('message', function message(data) {
        try {
            const dataIncom = JSON.parse(data.toString());
            if (key === dataIncom.key) {
                if (dataIncom.com === 'chat') {
                    const message = {
                        com: 'chat',
                        id: id,
                        username: dataIncom.username,
                        message: chat.censorText(dataIncom.message),
                    }
                    wss.broadcast(JSON.stringify(message));
                }
                if (dataIncom.com === 'game') {
                 //   console.log(dataIncom);
                    changePlayerPosition(dataIncom.id, dataIncom.userX, dataIncom.userY);
                    ws.send(JSON.stringify(players));
                }
                if (dataIncom.com === 'login') {
                    username = dataIncom.username;
                    let newUser = {
                        id: id,
                        username: username,
                        pozX: 123,
                        pozY: 300,
                    };
                    players.push(newUser);
                    const auth = [{ com: 'login', id: newUser.id }]
                    ws.send(JSON.stringify(auth));
                }
            }
        } catch (e) {
            // obsługa błędów
        }
    });

    ws.on('close', function close() {
        const ip = req.socket.remoteAddress;
        // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(`Lost a client ${ip}`);
        clients.delete(id);
    });

    ws.on('error', function error(err) {
        const ip = req.socket.remoteAddress;
        console.log(`Lost a client ${ip}`);
        clients.delete(id);
    });
});

app.listen(postPort, () => {
    const msg = `Chat: localhost:${postPort}`;
    console.log(msg);
})

function changePlayerPosition(id, newX, newY) {
    for (let i = 1; i <= (Object.keys(players).length - 1); i++) {
        if (players[i].id === id) {
            players[i].pozX = newX;
            players[i].pozY = newY;
            break; // Exit the loop after updating the player position
        }
    }
}
