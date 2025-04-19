
const db = require('../config/db');

// Get all appointments
exports.getAllAppointments = (req, res) => {
    db.query('SELECT * FROM Appointments', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Get appointment by ID
exports.getAppointmentById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Appointments WHERE appointment_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
};

// Add new appointment
exports.addAppointment = (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;
    db.query(
        'INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
        [patient_id, doctor_id, appointment_date, appointment_time, status],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, message: 'Appointment added successfully' });
        }
    );
};

// Update appointment
exports.updateAppointment = (req, res) => {
    const { id } = req.params;
    const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;
    db.query(
        'UPDATE Appointments SET patient_id = ?, doctor_id = ?, appointment_date = ?, appointment_time = ?, status = ? WHERE appointment_id = ?',
        [patient_id, doctor_id, appointment_date, appointment_time, status, id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Appointment updated successfully' });
        }
    );
};

// Delete appointment
exports.deleteAppointment = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Appointments WHERE appointment_id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Appointment deleted successfully' });
    });
};
