const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    let connection;
    try {
        // Create connection without database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'HospitalDB'}`);
        console.log('✅ Database created or already exists');

        // Use the database
        await connection.query(`USE ${process.env.DB_NAME || 'HospitalDB'}`);

        // Create tables
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Departments (
                department_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

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
                emergency_contact VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Appointments (
                appointment_id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT,
                doctor_id INT,
                appointment_date DATE NOT NULL,
                appointment_time TIME NOT NULL,
                status VARCHAR(20) DEFAULT 'Scheduled',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
                FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Equipment (
                equipment_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                status VARCHAR(20) DEFAULT 'Available',
                last_maintenance_date DATE,
                next_maintenance_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Medications (
                medication_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                dosage_form VARCHAR(50),
                strength VARCHAR(50),
                price DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Billing (
                bill_id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT,
                bill_date DATE NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                amount_paid DECIMAL(10,2) DEFAULT 0,
                payment_status VARCHAR(20) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES Patients(patient_id)
            )
        `);

        console.log('✅ All tables created or already exist');

    } catch (err) {
        console.error('❌ Error initializing database:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the initialization
initializeDatabase().catch(console.error); 