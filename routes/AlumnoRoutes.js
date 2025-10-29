import express from 'express';
import { getAllAlumnos, getAlumno, getAlumnoByCurp, createAlumno, updateAlumno, deleteAlumno } from '../controllers/AlumnoController.js';

const router = express.Router();

router.get('/', getAllAlumnos);
router.get('/:id', getAlumno);
router.get('/curp/:curp', getAlumnoByCurp);
router.post('/', createAlumno);
router.put('/:id', updateAlumno);
router.delete('/:id', deleteAlumno);

export default router;