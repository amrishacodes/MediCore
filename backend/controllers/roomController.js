
const db = require('../config/db');

// Get all rooms
exports.getAllRooms = (req, res) => {
    db.query('SELECT * FROM Rooms', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Get room by ID
exports.getRoomById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Rooms WHERE room_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
};

// Add new room
exports.addRoom = (req, res) => {
    const { room_number, type, status } = req.body;
    db.query(
        'INSERT INTO Rooms (room_number, type, status) VALUES (?, ?, ?)',
        [room_number, type, status],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, message: 'Room added successfully' });
        }
    );
};

// Update room
exports.updateRoom = (req, res) => {
    const { id } = req.params;
    const { room_number, type, status } = req.body;
    db.query(
        'UPDATE Rooms SET room_number = ?, type = ?, status = ? WHERE room_id = ?',
        [room_number, type, status, id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Room updated successfully' });
        }
    );
};

// Delete room
exports.deleteRoom = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Rooms WHERE room_id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Room deleted successfully' });
    });
};
