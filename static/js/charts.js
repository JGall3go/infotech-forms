const ctx = document.getElementById('total-email-report');
const originalHeight = ctx.height;
const originalWidth = ctx.width;

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octuber', 'November', 'December'],
        datasets: [{
            label: 'Forms',
            data: [12, 19, 3, 5, 2, 3, 1, 5, 3, 12, 2, 3],
            borderWidth: 3,
            backgroundColor: "#88DC8B",
            borderColor: "#bfffc1",
            pointStyle: 'rectRounded',
            pointRadius: 5,
            pointHoverRadius: 10,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                display: false
            },
            x: {
                beginAtZero: true,
                display: false
            }
        }
    }
});