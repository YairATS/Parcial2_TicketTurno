import { sequelize, Turno, Alumno, Municipio, Asunto, Nivel } from "../models/database.js";
import { Op } from 'sequelize';

/**
 * Obtener estadísticas para el dashboard
 */
export const obtenerEstadisticas = async (req, res) => {
    try {
        const { municipio, fechaInicio, fechaFin } = req.query;

        console.log('📊 Filtros recibidos:', { municipio, fechaInicio, fechaFin });

        // Construir filtros para Turno
        let whereTurno = {};
        
        // Construir filtros para Alumno
        let whereAlumno = {};

        // Filtro por fechas
        if (fechaInicio && fechaFin) {
            whereTurno.fecha_creacion = {
                [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
            };
        }

        // Filtro por municipio
        if (municipio && municipio !== '') {
            whereAlumno.id_municipio = parseInt(municipio);
        }

        console.log('🔍 Where Turno:', whereTurno);
        console.log('🔍 Where Alumno:', whereAlumno);

        // ==================== TOTAL DE TURNOS ====================
        const totalTurnos = await Turno.count({
            where: whereTurno,
            include: Object.keys(whereAlumno).length > 0 ? [{
                model: Alumno,
                where: whereAlumno,
                attributes: [],
                required: true
            }] : []
        });

        console.log('✅ Total turnos:', totalTurnos);

        // ==================== TURNOS POR ESTADO ====================
        const turnosPorEstadoRaw = await Turno.findAll({
            attributes: [
                'estado',
                [sequelize.fn('COUNT', sequelize.col('Turno.id_turno')), 'total']
            ],
            where: whereTurno,
            include: Object.keys(whereAlumno).length > 0 ? [{
                model: Alumno,
                where: whereAlumno,
                attributes: [],
                required: true
            }] : [],
            group: ['Turno.estado'],
            raw: true
        });

        console.log('✅ Turnos por estado (raw):', turnosPorEstadoRaw);

        // Convertir a objeto con todos los estados
        const turnosPorEstado = {
            pendiente: 0,
            en_atencion: 0,
            atendido: 0,
            cancelado: 0
        };

        turnosPorEstadoRaw.forEach(item => {
            turnosPorEstado[item.estado] = parseInt(item.total);
        });

        console.log('✅ Turnos por estado (formateado):', turnosPorEstado);

        // ==================== TURNOS POR MUNICIPIO ====================
        const turnosPorMunicipio = await Turno.findAll({
            attributes: [
                [sequelize.col('Alumno.Municipio.nombre_municipio'), 'municipio'],
                [sequelize.fn('COUNT', sequelize.col('Turno.id_turno')), 'total']
            ],
            where: whereTurno,
            include: [{
                model: Alumno,
                attributes: [],
                where: Object.keys(whereAlumno).length > 0 ? whereAlumno : undefined,
                required: true,
                include: [{
                    model: Municipio,
                    attributes: [],
                    required: true
                }]
            }],
            group: ['Alumno.Municipio.nombre_municipio'],
            raw: true
        });

        console.log('✅ Turnos por municipio:', turnosPorMunicipio);

        // ==================== TURNOS POR ASUNTO ====================
        const turnosPorAsunto = await Turno.findAll({
            attributes: [
                [sequelize.col('Asunto.nombre_asunto'), 'asunto'],
                [sequelize.fn('COUNT', sequelize.col('Turno.id_turno')), 'total']
            ],
            where: whereTurno,
            include: [{
                model: Asunto,
                attributes: [],
                required: true
            }, {
                model: Alumno,
                attributes: [],
                where: Object.keys(whereAlumno).length > 0 ? whereAlumno : undefined,
                required: true
            }],
            group: ['Asunto.nombre_asunto'],
            raw: true
        });

        console.log('✅ Turnos por asunto:', turnosPorAsunto);

        // ==================== TURNOS RECIENTES ====================
        const turnosRecientes = await Turno.findAll({
            where: whereTurno,
            include: [{
                model: Alumno,
                where: Object.keys(whereAlumno).length > 0 ? whereAlumno : undefined,
                required: true,
                include: [
                    { model: Municipio, required: true },
                    { model: Nivel, required: true }
                ]
            }, {
                model: Asunto,
                required: true
            }],
            order: [['fecha_creacion', 'DESC']],
            limit: 10
        });

        console.log('✅ Turnos recientes:', turnosRecientes.length);

        // ==================== RESPUESTA ====================
        const respuesta = {
            totalTurnos,
            turnosPorEstado,
            turnosPorMunicipio,
            turnosPorAsunto,
            turnosRecientes
        };

        console.log('📤 Enviando respuesta...');
        res.json(respuesta);

    } catch (error) {
        console.error('❌ Error al obtener estadísticas:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            error: 'Error al obtener estadísticas',
            detalle: error.message 
        });
    }
};

/**
 * Buscar turnos con filtros avanzados
 */
export const buscarTurnos = async (req, res) => {
    try {
        const { 
            busqueda, 
            municipio, 
            estado, 
            nivel,
            asunto,
            fechaInicio, 
            fechaFin,
            page = 1,
            limit = 20
        } = req.query;

        const whereTurno = {};
        const whereAlumno = {};

        if (estado) whereTurno.estado = estado;

        if (fechaInicio && fechaFin) {
            whereTurno.fecha_creacion = {
                [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
            };
        }

        if (municipio) whereAlumno.id_municipio = parseInt(municipio);
        if (nivel) whereAlumno.id_nivel = parseInt(nivel);
        if (asunto) whereTurno.id_asunto = parseInt(asunto);

        if (busqueda) {
            whereAlumno[Op.or] = [
                { curp: { [Op.iLike]: `%${busqueda}%` } },
                { nombre_completo: { [Op.iLike]: `%${busqueda}%` } },
                { nombre: { [Op.iLike]: `%${busqueda}%` } },
                { paterno: { [Op.iLike]: `%${busqueda}%` } }
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Turno.findAndCountAll({
            where: whereTurno,
            include: [{
                model: Alumno,
                where: Object.keys(whereAlumno).length > 0 ? whereAlumno : undefined,
                include: [
                    { model: Municipio },
                    { model: Nivel }
                ]
            }, {
                model: Asunto
            }],
            order: [['fecha_creacion', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });

        res.json({
            turnos: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });

    } catch (error) {
        console.error('Error al buscar turnos:', error);
        res.status(500).json({ error: 'Error al buscar turnos' });
    }
};

/**
 * Actualizar estado de un turno
 */
export const actualizarEstadoTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosValidos = ['pendiente', 'en_atencion', 'atendido', 'cancelado'];
        
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }

        const turno = await Turno.findByPk(id);
        
        if (!turno) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        await turno.update({ estado });

        res.json({ 
            success: true, 
            message: 'Estado actualizado correctamente' 
        });

    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar el estado' });
    }
};

/**
 * Eliminar turno (admin)
 */
export const eliminarTurno = async (req, res) => {
    try {
        const { id } = req.params;

        const turno = await Turno.findByPk(id);

        if (!turno) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        await turno.destroy();

        res.json({ 
            success: true, 
            message: 'Turno eliminado correctamente' 
        });

    } catch (error) {
        console.error('Error al eliminar turno:', error);
        res.status(500).json({ error: 'Error al eliminar el turno' });
    }
};