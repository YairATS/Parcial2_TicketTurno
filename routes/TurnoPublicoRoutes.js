import express from 'express';
import { solicitarTurno, consultarTurno, modificarTurno, generarPDFTurno } from '../controllers/TurnoPublicoController.js';

const router = express.Router();

// Ruta para solicitar un nuevo turno (formulario público)
router.post('/solicitar', solicitarTurno);

// Ruta para consultar un turno existente por CURP y número
router.get('/consultar/:curp/:numeroTurno', consultarTurno);

// Ruta para modificar un turno existente
router.put('/modificar/:curp/:numeroTurno', modificarTurno);

// Ruta para generar el PDF del turno
router.get('/pdf/:id', generarPDFTurno);

export default router;