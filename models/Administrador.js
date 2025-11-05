import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Administrador = sequelize.define('Administrador', {
        id_administrador: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuario: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [3, 50]
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        nombre_completo: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        ultimo_acceso: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'administradores',
        timestamps: false
    });

    return Administrador;
};