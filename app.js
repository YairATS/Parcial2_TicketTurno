import express from 'express';
import municipiosRouter from './routes/MunicipioRoutes.js';
import { sequelize } from './models/database.js';

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Routes
app.use('/api/municipios', municipiosRouter);

// Error handling
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.url} not found` });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

const PORT = 3000;

// Test DB connection before starting server
sequelize.authenticate()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log('📚 Available routes:');
            console.log('   GET  /');
            console.log('   GET  /api/municipios');
            console.log('   GET  /api/municipios/:id');
            console.log('   POST /api/municipios');
        });
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    })