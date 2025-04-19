const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all patients
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, i.provider_name as insurance_provider 
      FROM Patients p
      LEFT JOIN InsuranceProviders i ON p.insurance_id = i.insurance_id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Get single patient
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, i.provider_name as insurance_provider 
      FROM Patients p
      LEFT JOIN InsuranceProviders i ON p.insurance_id = i.insurance_id
      WHERE p.patient_id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching patient' });
  }
});

// Create patient
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, contact_number, email, address, emergency_contact, insurance_id } = req.body;
    const [result] = await db.query(
      `INSERT INTO Patients 
      (first_name, last_name, date_of_birth, gender, contact_number, email, address, emergency_contact, insurance_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, date_of_birth, gender, contact_number, email, address, emergency_contact, insurance_id]
    );
    
    const [newPatient] = await db.query(`
      SELECT p.*, i.provider_name as insurance_provider 
      FROM Patients p
      LEFT JOIN InsuranceProviders i ON p.insurance_id = i.insurance_id
      WHERE p.patient_id = ?
    `, [result.insertId]);
    
    res.status(201).json(newPatient[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating patient' });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, contact_number, email, address, emergency_contact, insurance_id } = req.body;
    await db.query(
      `UPDATE Patients SET 
      first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, 
      contact_number = ?, email = ?, address = ?, emergency_contact = ?, insurance_id = ?
      WHERE patient_id = ?`,
      [first_name, last_name, date_of_birth, gender, contact_number, email, address, emergency_contact, insurance_id, req.params.id]
    );
    
    const [updatedPatient] = await db.query(`
      SELECT p.*, i.provider_name as insurance_provider 
      FROM Patients p
      LEFT JOIN InsuranceProviders i ON p.insurance_id = i.insurance_id
      WHERE p.patient_id = ?
    `, [req.params.id]);
    
    if (updatedPatient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(updatedPatient[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating patient' });
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Patients WHERE patient_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting patient' });
  }
});

module.exports = router; 