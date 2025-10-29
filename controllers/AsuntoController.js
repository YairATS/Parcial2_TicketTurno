import AsuntoRepository from "../Repository/AsuntoRepository.js";

export const getAllAsuntos = async (req, res) => {
    try {
        const list = await AsuntoRepository.findall();
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los asuntos' });
    }
};

export const getAsunto = async (req, res) => {
    try {
        const asunto = await AsuntoRepository.findById(req.params.id);
        if (!asunto) return res.status(404).json({ error: 'Asunto no encontrado' });
        res.json(asunto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el asunto' });
    }
};

export const createAsunto = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: 'Se requiere la información del asunto' });
        const asunto = await AsuntoRepository.create(req.body);
        res.status(201).json(asunto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el asunto' });
    }
};

export const updateAsunto = async (req, res) => {
    try {
        const asunto = await AsuntoRepository.update(req.params.id, req.body);
        if (!asunto) return res.status(404).json({ error: 'Asunto no encontrado' });
        res.json(asunto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el asunto' });
    }
};

export const deleteAsunto = async (req, res) => {
    try {
        const ok = await AsuntoRepository.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Asunto no encontrado' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el asunto' });
    }
};