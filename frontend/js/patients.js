// Load and display patients with Edit/Delete options
async function loadPage(page) {
  const content = document.getElementById('main-content');
  if (page === 'patients') {
    const response = await fetch('http://localhost:5000/api/patients');
    const patients = await response.json();

    let html = '<h2>Patients</h2>';
    html += `<form id="addPatientForm" class="crud-form">
      <input type="text" id="first_name" placeholder="First Name" required />
      <input type="text" id="last_name" placeholder="Last Name" required />
      <input type="date" id="date_of_birth" required />
      <input type="text" id="gender" placeholder="Gender" required />
      <input type="text" id="contact_number" placeholder="Contact Number" required />
      <input type="email" id="email" placeholder="Email" required />
      <input type="text" id="address" placeholder="Address" required />
      <input type="text" id="emergency_contact" placeholder="Emergency Contact" required />
      <input type="number" id="insurance_id" placeholder="Insurance ID" required />
      <input type="hidden" id="editing_id" />
      <button type="submit">Save Patient</button>
    </form>`;

    html += '<table><thead><tr><th>Name</th><th>DOB</th><th>Gender</th><th>Actions</th></tr></thead><tbody>';
    patients.forEach(p => {
      html += `<tr>
        <td>${p.first_name} ${p.last_name}</td>
        <td>${p.date_of_birth}</td>
        <td>${p.gender}</td>
        <td>
          <button onclick="editPatient(${p.patient_id}, '${p.first_name}', '${p.last_name}', '${p.date_of_birth}', '${p.gender}', '${p.contact_number}', '${p.email}', '${p.address}', '${p.emergency_contact}', ${p.insurance_id})">✏️</button>
          <button onclick="deletePatient(${p.patient_id})">🗑️</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';

    content.innerHTML = html;

    document.getElementById('addPatientForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const patientData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        date_of_birth: document.getElementById('date_of_birth').value,
        gender: document.getElementById('gender').value,
        contact_number: document.getElementById('contact_number').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        emergency_contact: document.getElementById('emergency_contact').value,
        insurance_id: document.getElementById('insurance_id').value
      };

      const editingId = document.getElementById('editing_id').value;
      const url = editingId ? `http://localhost:5000/api/patients/${editingId}` : 'http://localhost:5000/api/patients';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });

      if (res.ok) {
        alert(editingId ? 'Patient updated!' : 'Patient added!');
        loadPage('patients');
      } else {
        alert('Error saving patient.');
      }
    });
  }
}

// Pre-fill form for editing patient
function editPatient(id, first, last, dob, gender, contact, email, address, emergency, insurance) {
  document.getElementById('first_name').value = first;
  document.getElementById('last_name').value = last;
  document.getElementById('date_of_birth').value = dob;
  document.getElementById('gender').value = gender;
  document.getElementById('contact_number').value = contact;
  document.getElementById('email').value = email;
  document.getElementById('address').value = address;
  document.getElementById('emergency_contact').value = emergency;
  document.getElementById('insurance_id').value = insurance;
  document.getElementById('editing_id').value = id;
}

// Delete patient
async function deletePatient(id) {
  if (!confirm('Are you sure you want to delete this patient?')) return;
  const res = await fetch(`http://localhost:5000/api/patients/${id}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    alert('Patient deleted!');
    loadPage('patients');
  } else {
    alert('Error deleting patient.');
  }
}
