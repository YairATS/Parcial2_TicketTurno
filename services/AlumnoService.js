const Alumno = require("../models/Alumno1");


// Servicio para crear alumnos
exports.createAlumno = async (alumnoData) => {
    try {
        const alumno = await Alumno.create(alumnoData);
        return alumno;
    } catch (error) {
        console.error('Error al crear el alumno:', error);
        throw error;
    }
}


// Servicio para obtener todos los alumnos
exports.getAllAlumnos = async () => {
    try {
        const alumnos = await Alumno.findAll();
        return alumnos;
    } catch (error) {
        console.error('Error al obtener los alumnos:', error);
        throw error;
    }
}

// Servicio para obtener alumno por ID
exports.getAlumnoById = async (id) => {
    try {
        const alumno = await Alumno.findByPk(id);
        return alumno;
    } catch (error) {
        console.error('Error al obtener el alumno:', error);
        throw error;
    }
}

// Servicio para actualizar alumno
exports.updateAlumno = async (id, alumnoData) => {
    try {
        const alumno = await Alumno.findByPk(id);
        if (!alumno) {
            throw new Error('Alumno no encontrado');
        }
        await alumno.update(alumnoData);
        return alumno;
    } catch (error) {
        console.error('Error al actualizar el alumno:', error);
        throw error;
    }
}

// Servicio para eliminar alumno
exports.deleteAlumno = async (id) => {
    try {
        const alumno = await Alumno.findByPk(id);
        if (!alumno) {
            throw new Error('Alumno no encontrado');
        }
        await alumno.destroy();
    } catch (error) {
        console.error('Error al eliminar el alumno:', error);
        throw error;
    }
}