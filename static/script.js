// static/script.js
const API = '/data';

async function fetchData() {
  const res = await fetch(API);
  const data = await res.json();

  if (data.length > 0) {
    const latest = data[0];
    document.getElementById('v').textContent = latest.voltage;
    document.getElementById('c').textContent = latest.current;
    document.getElementById('e').textContent = latest.efficiency.toFixed(2);
    document.getElementById('t').textContent = latest.timestamp;
  }

  updateChart(data.reverse());
}

document.getElementById('dataForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const voltage = parseFloat(document.getElementById('voltage').value);
  const current = parseFloat(document.getElementById('current').value);

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voltage, current })
  });

  document.getElementById('dataForm').reset();
  fetchData();
});

let chart;
function updateChart(data) {
  const ctx = document.getElementById('voltageChart').getContext('2d');
  const labels = data.map(d => d.timestamp);
  const values = data.map(d => d.voltage);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Voltage (V)',
        data: values,
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.2)',
        fill: true
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Time' }},
        y: { title: { display: true, text: 'Voltage (V)' }, beginAtZero: true }
      }
    }
  });
}

fetchData();
setInterval(fetchData, 5000);
