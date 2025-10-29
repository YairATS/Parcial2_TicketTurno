import MunicipioRepository from "../Repository/MunicipioRepository.js";

export const getAllMunicipios = async (req, res) => {
    try {
        const list = await MunicipioRepository.findAll();
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los municipios' });
    }
};

export const getMunicipio = async (req, res) => {
    try {
        const municipio = await MunicipioRepository.findById(req.params.id);
        if (!municipio) return res.status(404).json({ error: 'Municipio no encontrado' });
        res.json(municipio);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el municipio' });
    }
};

export const createMunicipio = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: 'Se requiere el nombre del municipio' });
        const municipio = await MunicipioRepository.create(req.body);
        res.status(201).json(municipio);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el municipio' });
    }
};

export const updateMunicipio = async (req, res) => {
    try {
        const municipio = await MunicipioRepository.update(req.params.id, req.body);
        if (!municipio) return res.status(404).json({ error: 'Municipio no encontrado' });
        res.json(municipio);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el municipio' });
    }
};

export const deleteMunicipio = async (req, res) => {
    try {
        const ok = await MunicipioRepository.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Municipio no encontrado' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el municipio' });
    }
};