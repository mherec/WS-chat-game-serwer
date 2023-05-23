const express = require('express');
const app = express()
const wsPort = 8000
const postPort = 8001
const WebSocket = require('ws')
const chat = require('./engine/chat');
// Klucz można dodać do env lub najlepiej pobierać z bazy dla każdego indywidualnie
const key = '';

let nextId = 1;
const clients = new Map();

app.use(express.static('web'));

let players = {
    'testowy': [{
        pozX: 120,
        pozY: 200,
    }]
};

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
    clients.set(id, ws);
    console.log('Connected, ID:', id);

    ws.on('message', function message(data) {
        try {
            const dataIncom = JSON.parse(data.toString());
            if (key === dataIncom.key) {
                if (dataIncom.com === 'chat') {
                    const message = {
                        com: 'chat',
                        username: dataIncom.username,
                        message: chat.censorText(dataIncom.message),
                    }
                    wss.broadcast(JSON.stringify(message));
                }
                if (dataIncom.com === 'game') {
                    ws.send(players);
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

