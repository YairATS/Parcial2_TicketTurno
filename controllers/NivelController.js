import NivelRepository from "../Repository/NivelRepository.js";

export const getAllNiveles = async (req, res) => {
    try {
        const list = await NivelRepository.findall();
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los niveles' });
    }
};

export const getNivel = async (req, res) => {
    try {
        const nivel = await NivelRepository.findById(req.params.id);
        if (!nivel) return res.status(404).json({ error: 'Nivel no encontrado' });
        res.json(nivel);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el nivel' });
    }
};

export const createNivel = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: 'Se requiere la información del nivel' });
        const nivel = await NivelRepository.create(req.body);
        res.status(201).json(nivel);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el nivel' });
    }
};

export const updateNivel = async (req, res) => {
    try {
        const nivel = await NivelRepository.update(req.params.id, req.body);
        if (!nivel) return res.status(404).json({ error: 'Nivel no encontrado' });
        res.json(nivel);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el nivel' });
    }
};

export const deleteNivel = async (req, res) => {
    try {
        const ok = await NivelRepository.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Nivel no encontrado' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el nivel' });
    }
};