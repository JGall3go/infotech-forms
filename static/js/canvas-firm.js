// Canvas Draw

const canvas_container = document.querySelectorAll('.canvas-container');

canvas_container.forEach((item) => {

    let canvas = item.querySelector("canvas");
    let save_button = item.querySelector(".save-button");
    let clear_button = item.querySelector(".clear-button");

    let context = canvas.getContext('2d');

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
            const color = item.querySelector('#selColor').value;
            const idx = ongoingTouchIndexById(touches[i].identifier);
            if (idx >= 0) {
                context.beginPath();
                context.moveTo(ongoingTouches[idx].clientX - offsetX, ongoingTouches[idx].clientY - offsetY);
                context.lineTo(touches[i].clientX - offsetX, touches[i].clientY - offsetY);
                context.lineWidth = item.querySelector('#selWidth').value;
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
            const color = item.querySelector('#selColor').value;
            let idx = ongoingTouchIndexById(touches[i].identifier);
            if (idx >= 0) {
                context.lineWidth = item.querySelector('#selWidth').value;
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
        context.strokeStyle = item.querySelector('#selColor').value;
        context.lineWidth = item.querySelector('#selWidth').value;
        context.lineJoin = "round";
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.closePath();
        context.stroke();
    }

    save_button.addEventListener("click", e => {

        let img = canvas.toDataURL('image/png');
        let firm_img = "";

        if (item.id == "user-canvas-container") {
            firm_img = document.querySelector("#user-firm-image");
            firm_img.src = img;

            document.body.style.overflow = "scroll";
            item.style.display = "none";

            let reader = getBase64Image(firm_img);
            localStorage.setItem('user-firm-image', reader);
        }

        if (item.id == "tech-canvas-container") {
            firm_img = document.querySelector("#tech-firm-image");
            firm_img.src = img;

            document.body.style.overflow = "scroll";
            item.style.display = "none";

            let reader = getBase64Image(firm_img);
            localStorage.setItem('tech-firm-image', reader);
        }

    })

    clear_button.addEventListener("click", e => {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    })

    function getBase64Image(img) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
    
        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    
        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");
    
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
});

// Canvas Show

let user_firm_button = document.getElementById("user-firm-container"); // Show Button
let user_canvas_container = document.getElementById("user-canvas-container"); // Canvas

let tech_firm_button = document.getElementById("tech-firm-container"); // Button
let tech_canvas_container = document.getElementById("tech-canvas-container"); // Canvas

/* This Button hide all the canvas */
let hide_canvas_button = document.querySelectorAll("#cancel-firm-button"); // Hide Button

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