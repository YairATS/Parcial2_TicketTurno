import AuthService from '../services/AuthService.js';
import svgCaptcha from 'svg-captcha';

/**
 * Generar CAPTCHA
 */
export const generarCaptcha = (req, res) => {
    const captcha = svgCaptcha.create({
        size: 6,
        noise: 3,
        color: true,
        background: '#f0f0f0',
        width: 200,
        height: 80
    });

    // Guardar el texto del captcha en la sesión
    req.session.captcha = captcha.text;

    res.type('svg');
    res.send(captcha.data);
};

/**
 * Login - Autenticar usuario
 */
export const login = async (req, res) => {
    try {
        const { usuario, password, captcha } = req.body;

        // Validar campos
        if (!usuario || !password || !captcha) {
            return res.status(400).json({ 
                error: 'Todos los campos son requeridos' 
            });
        }

        // Verificar CAPTCHA
        if (!req.session.captcha || captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
            return res.status(400).json({ 
                error: 'CAPTCHA incorrecto' 
            });
        }

        // Limpiar CAPTCHA usado
        delete req.session.captcha;

        // Autenticar
        const resultado = await AuthService.authenticate(usuario, password);

        if (!resultado.success) {
            return res.status(401).json({ 
                error: resultado.message 
            });
        }

        // Guardar en sesión
        req.session.usuario = resultado.usuario;
        req.session.token = resultado.token;

        res.json({
            success: true,
            message: 'Login exitoso',
            usuario: resultado.usuario,
            token: resultado.token
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

/**
 * Logout - Cerrar sesión
 */
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.json({ success: true, message: 'Sesión cerrada' });
    });
};

/**
 * Verificar sesión activa
 */
export const verificarSesion = (req, res) => {
    if (req.session && req.session.usuario) {
        res.json({
            autenticado: true,
            usuario: req.session.usuario
        });
    } else {
        res.json({ autenticado: false });
    }
};