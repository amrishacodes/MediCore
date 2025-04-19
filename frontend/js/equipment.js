// Load and display equipment with Edit/Delete options
async function loadPage(page) {
  const content = document.getElementById('main-content');
  if (page === 'equipment') {
    const response = await fetch('http://localhost:5000/api/equipment');
    const equipment = await response.json();

    let html = '<h2>Equipment</h2>';
    html += `<form id="addEquipmentForm" class="crud-form">
      <input type="text" id="name" placeholder="Name" required />
      <input type="text" id="type" placeholder="Type" required />
      <input type="date" id="purchase_date" required />
      <input type="number" id="department_id" placeholder="Department ID" required />
      <input type="text" id="status" placeholder="Status (Available/In Use)" required />
      <input type="hidden" id="editing_id" />
      <button type="submit">Save Equipment</button>
    </form>`;

    html += '<table><thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Department</th><th>Actions</th></tr></thead><tbody>';
    equipment.forEach(e => {
      html += `<tr>
        <td>${e.name}</td>
        <td>${e.type}</td>
        <td>${e.status}</td>
        <td>${e.department_name}</td>
        <td>
          <button onclick="editEquipment(${e.equipment_id}, '${e.name}', '${e.type}', '${e.purchase_date}', ${e.department_id}, '${e.status}')">✏️</button>
          <button onclick="deleteEquipment(${e.equipment_id})">🗑️</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';

    content.innerHTML = html;

    document.getElementById('addEquipmentForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const equipmentData = {
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        purchase_date: document.getElementById('purchase_date').value,
        department_id: document.getElementById('department_id').value,
        status: document.getElementById('status').value
      };

      const editingId = document.getElementById('editing_id').value;
      const url = editingId ? `http://localhost:5000/api/equipment/${editingId}` : 'http://localhost:5000/api/equipment';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipmentData)
      });

      if (res.ok) {
        alert(editingId ? 'Equipment updated!' : 'Equipment added!');
        loadPage('equipment');
      } else {
        alert('Error saving equipment.');
      }
    });
  }
}

function editEquipment(id, name, type, purchase_date, dept, status) {
  document.getElementById('name').value = name;
  document.getElementById('type').value = type;
  document.getElementById('purchase_date').value = purchase_date;
  document.getElementById('department_id').value = dept;
  document.getElementById('status').value = status;
  document.getElementById('editing_id').value = id;
}

async function deleteEquipment(id) {
  if (!confirm('Delete this equipment?')) return;
  const res = await fetch(`http://localhost:5000/api/equipment/${id}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    alert('Equipment deleted!');
    loadPage('equipment');
  } else {
    alert('Error deleting equipment.');
  }
}
