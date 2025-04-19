const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  // Create connection without specifying database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'HospitalDB'}`);
    await connection.query(`USE ${process.env.DB_NAME || 'HospitalDB'}`);

    // Create Departments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Departments (
        department_id INT AUTO_INCREMENT PRIMARY KEY,
        department_name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Doctors table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Doctors (
        doctor_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        specialization VARCHAR(100),
        department_id INT,
        contact_number VARCHAR(20),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES Departments(department_id)
      )
    `);

    // Create Patients table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Patients (
        patient_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        date_of_birth DATE,
        gender VARCHAR(10),
        contact_number VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Appointments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Appointments (
        appointment_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status VARCHAR(20) DEFAULT 'Scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
        FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
      )
    `);

    // Create Equipment table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Equipment (
        equipment_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50),
        purchase_date DATE,
        department_id INT,
        status VARCHAR(20) DEFAULT 'Available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES Departments(department_id)
      )
    `);

    // Create Medications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Medications (
        medication_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        quantity INT DEFAULT 0,
        unit_price DECIMAL(10,2),
        expiry_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Billing table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Billing (
        bill_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        bill_date DATE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        amount_paid DECIMAL(10,2) DEFAULT 0,
        payment_status VARCHAR(20) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES Patients(patient_id)
      )
    `);

    console.log('✅ Database and tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

initializeDatabase(); 