const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const predictBtn = document.getElementById('predict-btn');
const clearBtn = document.getElementById('clear-btn');
const result = document.getElementById('result');
const digitSpan = document.getElementById('digit');
const confidenceSpan = document.getElementById('confidence');

let isDrawing = false;

// Initialize canvas: white background, black stroke
function initCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
}
initCanvas();

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events (mobile)
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    startDrawing({
        clientX: touch.clientX,
        clientY: touch.clientY,
        target: canvas,
        rect: rect
    });
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw({
        clientX: touch.clientX,
        clientY: touch.clientY,
        target: canvas,
        rect: rect
    });
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopDrawing();
});

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(
        (e.clientX - rect.left),
        (e.clientY - rect.top)
    );
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(
        (e.clientX - rect.left),
        (e.clientY - rect.top)
    );
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

// Clear canvas
clearBtn.addEventListener('click', () => {
    initCanvas();
    result.classList.add('hidden');
});

// Predict digit
predictBtn.addEventListener('click', async () => {
    const imageData = canvas.toDataURL('image/png');

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData })
        });

        const data = await response.json();

        digitSpan.textContent = data.digit;
        confidenceSpan.textContent = data.confidence;
        result.classList.remove('hidden');
    } catch (error) {
        alert('Error predicting digit. Please try again.');
        console.error(error);
    }
});
