import express from 'express';
import { getAllNiveles, getNivel, createNivel, updateNivel, deleteNivel } from '../controllers/NivelController.js';

const router = express.Router();    

router.get('/', getAllNiveles);
router.get('/:id', getNivel);
router.post('/', createNivel);
router.put('/:id', updateNivel);
router.delete('/:id', deleteNivel);

export default router;