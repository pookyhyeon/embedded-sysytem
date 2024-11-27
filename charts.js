// Example graph setup with Chart.js
document.addEventListener("DOMContentLoaded", function() {
    const ctx1 = document.getElementById("temperatureChart").getContext("2d");
    const ctx2 = document.getElementById("humidityChart").getContext("2d");
    const ctx3 = document.getElementById("powerChart").getContext("2d");

    // Temperature chart
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['9AM', '12PM', '3PM', '6PM', '9PM'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [22, 24, 23, 22, 21],
                borderColor: 'red',
                fill: false
            }]
        }
    });

    // Humidity chart
    new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['9AM', '12PM', '3PM', '6PM', '9PM'],
            datasets: [{
                label: 'Humidity (%)',
                data: [55, 60, 58, 57, 56],
                borderColor: 'blue',
                fill: false
            }]
        }
    });

    // Power consumption chart
    new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: ['9AM', '12PM', '3PM', '6PM', '9PM'],
            datasets: [{
                label: 'Power Consumption (kWh)',
                data: [2.1, 2.5, 2.4, 2.2, 2.0],
                backgroundColor: 'green'
            }]
        }
    });
});
