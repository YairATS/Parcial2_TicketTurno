import { Asunto , sequelize } from '../models/database.js';

class AsuntoRepository {
    async create(data) {
        return await Asunto.create(data);
    }

    async findall() {
        return await Asunto.findAll();
    }

    async findById(id){
        return await Asunto.findByPk(id);
    }

    async update (id, data){
        const t = await sequelize.transaction();
        try {
            const asunto = await Asunto.findByPk(id);
            await asunto.update(data, {transaction: t});
            await t.commit();
            return asunto;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async delete (id){
        const t = await sequelize.transaction();
        try {
            const asunto = await Asunto.findByPk(id);
            if (!asunto) { await t.rollback(); return false; }
            await asunto.destroy({transaction: t});
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

}

export default new AsuntoRepository();