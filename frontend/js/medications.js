// Load and display medications with Edit/Delete options
async function loadPage(page) {
  const content = document.getElementById('main-content');
  if (page === 'pharmacy') {
    const response = await fetch('http://localhost:5000/api/medications');
    const meds = await response.json();

    let html = '<h2>Pharmacy Inventory</h2>';
    html += `<form id="addMedForm" class="crud-form">
      <input type="text" id="name" placeholder="Medicine Name" required />
      <input type="text" id="description" placeholder="Description" required />
      <input type="text" id="dosage_form" placeholder="Dosage Form" required />
      <input type="text" id="strength" placeholder="Strength" required />
      <input type="number" id="price" placeholder="Price" step="0.01" required />
      <input type="hidden" id="editing_id" />
      <button type="submit">Save Medicine</button>
    </form>`;

    html += '<table><thead><tr><th>Name</th><th>Strength</th><th>Form</th><th>Price</th><th>Actions</th></tr></thead><tbody>';
    meds.forEach(m => {
      html += `<tr>
        <td>${m.name}</td>
        <td>${m.strength}</td>
        <td>${m.dosage_form}</td>
        <td>₹${m.price}</td>
        <td>
          <button onclick="editMed(${m.medication_id}, '${m.name}', '${m.description}', '${m.dosage_form}', '${m.strength}', ${m.price})">✏️</button>
          <button onclick="deleteMed(${m.medication_id})">🗑️</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';

    content.innerHTML = html;

    document.getElementById('addMedForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const medData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        dosage_form: document.getElementById('dosage_form').value,
        strength: document.getElementById('strength').value,
        price: document.getElementById('price').value
      };

      const editingId = document.getElementById('editing_id').value;
      const url = editingId ? `http://localhost:5000/api/medications/${editingId}` : 'http://localhost:5000/api/medications';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medData)
      });

      if (res.ok) {
        alert(editingId ? 'Medicine updated!' : 'Medicine added!');
        loadPage('pharmacy');
      } else {
        alert('Error saving medicine.');
      }
    });
  }
}

function editMed(id, name, desc, form, strength, price) {
  document.getElementById('name').value = name;
  document.getElementById('description').value = desc;
  document.getElementById('dosage_form').value = form;
  document.getElementById('strength').value = strength;
  document.getElementById('price').value = price;
  document.getElementById('editing_id').value = id;
}

async function deleteMed(id) {
  if (!confirm('Delete this medicine?')) return;
  const res = await fetch(`http://localhost:5000/api/medications/${id}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    alert('Medicine deleted!');
    loadPage('pharmacy');
  } else {
    alert('Error deleting medicine.');
  }
}
