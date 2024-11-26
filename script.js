// Replace these with your ThingSpeak channel and API key
const apiUrl = "https://api.thingspeak.com/channels/YOUR_CHANNEL_ID/feeds.json?api_key=YOUR_API_KEY&results=10";

document.addEventListener("DOMContentLoaded", () => {
    const btnGraphs = document.getElementById("btn-graphs");
    const btnDigitalOutput = document.getElementById("btn-digital-output");
    const btnBoth = document.getElementById("btn-both");
    const content = document.getElementById("content");

    async function fetchData() {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.feeds;
    }

    btnGraphs.addEventListener("click", async () => {
        const data = await fetchData();
        const labels = data.map(feed => feed.created_at);
        const temperature = data.map(feed => feed.field1);
        const voltage = data.map(feed => feed.field2);
        const current = data.map(feed => feed.field3);

        content.innerHTML = `
            <canvas id="graphCanvas"></canvas>
        `;
        drawGraphs(labels, temperature, voltage, current);
    });

    btnDigitalOutput.addEventListener("click", async () => {
        const data = await fetchData();
        const latest = data[data.length - 1];
        content.innerHTML = `
            <p>Temperature: ${latest.field1} °C</p>
            <p>Voltage: ${latest.field2} V</p>
            <p>Current: ${latest.field3} A</p>
        `;
    });

    btnBoth.addEventListener("click", async () => {
        const data = await fetchData();
        btnGraphs.click();
        btnDigitalOutput.click();
    });
});

function drawGraphs(labels, temperature, voltage, current) {
    const ctx = document.getElementById("graphCanvas").getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperature,
                    borderColor: 'red',
                    borderWidth: 1,
                },
                {
                    label: 'Voltage (V)',
                    data: voltage,
                    borderColor: 'blue',
                    borderWidth: 1,
                },
                {
                    label: 'Current (A)',
                    data: current,
                    borderColor: 'green',
                    borderWidth: 1,
                }
            ]
        }
    });
}
