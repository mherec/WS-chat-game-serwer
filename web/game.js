// Sterowanie

document.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'ArrowUp':
            if (userY > 100) {
                setPoz('y', -10)
            }
            break;
        case 'ArrowDown':
            if (userY < 800) {
                setPoz('y', 10)
            }
            break;
        case 'ArrowLeft':
            if (userX > 100) {
                setPoz('x', -10)
            }
            break;
        case 'ArrowRight':
            if (userX < 1600) {
                setPoz('x', 10)
            }
            break;
    }
});

// wartości sterowania

let userX = 100;
let userY = 100;

function setPoz(poz, val) {

    let object = objIdFastLoader('user');
    if (object != false) {
        switch (poz) {
            case 'x':
                userX += val;
                break;
            case 'y':
                userY += val;
                break;
        }
        object.style.left = userX + "px";
        object.style.top = userY + "px";
    }
}

function objIdFastLoader(id) {
    let object;
    try {
        object = document.getElementById(id);
    }
    catch (e) {
        console.log(e);
        object = false;
    }
    return object;
}

function setPlayers(data) {
    let cnt = Object.keys(data).length;
    console.log(cnt);
}