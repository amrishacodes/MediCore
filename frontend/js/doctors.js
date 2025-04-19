// Load and display doctors with Edit/Delete options
async function loadPage(page) {
  const content = document.getElementById('main-content');
  if (page === 'doctors') {
    const response = await fetch('http://localhost:5000/api/doctors');
    const doctors = await response.json();

    let html = '<h2>Doctors</h2>';
    html += `<form id="addDoctorForm" class="crud-form">
      <input type="text" id="first_name" placeholder="First Name" required />
      <input type="text" id="last_name" placeholder="Last Name" required />
      <input type="number" id="department_id" placeholder="Department ID" required />
      <input type="text" id="contact_number" placeholder="Contact Number" required />
      <input type="email" id="email" placeholder="Email" required />
      <input type="text" id="specialization" placeholder="Specialization" required />
      <input type="hidden" id="editing_id" />
      <button type="submit">Save Doctor</button>
    </form>`;

    html += '<table><thead><tr><th>Name</th><th>Specialization</th><th>Contact</th><th>Actions</th></tr></thead><tbody>';
    doctors.forEach(doc => {
      html += `<tr>
        <td>${doc.first_name} ${doc.last_name}</td>
        <td>${doc.specialization}</td>
        <td>${doc.contact_number}</td>
        <td>
          <button onclick="editDoctor(${doc.doctor_id}, '${doc.first_name}', '${doc.last_name}', ${doc.department_id}, '${doc.contact_number}', '${doc.email}', '${doc.specialization}')">✏️</button>
          <button onclick="deleteDoctor(${doc.doctor_id})">🗑️</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';

    content.innerHTML = html;

    document.getElementById('addDoctorForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const doctorData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        department_id: document.getElementById('department_id').value,
        contact_number: document.getElementById('contact_number').value,
        email: document.getElementById('email').value,
        specialization: document.getElementById('specialization').value
      };

      const editingId = document.getElementById('editing_id').value;
      const url = editingId ? `http://localhost:5000/api/doctors/${editingId}` : 'http://localhost:5000/api/doctors';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData)
      });

      if (res.ok) {
        alert(editingId ? 'Doctor updated!' : 'Doctor added!');
        loadPage('doctors');
      } else {
        alert('Error saving doctor.');
      }
    });
  }
}

// Pre-fill form for editing
function editDoctor(id, first, last, dept, contact, email, spec) {
  document.getElementById('first_name').value = first;
  document.getElementById('last_name').value = last;
  document.getElementById('department_id').value = dept;
  document.getElementById('contact_number').value = contact;
  document.getElementById('email').value = email;
  document.getElementById('specialization').value = spec;
  document.getElementById('editing_id').value = id;
}

// Delete doctor
async function deleteDoctor(id) {
  if (!confirm('Are you sure you want to delete this doctor?')) return;
  const res = await fetch(`http://localhost:5000/api/doctors/${id}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    alert('Doctor deleted!');
    loadPage('doctors');
  } else {
    alert('Error deleting doctor.');
  }
}
