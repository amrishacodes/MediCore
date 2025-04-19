const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all equipment
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, d.department_name 
      FROM Equipment e
      LEFT JOIN Departments d ON e.department_id = d.department_id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching equipment' });
  }
});

// Get single equipment
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, d.department_name 
      FROM Equipment e
      LEFT JOIN Departments d ON e.department_id = d.department_id
      WHERE e.equipment_id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching equipment' });
  }
});

// Create equipment
router.post('/', async (req, res) => {
  try {
    const { name, type, purchase_date, department_id, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO Equipment (name, type, purchase_date, department_id, status) VALUES (?, ?, ?, ?, ?)',
      [name, type, purchase_date, department_id, status]
    );
    
    const [newEquipment] = await db.query(`
      SELECT e.*, d.department_name 
      FROM Equipment e
      LEFT JOIN Departments d ON e.department_id = d.department_id
      WHERE e.equipment_id = ?
    `, [result.insertId]);
    
    res.status(201).json(newEquipment[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating equipment' });
  }
});

// Update equipment
router.put('/:id', async (req, res) => {
  try {
    const { name, type, purchase_date, department_id, status } = req.body;
    const [result] = await db.query(
      'UPDATE Equipment SET name = ?, type = ?, purchase_date = ?, department_id = ?, status = ? WHERE equipment_id = ?',
      [name, type, purchase_date, department_id, status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    const [updatedEquipment] = await db.query(`
      SELECT e.*, d.department_name 
      FROM Equipment e
      LEFT JOIN Departments d ON e.department_id = d.department_id
      WHERE e.equipment_id = ?
    `, [req.params.id]);
    
    res.json(updatedEquipment[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating equipment' });
  }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Equipment WHERE equipment_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json({ message: 'Equipment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting equipment' });
  }
});

module.exports = router; 