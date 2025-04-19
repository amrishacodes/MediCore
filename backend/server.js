const app = require('./app');
const db = require('./config/db');

// Test database connection
db.query('SELECT 1')
    .then(() => {
        console.log('✅ Connected to MySQL database successfully');
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    });

const PORTS = [50011, 5001, 5000, 5002, 5003, 5004, 5005];

// Function to find an available port
async function findAvailablePort() {
    for (const port of PORTS) {
        try {
            const server = app.listen(port, '0.0.0.0');
            server.close();
            return port;
        } catch (err) {
            if (err.code !== 'EADDRINUSE') {
                throw err;
            }
            console.log(`Port ${port} is busy, trying next port...`);
        }
    }
    throw new Error('No available ports found');
}

// Start server with error handling
findAvailablePort()
    .then(port => {
        const server = app.listen(port, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${port}`);
            console.log(`🌐 API endpoints available at http://localhost:${port}/api`);
            console.log(`🌐 API endpoints available at http://127.0.0.1:${port}/api`);
        });
        
        // Handle server errors
        server.on('error', (err) => {
            console.error('Server error:', err);
            process.exit(1);
        });
    })
    .catch(err => {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    });
