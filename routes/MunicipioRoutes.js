import express from 'express';
import { getAllMunicipios, getMunicipio, createMunicipio, updateMunicipio, deleteMunicipio }  from '../controllers/municipioController.js';

const router = express.Router();

router.get('/', getAllMunicipios);
router.get('/:id', getMunicipio);
router.post('/', createMunicipio);
router.put('/:id', updateMunicipio);
router.delete('/:id', deleteMunicipio);

export default router;