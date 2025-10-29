import { Alumno, sequelize } from "../models/database.js";


class AlumnosRepository {

  async create(data){
    return await Alumno.create(data);
  }

  async findAll(){
    return await Alumno.findAll();
  }

  async findById(id){
    return await Alumno.findByPk(id);
  }

  async findByCurp(curp){
    return await Alumno.findOne({where: {curp: curp}});
  }

  async update (id, data){
    const t = await sequelize.transaction();
    try {
        const alumno = await Alumno.findByPk(id);
        await alumno.update(data, {transaction: t});
        await t.commit();
        return alumno;
    } catch (error) {
        await t.rollback();
        throw error;
    }
  }

  async delete (id){
    const t = await sequelize.transaction();
    try {
        const alumno = await Alumno.findByPk(id);
        if (!alumno) { await t.rollback(); return false; }
        await alumno.destroy({transaction: t});
        await t.commit();
        return true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
  }

}

export default new AlumnosRepository();