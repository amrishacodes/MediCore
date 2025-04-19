
const db = require('../config/db');

// Get all equipment (TEMP FIX: no join)
exports.getAllEquipment = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Equipment');
        res.json(rows);
    } catch (err) {
        console.error('ERROR in GET /equipment:', err);
        res.status(500).json({ message: 'Error fetching equipment', error: err.message });
    }
};

// Get equipment by ID
exports.getEquipmentById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Equipment WHERE equipment_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Equipment not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error('ERROR in GET /equipment/:id:', err);
        res.status(500).json({ message: 'Error fetching equipment', error: err.message });
    }
};

// Create equipment
exports.addEquipment = async (req, res) => {
    try {
        const { name, type, purchase_date, department_id, status } = req.body;
        const [result] = await db.query(
            'INSERT INTO Equipment (name, type, purchase_date, department_id, status) VALUES (?, ?, ?, ?, ?)',
            [name, type, purchase_date, department_id, status]
        );
        const [newEquipment] = await db.query('SELECT * FROM Equipment WHERE equipment_id = ?', [result.insertId]);
        res.status(201).json(newEquipment[0]);
    } catch (err) {
        console.error('ERROR in POST /equipment:', err);
        res.status(500).json({ message: 'Error creating equipment', error: err.message });
    }
};

// Update equipment
exports.updateEquipment = async (req, res) => {
    try {
        const { name, type, purchase_date, department_id, status } = req.body;
        const [result] = await db.query(
            'UPDATE Equipment SET name = ?, type = ?, purchase_date = ?, department_id = ?, status = ? WHERE equipment_id = ?',
            [name, type, purchase_date, department_id, status, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Equipment not found' });
        const [updated] = await db.query('SELECT * FROM Equipment WHERE equipment_id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (err) {
        console.error('ERROR in PUT /equipment/:id:', err);
        res.status(500).json({ message: 'Error updating equipment', error: err.message });
    }
};

// Delete equipment
exports.deleteEquipment = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Equipment WHERE equipment_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Equipment not found' });
        res.json({ message: 'Equipment deleted' });
    } catch (err) {
        console.error('ERROR in DELETE /equipment/:id:', err);
        res.status(500).json({ message: 'Error deleting equipment', error: err.message });
    }
};
