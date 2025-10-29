import { Turno, sequelize } from '../models/database.js';

class TurnoRepository {
    async create (data) {
        return await Turno.create(data);
    }

    async findAll () {
        return await Turno.findAll();
    }

    async findById (id) {
        return await Turno.findByPk(id);
    }

    async findByNumeroTurno (numeroTurno){
        return await Turno.findOne({where: {numero_Turno: numeroTurno}});
    }

    async update (id, data) {
        const t = await sequelize.transaction();
        try {
            const turno = await Turno.findByPk(id);
            await turno.update(data, {transaction: t});
            await t.commit();
            return turno;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async delete (id) {
        const t = await sequelize.transaction();
        try {
            const turno = await Turno.findByPk(id);
            if (!turno) { await t.rollback(); return false; }
            await turno.destroy({transaction: t});
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

export default new TurnoRepository();