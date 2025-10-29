import TurnoRepository from "../Repository/TurnoRepository.js";

export const getAllTurnos = async (req, res) => {
    try {
        const list = await TurnoRepository.findAll();
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los turnos' });
    }
};

export const getTurno = async (req, res) => {
    try {
        const turno = await TurnoRepository.findById(req.params.id);
        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
        res.json(turno);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el turno' });
    }
};

export const getTurnoByNumero = async (req, res) => {
    try {
        const turno = await TurnoRepository.findByNumero(req.params.numero);
        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
        res.json(turno);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el turno' });
    }
};

export const createTurno = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: 'Se requiere la información del turno' });
        const turno = await TurnoRepository.create(req.body);
        res.status(201).json(turno);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el turno' });
    }
}

export const updateTurno = async (req, res) => {
    try {
        const turno = await TurnoRepository.update(req.params.id, req.body);
        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
        res.json(turno);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el turno' });
    }
}

export const deleteTurno = async (req, res) => {
    try {
        const ok = await TurnoRepository.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Turno no encontrado' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el turno' });
    }
}