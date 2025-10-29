import express from 'express';
import municipiosRouter from './routes/MunicipioRoutes.js';
import AlumnoRoutes from './routes/AlumnoRoutes.js';
import AsuntoRoutes from './routes/AsuntoRoutes.js';
import NivelRoutes from './routes/NivelRoutes.js';
import TurnoRoutes from './routes/TurnoRoutes.js';
import { sequelize } from './models/database.js';

const app = express();

// Middleware
app.use(express.json());

//Register view engine
app.set('view engine', 'ejs');

// Test route
app.get('/', (req, res) => {
    /* res.json({ message: 'API is running' }); */
    res.render('home');
});

// Routes
app.use('/api/municipios', municipiosRouter);
app.use('/api/alumnos', AlumnoRoutes);
app.use('/api/asuntos', AsuntoRoutes);
app.use('/api/niveles', NivelRoutes);
app.use('/api/turnos', TurnoRoutes);

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