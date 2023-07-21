const ctx = document.getElementById('total-email-report');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Forms',
            data: [12, 19, 3, 5, 2, 3, 1],
            borderWidth: 5,
            backgroundColor: "#00ff082d",
            fill: true
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