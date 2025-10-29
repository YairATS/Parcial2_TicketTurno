import express from 'express';
import { getAllTurnos, getTurno, getTurnoByNumero, createTurno, updateTurno, deleteTurno } from '../controllers/TurnoController.js';

const router = express.Router();

router.get('/', getAllTurnos);
router.get('/:id', getTurno);
router.get('/numero/:numero', getTurnoByNumero);
router.post('/', createTurno);
router.put('/:id', updateTurno);
router.delete('/:id', deleteTurno);

export default router;