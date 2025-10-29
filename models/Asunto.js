import { DataTypes } from 'sequelize';


export default (sequelize) => {
  return sequelize.define('Asunto', {
    id_asunto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_asunto: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  }, {
    tableName: 'asuntos',
    timestamps: false
  });
};