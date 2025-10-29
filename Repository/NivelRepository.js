import { Nivel , sequelize } from '../models/database.js';

class NivelRepository {
    async create(data) {
        return await Nivel.create(data);
    }

    async findall() {
        return await Nivel.findAll();
    }

    async findById(id){
        return await Nivel.findByPk(id);
    }

    async update (id, data){
        const t = await sequelize.transaction();
        try {
            const nivel = await Nivel.findByPk(id);
            await nivel.update(data, {transaction: t});
            await t.commit();
            return nivel;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async delete (id){
        const t = await sequelize.transaction();
        try {
            const nivel = await Nivel.findByPk(id);
            if (!nivel) { await t.rollback(); return false; }
            await nivel.destroy({transaction: t});
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

}

export default new NivelRepository();