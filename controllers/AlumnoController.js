import AlumnoRepository from "../Repository/AlumnoRepository.js";

export const getAllAlumnos = async (req, res) => {
    try {
        const list = await AlumnoRepository.findAll();
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los alumnos' });
    }
};

export const getAlumno = async (req, res) => {
    try {
        const alumno = await AlumnoRepository.findById(req.params.id);
        if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
        res.json(alumno);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el alumno' });
    }
}

export const getAlumnoByCurp = async (req, res) => {
    try {
        const alumno = await AlumnoRepository.findByCurp(req.params.curp);
        if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
        res.json(alumno);
    } catch {
        res.status(500).json({ error: 'Error al obtener el alumno' });
    }
}

export const createAlumno = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: 'Se requiere la información del alumno' });
        const alumno = await AlumnoRepository.create(req.body);
        res.status(201).json(alumno);
    } catch (error){
        res.status(500).json({ error: 'Error al crear el alumno' });
    }
}

export const updateAlumno = async (req, res) => {
    try {
        const alumno = await AlumnoRepository.update(req.params.id, req.body);
        if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
        res.json(alumno);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el alumno' });
    }
}

export const deleteAlumno = async (req, res) => {
    try {
        const ok = await AlumnoRepository.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Alumno no encontrado' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el alumno' });
    }
}

