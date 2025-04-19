
const db = require('../config/db');

// Get all doctors
exports.getAllDoctors = (req, res) => {
    db.query('SELECT * FROM Doctors', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Get doctor by ID
exports.getDoctorById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Doctors WHERE doctor_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
};

// Add new doctor
exports.addDoctor = (req, res) => {
    const { first_name, last_name, department_id, contact_number, email, specialization } = req.body;
    db.query(
        'INSERT INTO Doctors (first_name, last_name, department_id, contact_number, email, specialization) VALUES (?, ?, ?, ?, ?, ?)',
        [first_name, last_name, department_id, contact_number, email, specialization],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, message: 'Doctor added successfully' });
        }
    );
};

// Update doctor
exports.updateDoctor = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, department_id, contact_number, email, specialization } = req.body;
    db.query(
        'UPDATE Doctors SET first_name = ?, last_name = ?, department_id = ?, contact_number = ?, email = ?, specialization = ? WHERE doctor_id = ?',
        [first_name, last_name, department_id, contact_number, email, specialization, id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Doctor updated successfully' });
        }
    );
};

// Delete doctor
exports.deleteDoctor = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Doctors WHERE doctor_id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Doctor deleted successfully' });
    });
};
