import AlumnoRepository from "../Repository/AlumnoRepository.js";
import TurnoRepository from "../Repository/TurnoRepository.js";
import { sequelize } from "../models/database.js";

/**
 * Controlador para manejar solicitudes públicas de turnos
 * Este controlador maneja el flujo completo: crear alumno y turno en una sola operación
 */

export const solicitarTurno = async (req, res) => {
    // Iniciar una transacción para asegurar consistencia
    const transaction = await sequelize.transaction();
    
    try {
        const { alumno, turno } = req.body;

        // Validar que se reciban los datos necesarios
        if (!alumno || !turno) {
            await transaction.rollback();
            return res.status(400).json({ 
                error: 'Se requiere información del alumno y del turno' 
            });
        }

        // 1. Verificar si el alumno ya existe por CURP
        let alumnoExistente = await AlumnoRepository.findByCurp(alumno.curp);
        
        let alumnoCreado;
        if (alumnoExistente) {
            // Si existe, actualizar sus datos
            alumnoCreado = await AlumnoRepository.update(alumnoExistente.id_alumno, alumno);
        } else {
            // Si no existe, crear nuevo alumno
            alumnoCreado = await AlumnoRepository.create(alumno);
        }

        // 2. Crear el turno asociado al alumno
        const turnoData = {
            id_alumno: alumnoCreado.id_alumno,
            id_asunto: turno.id_asunto,
            estado: 'pendiente'
        };

        const turnoCreado = await TurnoRepository.create(turnoData);

        // Confirmar la transacción
        await transaction.commit();

        // 3. Retornar respuesta exitosa
        res.status(201).json({
            mensaje: 'Turno generado exitosamente',
            alumno: {
                id: alumnoCreado.id_alumno,
                nombre_completo: alumnoCreado.nombre_completo,
                curp: alumnoCreado.curp
            },
            turno: {
                id: turnoCreado.id_turno,
                numero_turno: turnoCreado.numero_turno,
                fecha_creacion: turnoCreado.fecha_creacion,
                estado: turnoCreado.estado
            }
        });

    } catch (error) {
        // Revertir transacción en caso de error
        await transaction.rollback();
        
        console.error('Error al solicitar turno:', error);
        
        // Manejar errores específicos de validación
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'Error de validación',
                detalles: error.errors.map(e => e.message)
            });
        }
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ 
                error: 'Ya existe un registro con estos datos' 
            });
        }

        res.status(500).json({ 
            error: 'Error al procesar la solicitud de turno' 
        });
    }
};

/**
 * Consultar turno por CURP y número de turno (para modificaciones)
 */
export const consultarTurno = async (req, res) => {
    try {
        const { curp, numeroTurno } = req.params;

        // Buscar alumno por CURP
        const alumno = await AlumnoRepository.findByCurp(curp);
        
        if (!alumno) {
            return res.status(404).json({ error: 'No se encontró ningún alumno con esa CURP' });
        }

        // Buscar turno por número
        const turno = await TurnoRepository.findByNumeroTurno(numeroTurno);
        
        if (!turno) {
            return res.status(404).json({ error: 'No se encontró el turno especificado' });
        }

        // Verificar que el turno pertenece al alumno
        if (turno.id_alumno !== alumno.id_alumno) {
            return res.status(403).json({ error: 'El turno no corresponde a la CURP proporcionada' });
        }

        res.json({
            alumno: {
                id: alumno.id_alumno,
                nombre_completo: alumno.nombre_completo,
                nombre: alumno.nombre,
                paterno: alumno.paterno,
                materno: alumno.materno,
                curp: alumno.curp,
                telefono: alumno.telefono,
                celular: alumno.celular,
                correo: alumno.correo,
                id_nivel: alumno.id_nivel,
                id_municipio: alumno.id_municipio
            },
            turno: {
                id: turno.id_turno,
                numero_turno: turno.numero_turno,
                fecha_creacion: turno.fecha_creacion,
                estado: turno.estado,
                id_asunto: turno.id_asunto
            }
        });

    } catch (error) {
        console.error('Error al consultar turno:', error);
        res.status(500).json({ error: 'Error al consultar el turno' });
    }
};

/**
 * Modificar datos del alumno de un turno existente
 */
export const modificarTurno = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { curp, numeroTurno } = req.params;
        const { alumno, turno } = req.body;

        // Buscar y verificar el turno
        const alumnoExistente = await AlumnoRepository.findByCurp(curp);
        if (!alumnoExistente) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        const turnoExistente = await TurnoRepository.findByNumeroTurno(numeroTurno);
        if (!turnoExistente) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        if (turnoExistente.id_alumno !== alumnoExistente.id_alumno) {
            await transaction.rollback();
            return res.status(403).json({ error: 'El turno no corresponde a la CURP proporcionada' });
        }

        // Actualizar datos del alumno
        if (alumno) {
            await AlumnoRepository.update(alumnoExistente.id_alumno, alumno);
        }

        // Actualizar datos del turno (solo asunto)
        if (turno && turno.id_asunto) {
            await TurnoRepository.update(turnoExistente.id_turno, {
                id_asunto: turno.id_asunto
            });
        }

        await transaction.commit();

        res.json({
            mensaje: 'Turno actualizado exitosamente',
            numero_turno: numeroTurno
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error al modificar turno:', error);
        res.status(500).json({ error: 'Error al modificar el turno' });
    }
};