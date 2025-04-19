const mysql = require('mysql2/promise');
require('dotenv').config();

async function insertSampleData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'HospitalDB'
  });

  try {
    // Insert Departments
    await connection.query(`
      INSERT INTO Departments (department_name, description) VALUES 
      ('Cardiology', 'Heart and cardiovascular system specialists'),
      ('Neurology', 'Brain and nervous system specialists'),
      ('Pediatrics', 'Medical care for children and adolescents'),
      ('Orthopedics', 'Bone and joint specialists'),
      ('Oncology', 'Cancer treatment and care')
    `);

    // Insert Doctors
    await connection.query(`
      INSERT INTO Doctors (first_name, last_name, specialization, department_id, contact_number, email) VALUES 
      ('John', 'Smith', 'Cardiologist', 1, '+1-555-0123', 'john.smith@hospital.com'),
      ('Sarah', 'Johnson', 'Neurologist', 2, '+1-555-0124', 'sarah.j@hospital.com'),
      ('Michael', 'Brown', 'Pediatrician', 3, '+1-555-0125', 'michael.b@hospital.com'),
      ('Emily', 'Davis', 'Orthopedic Surgeon', 4, '+1-555-0126', 'emily.d@hospital.com'),
      ('David', 'Wilson', 'Oncologist', 5, '+1-555-0127', 'david.w@hospital.com')
    `);

    // Insert Patients
    await connection.query(`
      INSERT INTO Patients (first_name, last_name, date_of_birth, gender, contact_number, email, address) VALUES 
      ('Alice', 'Thompson', '1985-03-15', 'Female', '+1-555-1111', 'alice.t@email.com', '123 Main St'),
      ('Bob', 'Anderson', '1978-07-22', 'Male', '+1-555-2222', 'bob.a@email.com', '456 Oak Ave'),
      ('Carol', 'Martinez', '1990-11-30', 'Female', '+1-555-3333', 'carol.m@email.com', '789 Pine Rd'),
      ('Daniel', 'Lee', '1982-09-05', 'Male', '+1-555-4444', 'daniel.l@email.com', '321 Elm St'),
      ('Eva', 'Garcia', '1995-04-18', 'Female', '+1-555-5555', 'eva.g@email.com', '654 Maple Dr')
    `);

    // Insert Appointments
    await connection.query(`
      INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, status, notes) VALUES 
      (1, 1, '2024-03-20', '09:00:00', 'Scheduled', 'Regular checkup'),
      (2, 3, '2024-03-21', '10:30:00', 'Scheduled', 'Follow-up'),
      (3, 2, '2024-03-22', '14:00:00', 'Scheduled', 'Initial consultation'),
      (4, 4, '2024-03-23', '11:15:00', 'Scheduled', 'Post-surgery checkup'),
      (5, 5, '2024-03-24', '15:45:00', 'Scheduled', 'Treatment review')
    `);

    // Insert Equipment
    await connection.query(`
      INSERT INTO Equipment (name, type, purchase_date, department_id, status) VALUES 
      ('MRI Scanner', 'Imaging', '2023-01-15', 2, 'Available'),
      ('X-Ray Machine', 'Imaging', '2023-02-20', 4, 'Available'),
      ('ECG Machine', 'Diagnostic', '2023-03-10', 1, 'In Use'),
      ('Ventilator', 'Life Support', '2023-04-05', 3, 'Available'),
      ('CT Scanner', 'Imaging', '2023-05-12', 5, 'Available')
    `);

    // Insert Medications
    await connection.query(`
      INSERT INTO Medications (name, description, quantity, unit_price, expiry_date) VALUES 
      ('Aspirin', 'Pain reliever and blood thinner', 1000, 0.50, '2025-12-31'),
      ('Amoxicillin', 'Antibiotic', 500, 2.75, '2025-06-30'),
      ('Insulin', 'Diabetes medication', 200, 15.00, '2025-03-31'),
      ('Ibuprofen', 'Anti-inflammatory', 800, 0.75, '2025-09-30'),
      ('Omeprazole', 'Acid reflux medication', 300, 1.25, '2025-08-31')
    `);

    // Insert Billing
    await connection.query(`
      INSERT INTO Billing (patient_id, bill_date, total_amount, amount_paid, payment_status) VALUES 
      (1, '2024-03-01', 1500.00, 1500.00, 'Paid'),
      (2, '2024-03-05', 2000.00, 1000.00, 'Partial'),
      (3, '2024-03-10', 800.00, 800.00, 'Paid'),
      (4, '2024-03-15', 3000.00, 0.00, 'Pending'),
      (5, '2024-03-18', 1200.00, 1200.00, 'Paid')
    `);

    console.log('✅ Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  } finally {
    await connection.end();
  }
}

insertSampleData(); 