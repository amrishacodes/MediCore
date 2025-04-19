// API base URL - will be determined dynamically
let API_URL = '';

// Function to detect available port
async function detectApiPort() {
    const ports = [50011, 5001, 5000, 5002, 5003, 5004, 5005];
    
    for (const port of ports) {
        try {
            const response = await fetch(`http://localhost:${port}/api/health`);
            if (response.ok) {
                API_URL = `http://localhost:${port}/api`;
                console.log(`✅ API detected on port ${port}`);
                return true;
            }
        } catch (error) {
            console.log(`Port ${port} not available`);
        }
    }
    return false;
}

// Function to check API availability
async function checkApiAvailability() {
    try {
        if (!API_URL) {
            const portFound = await detectApiPort();
            if (!portFound) {
                throw new Error('API not available on any known port');
            }
        }
        const response = await fetch(`${API_URL}/health`);
        if (!response.ok) throw new Error('API not available');
        return true;
    } catch (error) {
        console.error('API connection error:', error);
        return false;
    }
}

// Function to handle API errors
function handleApiError(error) {
    console.error('API Error:', error);
    document.querySelectorAll('.card p').forEach(p => {
        p.textContent = 'Error loading data';
        p.style.color = 'red';
    });
}

// Function to update API URL based on server response
async function updateApiUrl() {
    try {
        const response = await fetch('http://localhost:50011/api/health');
        if (!response.ok) throw new Error('Port 50011 not available');
        API_URL = 'http://localhost:50011/api';
        console.log('Using API URL:', API_URL);
    } catch (error) {
        console.error('Error updating API URL:', error);
        throw error;
    }
}

// Generic delete function
async function deleteRecord(endpoint, id) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete record');
        return true;
    } catch (error) {
        console.error('Error deleting record:', error);
        return false;
    }
}

// Generic update function
async function updateRecord(endpoint, id, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update record');
        return await response.json();
    } catch (error) {
        console.error('Error updating record:', error);
        return null;
    }
}

// Generic create function
async function createRecord(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create record');
        return await response.json();
    } catch (error) {
        console.error('Error creating record:', error);
        return null;
    }
}

// Load page content
async function loadPage(page) {
    const content = document.getElementById('main-content');
    
    // Show loading indicator
    content.innerHTML = `
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <div class="loading-text">Connecting to server...</div>
        </div>
    `;
    
    try {
        const isApiAvailable = await checkApiAvailability();
        if (!isApiAvailable) {
            throw new Error('API is not available. Please check if the server is running.');
        }

        switch(page) {
            case 'dashboard':
                await loadDashboard();
                break;
            case 'patients':
                await loadPatients();
                break;
            case 'doctors':
                await loadDoctors();
                break;
            case 'appointments':
                await loadAppointments();
                break;
            case 'equipment':
                await loadEquipment();
                break;
            case 'medications':
                await loadMedications();
                break;
            case 'billing':
                await loadBilling();
                break;
            default:
                content.innerHTML = `<h2>Page not found</h2>`;
        }
    } catch (error) {
        console.error('Error loading page:', error);
        content.innerHTML = `
            <div class="error-message">
                <h2>Error</h2>
                <p>${error.message}</p>
                <p>Please try again later or contact support if the problem persists.</p>
            </div>
        `;
    }
}

// Delete functions
async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        if (await deleteRecord('patients', id)) {
            loadPage('patients');
        }
    }
}

async function deleteEquipment(id) {
    if (confirm('Are you sure you want to delete this equipment?')) {
        if (await deleteRecord('equipment', id)) {
            loadPage('equipment');
        }
    }
}

// Show modal functions
function showAddPatientModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New Patient</h3>
            <form id="addPatientForm">
                <input type="text" name="first_name" placeholder="First Name" required>
                <input type="text" name="last_name" placeholder="Last Name" required>
                <input type="date" name="date_of_birth" required>
                <select name="gender" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input type="tel" name="contact_number" placeholder="Contact Number">
                <input type="email" name="email" placeholder="Email">
                <textarea name="address" placeholder="Address"></textarea>
                <input type="tel" name="emergency_contact" placeholder="Emergency Contact">
                <div class="modal-actions">
                    <button type="submit">Add Patient</button>
                    <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('addPatientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        if (await createRecord('patients', data)) {
            modal.remove();
            loadPage('patients');
        }
    });
}

