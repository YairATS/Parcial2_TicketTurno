import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Administrador } from '../models/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura-cambiar-en-produccion';
const JWT_EXPIRES_IN = '8h';

class AuthService {
    /**
     * Hashear contraseña
     */
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * Comparar contraseña
     */
    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    /**
     * Generar token JWT
     */
    generateToken(usuario) {
        const payload = {
            id: usuario.id_administrador,
            usuario: usuario.usuario,
            nombre: usuario.nombre_completo,
            email: usuario.email
        };

        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    /**
     * Verificar token JWT
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    /**
     * Autenticar usuario
     */
    async authenticate(usuario, password) {
        try {
            // Buscar administrador por usuario
            const admin = await Administrador.findOne({ 
                where: { usuario: usuario } 
            });

            if (!admin) {
                return { success: false, message: 'Usuario no encontrado' };
            }

            // Verificar si está activo
            if (!admin.activo) {
                return { success: false, message: 'Usuario inactivo' };
            }

            // Comparar contraseña
            const isPasswordValid = await this.comparePassword(password, admin.password_hash);

            if (!isPasswordValid) {
                return { success: false, message: 'Contraseña incorrecta' };
            }

            // Actualizar último acceso
            await admin.update({ ultimo_acceso: new Date() });

            // Generar token
            const token = this.generateToken(admin);

            return {
                success: true,
                token,
                usuario: {
                    id: admin.id_administrador,
                    usuario: admin.usuario,
                    nombre: admin.nombre_completo,
                    email: admin.email
                }
            };

        } catch (error) {
            console.error('Error en autenticación:', error);
            return { success: false, message: 'Error en el servidor' };
        }
    }

    /**
     * Crear nuevo administrador (solo para uso interno/setup)
     */
    async createAdmin(datos) {
        try {
            const passwordHash = await this.hashPassword(datos.password);
            
            const admin = await Administrador.create({
                usuario: datos.usuario,
                password_hash: passwordHash,
                nombre_completo: datos.nombre_completo,
                email: datos.email
            });

            return { success: true, admin };
        } catch (error) {
            console.error('Error al crear administrador:', error);
            return { success: false, message: error.message };
        }
    }
}

export default new AuthService();