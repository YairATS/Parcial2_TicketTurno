import AuthService from '../services/AuthService.js';

/**
 * Middleware para proteger rutas que requieren autenticación
 */
export const requireAuth = (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
        }

        const token = authHeader.substring(7); // Remover "Bearer "

        // Verificar token
        const decoded = AuthService.verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }

        // Agregar datos del usuario al request
        req.usuario = decoded;
        next();

    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
};

/**
 * Middleware para proteger vistas (usando sesiones)
 */
export const requireAuthView = (req, res, next) => {
    if (req.session && req.session.usuario) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};