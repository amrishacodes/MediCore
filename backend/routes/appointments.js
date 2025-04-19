const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, 
             p.first_name as patient_first_name, 
             p.last_name as patient_last_name,
             d.first_name as doctor_first_name,
             d.last_name as doctor_last_name
      FROM Appointments a
      LEFT JOIN Patients p ON a.patient_id = p.patient_id
      LEFT JOIN Doctors d ON a.doctor_id = d.doctor_id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, 
             p.first_name as patient_first_name, 
             p.last_name as patient_last_name,
             d.first_name as doctor_first_name,
             d.last_name as doctor_last_name
      FROM Appointments a
      LEFT JOIN Patients p ON a.patient_id = p.patient_id
      LEFT JOIN Doctors d ON a.doctor_id = d.doctor_id
      WHERE a.appointment_id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching appointment' });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time, status]
    );
    
    const [newAppointment] = await db.query(`
      SELECT a.*, 
             p.first_name as patient_first_name, 
             p.last_name as patient_last_name,
             d.first_name as doctor_first_name,
             d.last_name as doctor_last_name
      FROM Appointments a
      LEFT JOIN Patients p ON a.patient_id = p.patient_id
      LEFT JOIN Doctors d ON a.doctor_id = d.doctor_id
      WHERE a.appointment_id = ?
    `, [result.insertId]);
    
    res.status(201).json(newAppointment[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating appointment' });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;
    const [result] = await db.query(
      'UPDATE Appointments SET patient_id = ?, doctor_id = ?, appointment_date = ?, appointment_time = ?, status = ? WHERE appointment_id = ?',
      [patient_id, doctor_id, appointment_date, appointment_time, status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    const [updatedAppointment] = await db.query(`
      SELECT a.*, 
             p.first_name as patient_first_name, 
             p.last_name as patient_last_name,
             d.first_name as doctor_first_name,
             d.last_name as doctor_last_name
      FROM Appointments a
      LEFT JOIN Patients p ON a.patient_id = p.patient_id
      LEFT JOIN Doctors d ON a.doctor_id = d.doctor_id
      WHERE a.appointment_id = ?
    `, [req.params.id]);
    
    res.json(updatedAppointment[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating appointment' });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Appointments WHERE appointment_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting appointment' });
  }
});

module.exports = router; 