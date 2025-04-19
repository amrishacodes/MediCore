// Render Dashboard Summary
async function loadPage(page) {
  const content = document.getElementById('main-content');
  if (page === 'dashboard') {
    content.innerHTML = `
      <h2>Hospital Dashboard</h2>
      <div class="dashboard-cards">
        <div class="card">🧑‍⚕️ <h3 id="total-doctors">Doctors: ...</h3></div>
        <div class="card">👨‍👩‍👧‍👦 <h3 id="total-patients">Patients: ...</h3></div>
        <div class="card">📅 <h3 id="total-appointments">Appointments: ...</h3></div>
        <div class="card">💵 <h3 id="total-bills">Total Revenue: ...</h3></div>
      </div>
      <canvas id="chart" width="600" height="300"></canvas>
    `;

    // Load stats
    const [doctors, patients, appointments, bills] = await Promise.all([
      fetch('http://localhost:5000/api/doctors').then(res => res.json()),
      fetch('http://localhost:5000/api/patients').then(res => res.json()),
      fetch('http://localhost:5000/api/appointments').then(res => res.json()),
      fetch('http://localhost:5000/api/billing').then(res => res.json())
    ]);

    document.getElementById('total-doctors').textContent = "Doctors: " + doctors.length;
    document.getElementById('total-patients').textContent = "Patients: " + patients.length;
    document.getElementById('total-appointments').textContent = "Appointments: " + appointments.length;

    const totalRevenue = bills.reduce((sum, bill) => sum + parseFloat(bill.amount_paid || 0), 0);
    document.getElementById('total-bills').textContent = "Total Revenue: ₹" + totalRevenue.toFixed(2);

    // Render chart
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Doctors', 'Patients', 'Appointments', 'Revenue'],
        datasets: [{
          label: 'Hospital Overview',
          data: [doctors.length, patients.length, appointments.length, totalRevenue],
          backgroundColor: ['#36a2eb', '#4bc0c0', '#ffcd56', '#ff6384']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}
