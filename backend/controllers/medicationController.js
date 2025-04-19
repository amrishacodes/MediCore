
const db = require('../config/db');

// Get all medications
exports.getAllMedications = (req, res) => {
    db.query('SELECT * FROM Medications', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Get medication by ID
exports.getMedicationById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Medications WHERE medication_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
};

// Add new medication
exports.addMedication = (req, res) => {
    const { name, description, dosage_form, strength, price } = req.body;
    db.query(
        'INSERT INTO Medications (name, description, dosage_form, strength, price) VALUES (?, ?, ?, ?, ?)',
        [name, description, dosage_form, strength, price],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, message: 'Medication added successfully' });
        }
    );
};

// Update medication
exports.updateMedication = (req, res) => {
    const { id } = req.params;
    const { name, description, dosage_form, strength, price } = req.body;
    db.query(
        'UPDATE Medications SET name = ?, description = ?, dosage_form = ?, strength = ?, price = ? WHERE medication_id = ?',
        [name, description, dosage_form, strength, price, id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Medication updated successfully' });
        }
    );
};

// Delete medication
exports.deleteMedication = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Medications WHERE medication_id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Medication deleted successfully' });
    });
};
