import { Municipio, sequelize } from "../models/database.js";

class MunicipioRepository {
    async create(data){
        return await Municipio.create(data);
    }

    async findAll(){
        return await Municipio.findAll();
    }

    async findById(id){
        return await Municipio.findByPk(id);
    }

    async update (id, data){
        const t = await sequelize.transaction();
        try {
            const municipio = await Municipio.findByPk(id);
            await municipio.update(data, {transaction: t});
            await t.commit();
            return municipio;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async delete (id){
        const t = await sequelize.transaction();
        try {
            const municipio = await Municipio.findByPk(id);
            if (!municipio) { await t.rollback(); return false; }
            await municipio.destroy({transaction: t});
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

export default new MunicipioRepository();