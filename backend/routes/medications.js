const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all medications
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Medications');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching medications' });
  }
});

// Get medication by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Medications WHERE medication_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching medication' });
  }
});

// Create medication
router.post('/', async (req, res) => {
  try {
    const { name, description, dosage_form, strength, price } = req.body;
    const [result] = await db.query(
      'INSERT INTO Medications (name, description, dosage_form, strength, price) VALUES (?, ?, ?, ?, ?)',
      [name, description, dosage_form, strength, price]
    );
    
    const [newMedication] = await db.query('SELECT * FROM Medications WHERE medication_id = ?', [result.insertId]);
    res.status(201).json(newMedication[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating medication' });
  }
});

// Update medication
router.put('/:id', async (req, res) => {
  try {
    const { name, description, dosage_form, strength, price } = req.body;
    const [result] = await db.query(
      'UPDATE Medications SET name = ?, description = ?, dosage_form = ?, strength = ?, price = ? WHERE medication_id = ?',
      [name, description, dosage_form, strength, price, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    const [updatedMedication] = await db.query('SELECT * FROM Medications WHERE medication_id = ?', [req.params.id]);
    res.json(updatedMedication[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating medication' });
  }
});

// Delete medication
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Medications WHERE medication_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json({ message: 'Medication deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting medication' });
  }
});

module.exports = router; 