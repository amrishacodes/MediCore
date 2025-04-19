// Load and display bills with Edit/Delete options
async function loadPage(page) {
  const content = document.getElementById('main-content');
  if (page === 'billing') {
    const response = await fetch('http://localhost:5000/api/billing');
    const bills = await response.json();

    let html = '<h2>Billing</h2>';
    html += `<form id="addBillForm" class="crud-form">
      <input type="number" id="patient_id" placeholder="Patient ID" required />
      <input type="date" id="bill_date" required />
      <input type="number" id="total_amount" placeholder="Total Amount" required />
      <input type="number" id="amount_paid" placeholder="Amount Paid" required />
      <input type="text" id="payment_status" placeholder="Status (Paid/Unpaid)" required />
      <input type="hidden" id="editing_id" />
      <button type="submit">Save Bill</button>
    </form>`;

    html += '<table><thead><tr><th>Patient</th><th>Date</th><th>Total</th><th>Paid</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    bills.forEach(b => {
      html += `<tr>
        <td>${b.patient_name}</td>
        <td>${b.bill_date}</td>
        <td>₹${b.total_amount}</td>
        <td>₹${b.amount_paid}</td>
        <td>${b.payment_status}</td>
        <td>
          <button onclick="editBill(${b.bill_id}, ${b.patient_id}, '${b.bill_date}', ${b.total_amount}, ${b.amount_paid}, '${b.payment_status}')">✏️</button>
          <button onclick="deleteBill(${b.bill_id})">🗑️</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';

    content.innerHTML = html;

    document.getElementById('addBillForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const billData = {
        patient_id: document.getElementById('patient_id').value,
        bill_date: document.getElementById('bill_date').value,
        total_amount: document.getElementById('total_amount').value,
        amount_paid: document.getElementById('amount_paid').value,
        payment_status: document.getElementById('payment_status').value
      };

      const editingId = document.getElementById('editing_id').value;
      const url = editingId ? `http://localhost:5000/api/billing/${editingId}` : 'http://localhost:5000/api/billing';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData)
      });

      if (res.ok) {
        alert(editingId ? 'Bill updated!' : 'Bill added!');
        loadPage('billing');
      } else {
        alert('Error saving bill.');
      }
    });
  }
}

// Pre-fill form for editing bill
function editBill(id, patient_id, date, total, paid, status) {
  document.getElementById('patient_id').value = patient_id;
  document.getElementById('bill_date').value = date;
  document.getElementById('total_amount').value = total;
  document.getElementById('amount_paid').value = paid;
  document.getElementById('payment_status').value = status;
  document.getElementById('editing_id').value = id;
}

// Delete bill
async function deleteBill(id) {
  if (!confirm('Are you sure you want to delete this bill?')) return;
  const res = await fetch(`http://localhost:5000/api/billing/${id}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    alert('Bill deleted!');
    loadPage('billing');
  } else {
    alert('Error deleting bill.');
  }
}
