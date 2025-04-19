const db = require('../config/db');

// Get all patients
exports.getAllPatients = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM Patients');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.query('SELECT * FROM Patients WHERE patient_id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new patient
exports.addPatient = async (req, res) => {
    try {
        const { first_name, last_name, date_of_birth, gender, contact_number, email, address, emergency_contact, insurance_id } = req.body;
        const [result] = await db.query(
            'INSERT INTO Patients (first_name, last_name, date_of_birth, gender, contact_number, email, address, emergency_contact, insurance_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, date_of_birth, gender, contact_number, email, address, emergency_contact, insurance_id]
        );
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Patient added successfully',
            patient: {
                patient_id: result.insertId,
                first_name,
                last_name,
                date_of_birth,
                gender,
                contact_number,
                email,
                address,
                emergency_contact,
                insurance_id
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update patient
exports.updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, date_of_birth, gender, contact_number, email, address, emergency_contact, insurance_id } = req.body;
        
        const [result] = await db.query(
            'UPDATE Patients SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, contact_number = ?, email = ?, address = ?, emergency_contact = ?, insurance_id = ? WHERE patient_id = ?',
            [first_name, last_name, date_of_birth, gender, contact_number, email, address, emergency_contact, insurance_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({ 
            message: 'Patient updated successfully',
            patient: {
                patient_id: id,
                first_name,
                last_name,
                date_of_birth,
                gender,
                contact_number,
                email,
                address,
                emergency_contact,
                insurance_id
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete patient
exports.deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM Patients WHERE patient_id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({ message: 'Patient deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
