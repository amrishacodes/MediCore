
const db = require('../config/db');

// Get all bills
exports.getAllBills = (req, res) => {
    db.query('SELECT * FROM Billing', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Get bill by ID
exports.getBillById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Billing WHERE bill_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
};

// Add new bill
exports.addBill = (req, res) => {
    const { patient_id, bill_date, total_amount, amount_paid, payment_status } = req.body;
    db.query(
        'INSERT INTO Billing (patient_id, bill_date, total_amount, amount_paid, payment_status) VALUES (?, ?, ?, ?, ?)',
        [patient_id, bill_date, total_amount, amount_paid, payment_status],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, message: 'Bill added successfully' });
        }
    );
};

// Update bill
exports.updateBill = (req, res) => {
    const { id } = req.params;
    const { patient_id, bill_date, total_amount, amount_paid, payment_status } = req.body;
    db.query(
        'UPDATE Billing SET patient_id = ?, bill_date = ?, total_amount = ?, amount_paid = ?, payment_status = ? WHERE bill_id = ?',
        [patient_id, bill_date, total_amount, amount_paid, payment_status, id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Bill updated successfully' });
        }
    );
};

// Delete bill
exports.deleteBill = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Billing WHERE bill_id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Bill deleted successfully' });
    });
};
