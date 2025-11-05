import express from 'express';
import { generarCaptcha, login, logout, verificarSesion } from '../controllers/AuthController.js';

const router = express.Router();

router.get('/captcha', generarCaptcha);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verificar', verificarSesion);

export default router;