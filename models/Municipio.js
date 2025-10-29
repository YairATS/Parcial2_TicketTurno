import { DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
  return sequelize.define('Municipio', {
    id_municipio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_municipio: {
      type: DataTypes.STRING,
      allowNull: false
    }
    // add other attributes here
  }, {
    tableName: 'municipios',
    timestamps: false
  });
};

