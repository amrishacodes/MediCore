const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all departments
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Departments');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching departments' });
    }
});

// Get department by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Departments WHERE department_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching department' });
    }
});

// Create department
router.post('/', async (req, res) => {
    try {
        const { department_name, description } = req.body;
        const [result] = await db.query(
            'INSERT INTO Departments (department_name, description) VALUES (?, ?)',
            [department_name, description]
        );
        res.status(201).json({ id: result.insertId, message: 'Department created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating department' });
    }
});

// Update department
router.put('/:id', async (req, res) => {
    try {
        const { department_name, description } = req.body;
        const [result] = await db.query(
            'UPDATE Departments SET department_name = ?, description = ? WHERE department_id = ?',
            [department_name, description, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json({ message: 'Department updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating department' });
    }
});

// Delete department
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Departments WHERE department_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json({ message: 'Department deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting department' });
    }
});

module.exports = router; 