const username = "testowy"
let id = "00000";
let chatMessages = document.getElementById('chatMessages');
let date = new Date();

const key = "";

let hours = date.getHours().toString().padStart(2, '0');
let minutes = date.getMinutes().toString().padStart(2, '0');
let seconds = date.getSeconds().toString().padStart(2, '0');

let timeString = `[${hours}:${minutes}:${seconds}]`;
chatMessages.innerHTML = "";
ws = new WebSocket("ws://192.168.1.51:8000");

ws.onopen = function (e) {
    chatMessages.innerHTML = `<span class='ws_ok'>${timeString} Połączono</span>`;
    // Login com
    const getLogin = {
        key: key,
        com: 'login',
        username: username,
    };
    ws.send(JSON.stringify(getLogin));
    // Sync
    setInterval(function () {
        const message = {
            id: id,
            com: 'game',
            username: username,
            key: key,
            userX: userX,
            userY: userY,
        };
        ws.send(JSON.stringify(message));
    }, 10);
};

ws.onmessage = function (event) {
    const newData = JSON.parse(event.data)
    //  console.log(newData)
    if (newData.com === 'chat') {
        chatMessages.innerHTML += `<span class='ws_msg'>${timeString} <b> [${newData.id}] ${newData.username}</b>: ${newData.message} </span>`
    }
    if (newData[0].com === 'game') {
        setPlayers(newData);
    }
    if (newData[0].com === 'login') {
        console.log("id = ", id)
        id = newData[0].id;

    }
};

ws.onclose = function (event) {
    if (event.wasClean) {
        chatMessages.innerHTML += `<span class='ws'>${timeString} Połączenie zamknięte poprawnie</span>`

    } else {
        console.log('[close] Połączenie zakończone');
        chatMessages.innerHTML += `<span class='ws'>${timeString} Połączenie zakończone</span>`
    }
};

ws.onerror = function (error) {
    console.log(`[error] ${error.message}`);
};

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('chatInput').addEventListener('keydown', function (event) {
        if (event.code === 'Enter') {
            const message = {
                com: 'chat',
                username: username,
                key: key,
                message: this.value,
            }
            ws.send(JSON.stringify(message))

            this.value = '';
            event.preventDefault();
        }
    });
});
