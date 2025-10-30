import { DataTypes } from 'sequelize';


export default (sequelize) => {
  return sequelize.define('Turno', {
    id_turno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_turno: {
      type: DataTypes.STRING(20),
      unique: true
    },
    id_alumno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'alumnos',
        key: 'id_alumno'
      }
    },
    id_asunto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'asuntos',
        key: 'id_asunto'
      }
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_atencion', 'atendido', 'cancelado'),
      defaultValue: 'pendiente'
    }
  }, {
    tableName: 'turnos',
    timestamps: false
  });
};