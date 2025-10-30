import express from 'express';
import municipiosRouter from './routes/MunicipioRoutes.js';
import AlumnoRoutes from './routes/AlumnoRoutes.js';
import AsuntoRoutes from './routes/AsuntoRoutes.js';
import NivelRoutes from './routes/NivelRoutes.js';
import TurnoPublicoRoutes from './routes/TurnoPublicoRoutes.js'; // ← NUEVO
import TurnoRoutes from './routes/TurnoRoutes.js';

import { sequelize } from './models/database.js';

const app = express();

// Middleware
app.use(express.json());

//Register view engine
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Test route
app.get('/', (req, res) => {
    res.render('ticket');
});

app.get('/alumnos', async (req, res) => {
    try{
        const respuesta = await fetch('http://localhost:3000/api/alumnos');
        const alumnos = await respuesta.json();
        res.render('alumnos', { alumnos });
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).send("Error al obtener usuarios");
    }
});

// Routes
app.use('/api/municipios', municipiosRouter);
app.use('/api/alumnos', AlumnoRoutes);
app.use('/api/asuntos', AsuntoRoutes);
app.use('/api/niveles', NivelRoutes);
app.use('/api/turnos', TurnoRoutes);
app.use('/api/turnos/public', TurnoPublicoRoutes); // ← NUEVO

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
            console.log('   POST /api/turnos/public/solicitar'); // ← NUEVO
            console.log('   GET  /api/turnos/public/consultar/:curp/:numeroTurno'); // ← NUEVO
        });
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    });