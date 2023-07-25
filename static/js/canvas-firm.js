// Canvas Draw

const canvas = document.getElementById('user-firm-canvas');

const context = canvas.getContext('2d');
let isDrawing = false;
let x = 0;
let y = 0;
var offsetX;
var offsetY;

function startup() {
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleCancel);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('mousedown', (e) => {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (isDrawing) {
            drawLine(context, x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", startup);

const ongoingTouches = [];

function handleStart(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    offsetX = canvas.getBoundingClientRect().left;
    offsetY = canvas.getBoundingClientRect().top;
    for (let i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
    }
}

function handleMove(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const color = document.getElementById('selColor').value;
        const idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            context.beginPath();
            context.moveTo(ongoingTouches[idx].clientX - offsetX, ongoingTouches[idx].clientY - offsetY);
            context.lineTo(touches[i].clientX - offsetX, touches[i].clientY - offsetY);
            context.lineWidth = document.getElementById('selWidth').value;
            context.strokeStyle = color;
            context.lineJoin = "round";
            context.closePath();
            context.stroke();
            ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
        }
    }
}

function handleEnd(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const color = document.getElementById('selColor').value;
        let idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            context.lineWidth = document.getElementById('selWidth').value;
            context.fillStyle = color;
            ongoingTouches.splice(idx, 1); // remove it; we're done
        }
    }
}

function handleCancel(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1); // remove it; we're done
    }
}

function copyTouch({
    identifier,
    clientX,
    clientY
}) {
    return {
        identifier,
        clientX,
        clientY
    };
}

function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier;
        if (id === idToFind) {
            return i;
        }
    }
    return -1; // not found
}

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = document.getElementById('selColor').value;
    context.lineWidth = document.getElementById('selWidth').value;
    context.lineJoin = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
}

function clearArea() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

// Canvas Show

let user_firm_button = document.getElementById("user-firm-container"); // Show Button
let user_canvas_container = document.getElementById("user-canvas-container"); // Canvas

let tech_firm_button = document.getElementById("tech-firm-container"); // Button
let tech_canvas_container = document.getElementById("tech-canvas-container"); // Canvas

/* This Button hide all the canvas */
let hide_canvas_button = document.querySelectorAll("#cancel-firm-button"); // Hide Button

// Canvas Save

let user_firm_save_button = document.getElementById("user-save-button")
let user_firm_img = document.getElementById("user-firm-image")

let tech_firm_save_button = document.getElementById("tech-save-button")

user_firm_save_button.addEventListener("click", e => {
    
    let img = canvas.toDataURL('image/png')
    user_firm_img.src = img
    document.body.style.overflow = "scroll";
    user_canvas_container.style.display = "none";

    reader.readAsDataURL(user_firm_img);

    reader.addEventListener('load', () => {
        localStorage.setItem('thumbnail', reader.result);
    });

})

// Show User Firm
user_firm_button.addEventListener("click", e => {
    document.body.style.overflow = "hidden";
    user_canvas_container.style.display = "flex";
})

// Show Tech Firm
tech_firm_button.addEventListener("click", e => {
    document.body.style.overflow = "hidden";
    tech_canvas_container.style.display = "flex";
})

// Hide All Canvas
for (button in hide_canvas_button) {

    hide_canvas_button[button].addEventListener("click", e => {
        document.body.style.overflow = "scroll";
        user_canvas_container.style.display = "none";
        tech_canvas_container.style.display = "none";
    })
}