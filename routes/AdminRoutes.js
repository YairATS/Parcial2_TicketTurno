import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    obtenerEstadisticas,
    buscarTurnos,
    actualizarEstadoTurno,
    eliminarTurno
} from '../controllers/AdminController.js';

const router = express.Router();

// Todas estas rutas requieren autenticación
router.use(requireAuth);

// Estadísticas para el dashboard
router.get('/estadisticas', obtenerEstadisticas);

// Búsqueda y filtros de turnos
router.get('/turnos/buscar', buscarTurnos);

// Actualizar estado de turno
router.put('/turnos/:id/estado', actualizarEstadoTurno);

// Eliminar turno
router.delete('/turnos/:id', eliminarTurno);

export default router;