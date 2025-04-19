const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all bills
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, 
             p.first_name as patient_first_name, 
             p.last_name as patient_last_name
      FROM Billing b
      LEFT JOIN Patients p ON b.patient_id = p.patient_id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching bills' });
  }
});

// Get bill by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, 
             p.first_name as patient_first_name, 
             p.last_name as patient_last_name
      FROM Billing b
      LEFT JOIN Patients p ON b.patient_id = p.patient_id
      WHERE b.bill_id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching bill' });
  }
});

// Create bill
router.post('/', async (req, res) => {
  try {
    const { patient_id, bill_date, total_amount, amount_paid, payment_status } = req.body;
    const [result] = await db.query(
      'INSERT INTO Billing (patient_id, bill_date, total_amount, amount_paid, payment_status) VALUES (?, ?, ?, ?, ?)',
      [patient_id, bill_date, total_amount, amount_paid, payment_status]
    );
    
    const [newBill] = await db.query(`
      SELECT b.*, 
             p.first_name as patient_first_name, 
             p.last_name as patient_last_name
      FROM Billing b
      LEFT JOIN Patients p ON b.patient_id = p.patient_id
      WHERE b.bill_id = ?
    `, [result.insertId]);
    
    res.status(201).json(newBill[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating bill' });
  }
});

// Update bill
router.put('/:id', async (req, res) => {
  try {
    const { patient_id, bill_date, total_amount, amount_paid, payment_status } = req.body;
    const [result] = await db.query(
      'UPDATE Billing SET patient_id = ?, bill_date = ?, total_amount = ?, amount_paid = ?, payment_status = ? WHERE bill_id = ?',
      [patient_id, bill_date, total_amount, amount_paid, payment_status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    
    const [updatedBill] = await db.query(`
      SELECT b.*, 
             p.first_name as patient_first_name, 
             p.last_name as patient_last_name
      FROM Billing b
      LEFT JOIN Patients p ON b.patient_id = p.patient_id
      WHERE b.bill_id = ?
    `, [req.params.id]);
    
    res.json(updatedBill[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating bill' });
  }
});

// Delete bill
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Billing WHERE bill_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting bill' });
  }
});

module.exports = router; 