function showUpdatePatientModal(id) {
    // Similar to add modal but pre-filled with patient data
    // Will add in next edit
}

// Initialize API URL and load dashboard
updateApiUrl().then(() => {
    loadPage('dashboard');
});

// Delete functions for other sections
async function deleteDoctor(id) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        if (await deleteRecord('doctors', id)) {
            loadPage('doctors');
        }
    }
}

async function deleteAppointment(id) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        if (await deleteRecord('appointments', id)) {
            loadPage('appointments');
        }
    }
}

async function deleteMedication(id) {
    if (confirm('Are you sure you want to delete this medication?')) {
        if (await deleteRecord('medications', id)) {
            loadPage('medications');
        }
    }
}

async function deleteBilling(id) {
    if (confirm('Are you sure you want to delete this bill?')) {
        if (await deleteRecord('billing', id)) {
            loadPage('billing');
        }
    }
}

// Show modal functions for other sections
function showAddDoctorModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New Doctor</h3>
            <form id="addDoctorForm">
                <input type="text" name="first_name" placeholder="First Name" required>
                <input type="text" name="last_name" placeholder="Last Name" required>
                <input type="text" name="specialization" placeholder="Specialization" required>
                <input type="tel" name="contact_number" placeholder="Contact Number">
                <input type="email" name="email" placeholder="Email">
                <select name="department_id" required>
                    <option value="">Select Department</option>
                    <option value="1">Cardiology</option>
                    <option value="2">Neurology</option>
                    <option value="3">Orthopedics</option>
                </select>
                <div class="modal-actions">
                    <button type="submit">Add Doctor</button>
                    <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('addDoctorForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        if (await createRecord('doctors', data)) {
            modal.remove();
            loadPage('doctors');
        }
    });
}

async function showAddAppointmentModal() {
    try {
        // Fetch doctors list
        const doctorsResponse = await fetch(`${API_URL}/doctors`);
        if (!doctorsResponse.ok) {
            throw new Error(`HTTP error! status: ${doctorsResponse.status}`);
        }
        const doctors = await doctorsResponse.json();

        // Fetch patients list
        const patientsResponse = await fetch(`${API_URL}/patients`);
        if (!patientsResponse.ok) {
            throw new Error(`HTTP error! status: ${patientsResponse.status}`);
        }
        const patients = await patientsResponse.json();
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Add New Appointment</h3>
                <form id="addAppointmentForm">
                    <select name="patient_id" required>
                        <option value="">Select Patient</option>
                        ${patients.map(patient => `<option value="${patient.patient_id}">${patient.first_name} ${patient.last_name}</option>`).join('')}
                    </select>
                    <select name="doctor_id" required>
                        <option value="">Select Doctor</option>
                        ${doctors.map(doc => `<option value="${doc.doctor_id}">Dr. ${doc.first_name} ${doc.last_name}</option>`).join('')}
                    </select>
                    <input type="date" name="appointment_date" required>
                    <input type="time" name="appointment_time" required>
                    <select name="status" required>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <div class="modal-actions">
                        <button type="submit">Add Appointment</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('addAppointmentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            if (await createRecord('appointments', data)) {
                modal.remove();
                loadPage('appointments');
            }
        });
    } catch (error) {
        console.error('Error loading appointment form:', error);
        alert('Failed to load appointment form. Please try again.');
    }
}

function showAddMedicationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New Medication</h3>
            <form id="addMedicationForm">
                <input type="text" name="name" placeholder="Medication Name" required>
                <textarea name="description" placeholder="Description"></textarea>
                <input type="text" name="dosage_form" placeholder="Dosage Form" required>
                <input type="text" name="strength" placeholder="Strength" required>
                <input type="number" name="price" placeholder="Price" step="0.01" required>
                <div class="modal-actions">
                    <button type="submit">Add Medication</button>
                    <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('addMedicationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        if (await createRecord('medications', data)) {
            modal.remove();
            loadPage('medications');
        }
    });
}

function showAddBillingModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New Bill</h3>
            <form id="addBillingForm">
                <select name="patient_id" required>
                    <option value="">Select Patient</option>
                    <option value="1">John Doe</option>
                    <option value="2">Jane Smith</option>
                </select>
                <input type="date" name="bill_date" required>
                <input type="number" name="total_amount" placeholder="Total Amount" step="0.01" required>
                <input type="number" name="amount_paid" placeholder="Amount Paid" step="0.01" required>
                <select name="payment_status" required>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Pending">Pending</option>
                </select>
                <div class="modal-actions">
                    <button type="submit">Add Bill</button>
                    <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('addBillingForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        if (await createRecord('billing', data)) {
            modal.remove();
            loadPage('billing');
        }
    });
}

// Update modal functions
async function showUpdatePatientModal(id) {
    try {
        const response = await fetch(`${API_URL}/patients/${id}`);
        if (!response.ok) throw new Error('Failed to fetch patient data');
        const patient = await response.json();

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Update Patient</h3>
                <form id="updatePatientForm">
                    <input type="text" name="first_name" placeholder="First Name" value="${patient.first_name}" required>
                    <input type="text" name="last_name" placeholder="Last Name" value="${patient.last_name}" required>
                    <input type="date" name="date_of_birth" value="${patient.date_of_birth}" required>
                    <select name="gender" required>
                        <option value="Male" ${patient.gender === 'Male' ? 'selected' : ''}>Male</option>
                        <option value="Female" ${patient.gender === 'Female' ? 'selected' : ''}>Female</option>
                        <option value="Other" ${patient.gender === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                    <input type="tel" name="contact_number" placeholder="Contact Number" value="${patient.contact_number || ''}">
                    <input type="email" name="email" placeholder="Email" value="${patient.email || ''}">
                    <textarea name="address" placeholder="Address">${patient.address || ''}</textarea>
                    <input type="tel" name="emergency_contact" placeholder="Emergency Contact" value="${patient.emergency_contact || ''}">
                    <div class="modal-actions">
                        <button type="submit">Update Patient</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('updatePatientForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            if (await updateRecord('patients', id, data)) {
                modal.remove();
                loadPage('patients');
            }
        });
    } catch (error) {
        console.error('Error loading patient data:', error);
        alert('Failed to load patient data. Please try again.');
    }
}

async function showUpdateDoctorModal(id) {
    try {
        const response = await fetch(`${API_URL}/doctors/${id}`);
        if (!response.ok) throw new Error('Failed to fetch doctor data');
        const doctor = await response.json();

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Update Doctor</h3>
                <form id="updateDoctorForm">
                    <input type="text" name="first_name" placeholder="First Name" value="${doctor.first_name}" required>
                    <input type="text" name="last_name" placeholder="Last Name" value="${doctor.last_name}" required>
                    <input type="text" name="specialization" placeholder="Specialization" value="${doctor.specialization}" required>
                    <input type="tel" name="contact_number" placeholder="Contact Number" value="${doctor.contact_number || ''}">
                    <input type="email" name="email" placeholder="Email" value="${doctor.email || ''}">
                    <select name="department_id" required>
                        <option value="1" ${doctor.department_id === 1 ? 'selected' : ''}>Cardiology</option>
                        <option value="2" ${doctor.department_id === 2 ? 'selected' : ''}>Neurology</option>
                        <option value="3" ${doctor.department_id === 3 ? 'selected' : ''}>Orthopedics</option>
                    </select>
                    <div class="modal-actions">
                        <button type="submit">Update Doctor</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('updateDoctorForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            if (await updateRecord('doctors', id, data)) {
                modal.remove();
                loadPage('doctors');
            }
        });
    } catch (error) {
        console.error('Error loading doctor data:', error);
        alert('Failed to load doctor data. Please try again.');
    }
}

