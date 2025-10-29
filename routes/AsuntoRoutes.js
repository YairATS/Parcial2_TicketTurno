import express from 'express';
import { getAllAsuntos, getAsunto, createAsunto, updateAsunto, deleteAsunto } from '../controllers/AsuntoController.js';

const router = express.Router();

router.get('/', getAllAsuntos);
router.get('/:id', getAsunto);
router.post('/', createAsunto);
router.put('/:id', updateAsunto);
router.delete('/:id', deleteAsunto);

export default router;