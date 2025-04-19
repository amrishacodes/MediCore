// Load and display appointments with Edit/Delete options
async function loadPage(page) {
  const content = document.getElementById('main-content');
  if (page === 'appointments') {
    const response = await fetch('http://localhost:5000/api/appointments');
    const appointments = await response.json();

    let html = '<h2>Appointments</h2>';
    html += `<form id="addAppointmentForm" class="crud-form">
      <input type="number" id="patient_id" placeholder="Patient ID" required />
      <input type="number" id="doctor_id" placeholder="Doctor ID" required />
      <input type="date" id="appointment_date" required />
      <input type="time" id="appointment_time" required />
      <input type="text" id="status" placeholder="Status" required />
      <input type="hidden" id="editing_id" />
      <button type="submit">Save Appointment</button>
    </form>`;

    html += '<table><thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    appointments.forEach(a => {
      html += `<tr>
        <td>${a.patient_name}</td>
        <td>${a.doctor_name}</td>
        <td>${a.appointment_date}</td>
        <td>${a.appointment_time}</td>
        <td>${a.status}</td>
        <td>
          <button onclick="editAppointment(${a.appointment_id}, ${a.patient_id}, ${a.doctor_id}, '${a.appointment_date}', '${a.appointment_time}', '${a.status}')">✏️</button>
          <button onclick="deleteAppointment(${a.appointment_id})">🗑️</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';

    content.innerHTML = html;

    document.getElementById('addAppointmentForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const appointmentData = {
        patient_id: document.getElementById('patient_id').value,
        doctor_id: document.getElementById('doctor_id').value,
        appointment_date: document.getElementById('appointment_date').value,
        appointment_time: document.getElementById('appointment_time').value,
        status: document.getElementById('status').value
      };

      const editingId = document.getElementById('editing_id').value;
      const url = editingId ? `http://localhost:5000/api/appointments/${editingId}` : 'http://localhost:5000/api/appointments';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });

      if (res.ok) {
        alert(editingId ? 'Appointment updated!' : 'Appointment added!');
        loadPage('appointments');
      } else {
        alert('Error saving appointment.');
      }
    });
  }
}

// Edit appointment
function editAppointment(id, patient_id, doctor_id, date, time, status) {
  document.getElementById('patient_id').value = patient_id;
  document.getElementById('doctor_id').value = doctor_id;
  document.getElementById('appointment_date').value = date;
  document.getElementById('appointment_time').value = time;
  document.getElementById('status').value = status;
  document.getElementById('editing_id').value = id;
}

// Delete appointment
async function deleteAppointment(id) {
  if (!confirm('Are you sure you want to delete this appointment?')) return;
  const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    alert('Appointment deleted!');
    loadPage('appointments');
  } else {
    alert('Error deleting appointment.');
  }
}