async function showUpdateAppointmentModal(id) {
    try {
        // Fetch appointment data
        const response = await fetch(`${API_URL}/appointments/${id}`);
        if (!response.ok) throw new Error('Failed to fetch appointment data');
        const appointment = await response.json();

        // Fetch doctors list
        const doctorsResponse = await fetch(`${API_URL}/doctors`);
        if (!doctorsResponse.ok) throw new Error('Failed to fetch doctors data');
        const doctors = await doctorsResponse.json();

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Update Appointment</h3>
                <form id="updateAppointmentForm">
                    <select name="patient_id" required>
                        <option value="">Select Patient</option>
                        <option value="1" ${appointment.patient_id === 1 ? 'selected' : ''}>John Doe</option>
                        <option value="2" ${appointment.patient_id === 2 ? 'selected' : ''}>Jane Smith</option>
                    </select>
                    <select name="doctor_id" required>
                        <option value="">Select Doctor</option>
                        ${doctors.map(doc => `<option value="${doc.doctor_id}" ${appointment.doctor_id === doc.doctor_id ? 'selected' : ''}>Dr. ${doc.first_name} ${doc.last_name}</option>`).join('')}
                    </select>
                    <input type="date" name="appointment_date" value="${appointment.appointment_date}" required>
                    <input type="time" name="appointment_time" value="${appointment.appointment_time}" required>
                    <select name="status" required>
                        <option value="Scheduled" ${appointment.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                        <option value="Completed" ${appointment.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Cancelled" ${appointment.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <div class="modal-actions">
                        <button type="submit">Update Appointment</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('updateAppointmentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            if (await updateRecord('appointments', id, data)) {
                modal.remove();
                loadPage('appointments');
            }
        });
    } catch (error) {
        console.error('Error loading appointment data:', error);
        alert('Failed to load appointment data. Please try again.');
    }
}

async function showUpdateMedicationModal(id) {
    try {
        const response = await fetch(`${API_URL}/medications/${id}`);
        if (!response.ok) throw new Error('Failed to fetch medication data');
        const medication = await response.json();

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Update Medication</h3>
                <form id="updateMedicationForm">
                    <input type="text" name="name" placeholder="Medication Name" value="${medication.name}" required>
                    <textarea name="description" placeholder="Description">${medication.description || ''}</textarea>
                    <input type="text" name="dosage_form" placeholder="Dosage Form" value="${medication.dosage_form}" required>
                    <input type="text" name="strength" placeholder="Strength" value="${medication.strength}" required>
                    <input type="number" name="price" placeholder="Price" step="0.01" value="${medication.price}" required>
                    <div class="modal-actions">
                        <button type="submit">Update Medication</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('updateMedicationForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            if (await updateRecord('medications', id, data)) {
                modal.remove();
                loadPage('medications');
            }
        });
    } catch (error) {
        console.error('Error loading medication data:', error);
        alert('Failed to load medication data. Please try again.');
    }
}

async function showUpdateBillingModal(id) {
    try {
        const response = await fetch(`${API_URL}/billing/${id}`);
        if (!response.ok) throw new Error('Failed to fetch billing data');
        const bill = await response.json();

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Update Bill</h3>
                <form id="updateBillingForm">
                    <select name="patient_id" required>
                        <option value="1" ${bill.patient_id === 1 ? 'selected' : ''}>John Doe</option>
                        <option value="2" ${bill.patient_id === 2 ? 'selected' : ''}>Jane Smith</option>
                    </select>
                    <input type="date" name="bill_date" value="${bill.bill_date}" required>
                    <input type="number" name="total_amount" placeholder="Total Amount" step="0.01" value="${bill.total_amount}" required>
                    <input type="number" name="amount_paid" placeholder="Amount Paid" step="0.01" value="${bill.amount_paid}" required>
                    <select name="payment_status" required>
                        <option value="Paid" ${bill.payment_status === 'Paid' ? 'selected' : ''}>Paid</option>
                        <option value="Unpaid" ${bill.payment_status === 'Unpaid' ? 'selected' : ''}>Unpaid</option>
                        <option value="Pending" ${bill.payment_status === 'Pending' ? 'selected' : ''}>Pending</option>
                    </select>
                    <div class="modal-actions">
                        <button type="submit">Update Bill</button>
                        <button type="button" onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('updateBillingForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            if (await updateRecord('billing', id, data)) {
                modal.remove();
                loadPage('billing');
            }
        });
    } catch (error) {
        console.error('Error loading billing data:', error);
        alert('Failed to load billing data. Please try again.');
    }
}

