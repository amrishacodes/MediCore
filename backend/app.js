const express = require('express');
const cors = require('cors');

// Import routes
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const equipmentRoutes = require('./routes/equipment');
const medicationRoutes = require('./routes/medications');
const billingRoutes = require('./routes/billing');
const departmentRoutes = require('./routes/departments');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/departments', departmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Root endpoint
app.get('/api', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'Welcome to Hospital Management System API'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
