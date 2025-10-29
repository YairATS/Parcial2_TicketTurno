import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Nivel = sequelize.define('Nivel', {
        id_nivel: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_nivel: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'niveles',
        timestamps: false
    });
    return Nivel;
};