// Chart creation functions
function createAppointmentsChart(appointments) {
    const ctx = document.getElementById('appointmentsChart').getContext('2d');
    const statusCounts = appointments.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {});

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Appointments by Status'
                }
            }
        }
    });
}

function createRevenueChart(billing) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Sort billing data by date
    const sortedBilling = [...billing].sort((a, b) => new Date(a.bill_date) - new Date(b.bill_date));
    
    // Group by month
    const monthlyRevenue = sortedBilling.reduce((acc, bill) => {
        const date = new Date(bill.bill_date);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        acc[monthYear] = (acc[monthYear] || 0) + parseFloat(bill.amount_paid || 0);
        return acc;
    }, {});

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(monthlyRevenue),
            datasets: [{
                label: 'Monthly Revenue',
                data: Object.values(monthlyRevenue),
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Monthly Revenue'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

async function loadDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="dashboard-container">
            <h1>Hospital Dashboard</h1>
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-user-injured"></i>
                    <h3>Total Patients</h3>
                    <p id="total-patients">Loading...</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-user-md"></i>
                    <h3>Total Doctors</h3>
                    <p id="total-doctors">Loading...</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-calendar-check"></i>
                    <h3>Appointments</h3>
                    <p id="total-appointments">Loading...</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-money-bill-wave"></i>
                    <h3>Revenue</h3>
                    <p id="total-revenue">Loading...</p>
                </div>
            </div>
            <div class="charts-grid">
                <div class="chart-card">
                    <h3>Revenue Overview</h3>
                    <canvas id="revenueChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Department Distribution</h3>
                    <canvas id="departmentChart"></canvas>
                </div>
            </div>
            <div class="tables-grid">
                <div class="table-card">
                    <h3>Recent Appointments</h3>
                    <div id="recent-appointments"></div>
                </div>
                <div class="table-card">
                    <h3>Low Stock Medications</h3>
                    <div id="low-stock-medications"></div>
                </div>
            </div>
        </div>
    `;

    try {
        // Fetch all required data
        const [patients, doctors, appointments, billing, medications] = await Promise.all([
            fetch('http://localhost:50011/api/patients').then(res => res.json()),
            fetch('http://localhost:50011/api/doctors').then(res => res.json()),
            fetch('http://localhost:50011/api/appointments').then(res => res.json()),
            fetch('http://localhost:50011/api/billing').then(res => res.json()),
            fetch('http://localhost:50011/api/medications').then(res => res.json())
        ]);

        // Update statistics
        document.getElementById('total-patients').textContent = patients.length;
        document.getElementById('total-doctors').textContent = doctors.length;
        document.getElementById('total-appointments').textContent = appointments.length;
        
        // Calculate total revenue
        const totalRevenue = billing.reduce((sum, bill) => sum + parseFloat(bill.amount_paid || 0), 0);
        document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;

        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 21000, 16000, totalRevenue],
                    borderColor: '#4CAF50',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Department Distribution Chart
        const departmentCtx = document.getElementById('departmentChart').getContext('2d');
        new Chart(departmentCtx, {
            type: 'doughnut',
            data: {
                labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Oncology'],
                datasets: [{
                    data: [30, 20, 25, 15, 10],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Recent Appointments Table
        const recentAppointmentsDiv = document.getElementById('recent-appointments');
        const recentAppointmentsHTML = `
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${appointments.slice(0, 5).map(apt => `
                        <tr>
                            <td>${patients.find(p => p.patient_id === apt.patient_id)?.first_name || 'Unknown'}</td>
                            <td>${doctors.find(d => d.doctor_id === apt.doctor_id)?.first_name || 'Unknown'}</td>
                            <td>${new Date(apt.appointment_date).toLocaleDateString()}</td>
                            <td><span class="status-${apt.status.toLowerCase()}">${apt.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        recentAppointmentsDiv.innerHTML = recentAppointmentsHTML;

        // Low Stock Medications Table
        const lowStockMedicationsDiv = document.getElementById('low-stock-medications');
        const lowStockMedicationsHTML = `
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>Medication</th>
                        <th>Quantity</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${medications.filter(med => med.quantity < 300).map(med => `
                        <tr>
                            <td>${med.name}</td>
                            <td>${med.quantity}</td>
                            <td><span class="status-${med.quantity < 100 ? 'critical' : 'warning'}">
                                ${med.quantity < 100 ? 'Critical' : 'Low'}
                            </span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        lowStockMedicationsDiv.innerHTML = lowStockMedicationsHTML;

    } catch (error) {
        console.error('Error loading dashboard:', error);
        mainContent.innerHTML = '<div class="error-message">Error loading dashboard data</div>';
    }
}

async function loadPatients() {
    const content = document.getElementById('main-content');
    try {
        const response = await fetch(`${API_URL}/patients`);
        if (!response.ok) throw new Error('Failed to fetch patients');
        const patients = await response.json();

        content.innerHTML = `
            <h2>Patients</h2>
            <div class="controls">
                <input type="text" class="search-input" placeholder="Search patients...">
                <button class="add-btn" onclick="showAddPatientModal()">Add Patient</button>
            </div>
            <div id="patients-list"></div>
        `;

        const patientsList = document.getElementById('patients-list');
        patients.forEach(patient => {
            patientsList.innerHTML += `
                <div class="patient-card">
                    <h3>${patient.first_name} ${patient.last_name}</h3>
                    <p>DOB: ${new Date(patient.date_of_birth).toLocaleDateString()}</p>
                    <p>Gender: ${patient.gender}</p>
                    <p>Contact: ${patient.contact_number || 'N/A'}</p>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="showUpdatePatientModal(${patient.patient_id})">Edit</button>
                        <button class="delete-btn" onclick="deletePatient(${patient.patient_id})">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading patients:', error);
        content.innerHTML = `<div class="error-message">Error loading patients. Please try again.</div>`;
    }
}

async function loadDoctors() {
    const content = document.getElementById('main-content');
    try {
        const response = await fetch(`${API_URL}/doctors`);
        if (!response.ok) throw new Error('Failed to fetch doctors');
        const doctors = await response.json();

        content.innerHTML = `
            <h2>Doctors</h2>
            <div class="controls">
                <input type="text" class="search-input" placeholder="Search doctors...">
                <button class="add-btn" onclick="showAddDoctorModal()">Add Doctor</button>
            </div>
            <div id="doctors-list"></div>
        `;

        const doctorsList = document.getElementById('doctors-list');
        doctors.forEach(doctor => {
            doctorsList.innerHTML += `
                <div class="doctor-card">
                    <h3>Dr. ${doctor.first_name} ${doctor.last_name}</h3>
                    <p>Specialization: ${doctor.specialization}</p>
                    <p>Contact: ${doctor.contact_number || 'N/A'}</p>
                    <p>Email: ${doctor.email || 'N/A'}</p>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="showUpdateDoctorModal(${doctor.doctor_id})">Edit</button>
                        <button class="delete-btn" onclick="deleteDoctor(${doctor.doctor_id})">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading doctors:', error);
        content.innerHTML = `<div class="error-message">Error loading doctors. Please try again.</div>`;
    }
}

async function loadAppointments() {
    const content = document.getElementById('main-content');
    try {
        const response = await fetch(`${API_URL}/appointments`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const appointments = await response.json();

        content.innerHTML = `
            <h2>Appointments</h2>
            <div class="controls">
                <input type="text" class="search-input" placeholder="Search appointments...">
                <button class="add-btn" onclick="showAddAppointmentModal()">Add Appointment</button>
            </div>
            <div id="appointments-list"></div>
        `;

        const appointmentsList = document.getElementById('appointments-list');
        appointments.forEach(appointment => {
            appointmentsList.innerHTML += `
                <div class="appointment-card">
                    <h3>Appointment #${appointment.appointment_id}</h3>
                    <p>Patient: ${appointment.patient_first_name} ${appointment.patient_last_name}</p>
                    <p>Doctor: Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}</p>
                    <p>Date: ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
                    <p>Time: ${appointment.appointment_time}</p>
                    <p>Status: ${appointment.status}</p>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="showUpdateAppointmentModal(${appointment.appointment_id})">Edit</button>
                        <button class="delete-btn" onclick="deleteAppointment(${appointment.appointment_id})">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading appointments:', error);
        content.innerHTML = `<div class="error-message">Error loading appointments. Please try again.</div>`;
    }
}

async function loadEquipment() {
    const content = document.getElementById('main-content');
    try {
        const response = await fetch(`${API_URL}/equipment`);
        if (!response.ok) throw new Error('Failed to fetch equipment');
        const equipment = await response.json();

        content.innerHTML = `
            <h2>Equipment</h2>
            <div class="controls">
                <input type="text" class="search-input" placeholder="Search equipment...">
                <button class="add-btn" onclick="showAddEquipmentModal()">Add Equipment</button>
            </div>
            <div id="equipment-list"></div>
        `;

        const equipmentList = document.getElementById('equipment-list');
        equipment.forEach(item => {
            equipmentList.innerHTML += `
                <div class="equipment-card">
                    <h3>${item.name}</h3>
                    <p>Status: ${item.status}</p>
                    <p>Last Maintenance: ${new Date(item.last_maintenance_date).toLocaleDateString()}</p>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="showUpdateEquipmentModal(${item.equipment_id})">Edit</button>
                        <button class="delete-btn" onclick="deleteEquipment(${item.equipment_id})">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading equipment:', error);
        content.innerHTML = `<div class="error-message">Error loading equipment. Please try again.</div>`;
    }
}

async function loadMedications() {
    const content = document.getElementById('main-content');
    try {
        const response = await fetch(`${API_URL}/medications`);
        if (!response.ok) throw new Error('Failed to fetch medications');
        const medications = await response.json();

        content.innerHTML = `
            <h2>Medications</h2>
            <div class="controls">
                <input type="text" class="search-input" placeholder="Search medications...">
                <button class="add-btn" onclick="showAddMedicationModal()">Add Medication</button>
            </div>
            <div id="meds-list"></div>
        `;

        const medsList = document.getElementById('meds-list');
        medications.forEach(med => {
            medsList.innerHTML += `
                <div class="medication-card">
                    <h3>${med.name}</h3>
                    <p>Dosage: ${med.dosage_form}</p>
                    <p>Strength: ${med.strength}</p>
                    <p>Price: ₹${med.price}</p>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="showUpdateMedicationModal(${med.medication_id})">Edit</button>
                        <button class="delete-btn" onclick="deleteMedication(${med.medication_id})">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading medications:', error);
        content.innerHTML = `<div class="error-message">Error loading medications. Please try again.</div>`;
    }
}

async function loadBilling() {
    const content = document.getElementById('main-content');
    try {
        const response = await fetch(`${API_URL}/billing`);
        if (!response.ok) throw new Error('Failed to fetch billing');
        const bills = await response.json();

        content.innerHTML = `
            <h2>Billing</h2>
            <div class="controls">
                <input type="text" class="search-input" placeholder="Search bills...">
                <button class="add-btn" onclick="showAddBillingModal()">Add Bill</button>
            </div>
            <div id="billing-list"></div>
        `;

        const billingList = document.getElementById('billing-list');
        bills.forEach(bill => {
            billingList.innerHTML += `
                <div class="bill-card">
                    <h3>Bill #${bill.bill_id}</h3>
                    <p>Date: ${new Date(bill.bill_date).toLocaleDateString()}</p>
                    <p>Total Amount: ₹${bill.total_amount}</p>
                    <p>Amount Paid: ₹${bill.amount_paid}</p>
                    <p>Status: ${bill.payment_status}</p>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="showUpdateBillingModal(${bill.bill_id})">Edit</button>
                        <button class="delete-btn" onclick="deleteBilling(${bill.bill_id})">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading billing:', error);
        content.innerHTML = `<div class="error-message">Error loading billing. Please try again.</div>`;
    }
}
