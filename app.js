import express from 'express';
import session from 'express-session';
import municipiosRouter from './routes/MunicipioRoutes.js';
import AlumnoRoutes from './routes/AlumnoRoutes.js';
import AsuntoRoutes from './routes/AsuntoRoutes.js';
import NivelRoutes from './routes/NivelRoutes.js';
import TurnoPublicoRoutes from './routes/TurnoPublicoRoutes.js'; // ← NUEVO
import TurnoRoutes from './routes/TurnoRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
import { sequelize } from './models/database.js';
import { requireAuthView } from './middleware/auth.js';
import AdminRoutes from './routes/AdminRoutes.js';


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu-secreto-de-sesion-cambiar-en-produccion',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Cambiar a true en producción con HTTPS
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000 // 8 horas
    }
}));

//Register view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Test route
app.get('/', (req, res) => {
    res.render('ticket');
});

app.get('/modificar_turno', async (req, res) => {
    res.render('modificarTurno');
});

app.get('/admin/login', (req, res) => {
    res.render('admin/login');
});


// RUTAS PROTEGIDAS (Admin)
app.get('/admin/catalogos', requireAuthView, (req, res) => {
    res.render('admin/catalogos');
})

app.get('/admin/dashboard', requireAuthView, (req,res) => {
    res.render('admin/dashboard');
});

// ===== RUTAS PROTEGIDAS (Admin Views) =====
app.get('/admin/dashboard', requireAuthView, (req, res) => {
    res.render('admin/dashboard');
});

app.get('/admin/turnos', requireAuthView, (req, res) => {  // ← AGREGAR ESTO
    res.render('admin/turnos');
});

app.get('/admin/catalogos', requireAuthView, (req, res) => {
    res.render('admin/catalogos');
});



// Public API Routes
app.use('/api/municipios', municipiosRouter);
app.use('/api/alumnos', AlumnoRoutes);
app.use('/api/asuntos', AsuntoRoutes);
app.use('/api/niveles', NivelRoutes);
app.use('/api/turnos', TurnoRoutes);
app.use('/api/turnos/public', TurnoPublicoRoutes); // ← NUEVO
app.use('/api/auth', AuthRoutes);

app.use('/api/admin', AdminRoutes);

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