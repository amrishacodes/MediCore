const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, dept.department_name 
      FROM Doctors d
      LEFT JOIN Departments dept ON d.department_id = dept.department_id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, dept.department_name 
      FROM Doctors d
      LEFT JOIN Departments dept ON d.department_id = dept.department_id
      WHERE d.doctor_id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching doctor' });
  }
});

// Create doctor
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, department_id, contact_number, email, specialization } = req.body;
    const [result] = await db.query(
      'INSERT INTO Doctors (first_name, last_name, department_id, contact_number, email, specialization) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, department_id, contact_number, email, specialization]
    );
    
    const [newDoctor] = await db.query(`
      SELECT d.*, dept.department_name 
      FROM Doctors d
      LEFT JOIN Departments dept ON d.department_id = dept.department_id
      WHERE d.doctor_id = ?
    `, [result.insertId]);
    
    res.status(201).json(newDoctor[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating doctor' });
  }
});

// Update doctor
router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, department_id, contact_number, email, specialization } = req.body;
    const [result] = await db.query(
      'UPDATE Doctors SET first_name = ?, last_name = ?, department_id = ?, contact_number = ?, email = ?, specialization = ? WHERE doctor_id = ?',
      [first_name, last_name, department_id, contact_number, email, specialization, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const [updatedDoctor] = await db.query(`
      SELECT d.*, dept.department_name 
      FROM Doctors d
      LEFT JOIN Departments dept ON d.department_id = dept.department_id
      WHERE d.doctor_id = ?
    `, [req.params.id]);
    
    res.json(updatedDoctor[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating doctor' });
  }
});

// Delete doctor
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Doctors WHERE doctor_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting doctor' });
  }
});

module.exports = router; 