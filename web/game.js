// Control

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

// Control start val

let userX = -100;
let userY = -100;

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

// oget obj

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

// Add player / set position

function setPlayers(data) {
    let cnt = Object.keys(data).length - 1;
    for (let i = 1; i <= cnt; i++) {
        let obj = objIdFastLoader(data[i].id);
        if (obj != false && obj != null) {
            obj.style.left = data[i].pozX + 'px';
            obj.style.top = data[i].pozY + 'px';
            obj.style.display = "block";
        } else {
            if (data[i].id != id) {
                document.getElementById('cNt').innerHTML += `<div class="other" id="${data[i].id}"></div>`;
            }
        }
    }
}
