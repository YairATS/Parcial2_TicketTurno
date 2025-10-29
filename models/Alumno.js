// javascript
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Alumno extends Model {
    getNombreCompleo() {
      return `${this.nombre} ${this.paterno} ${this.materno || ''}`.trim();
    }
  }

  Alumno.init({
    id_alumno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_completo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre completo no puede estar vacío' },
        len: { args: [2, 200], msg: 'El nombre completo debe tener entre 2 y 200 caracteres' }
      }
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true, len: [2, 100] }
    },
    paterno: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true, len: [2, 100] }
    },
    materno: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: { len: { args: [0, 100], msg: 'El apellido materno no puede exceder 100 caracteres' } }
    },
    curp: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: { name: 'curp_unique', msg: 'Ya existe un alumno con esta CURP' },
      validate: {
        notEmpty: true,
        len: [18, 18],
        is: { args: /^[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9A-Z]{2}$/, msg: 'La CURP debe tener un formato válido' }
      }
    },
    telefono: {
      type: DataTypes.STRING(15),
      validate: { len: [0, 15], is: { args: /^[0-9()+-\s]*$/, msg: 'El teléfono solo puede contener números y símbolos telefónicos' } }
    },
    celular: {
      type: DataTypes.STRING(15),
      validate: { len: [0, 15], is: { args: /^[0-9()+-\s]*$/, msg: 'El celular solo puede contener números y símbolos telefónicos' } }
    },
    correo: {
      type: DataTypes.STRING(150),
      validate: { isEmail: { msg: 'Debe proporcionar un correo electrónico válido' }, len: [0, 150] }
    },
    id_municipio: {
      type: DataTypes.INTEGER,
      validate: { isInt: { msg: 'El municipio debe ser un ID válido' } }
    },
    id_nivel: {
      type: DataTypes.INTEGER,
      validate: { isInt: { msg: 'El nivel debe ser un ID válido' } }
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Alumno',
    tableName: 'alumnos',
    timestamps: false,
    hooks: {
      beforeValidate: (alumno) => {
        if (!alumno.nombre_completo && alumno.nombre && alumno.paterno) {
          alumno.nombre_completo = `${alumno.nombre} ${alumno.paterno} ${alumno.materno || ''}`.trim();
        }
      }
    }
  });

  return Alumno;
};