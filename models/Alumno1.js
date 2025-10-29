// models/Alumno.js
const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("./database.js");
 
const Alumno = sequelize.define(
  "Alumno",
  {
    id_alumno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_completo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    paterno: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    materno: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    curp: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: {
        name: "curp_unique",
        msg: "Ya existe un alumno con esta CURP",
      },
      validate: {
        notEmpty: true,
        len: [18, 18],
        is: {
          args: /^[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9A-Z]{2}$/,
          msg: "La CURP debe tener un formato válido",
        },
      },
    },
    telefono: {
      type: DataTypes.STRING(15),
      validate: {
        len: [0, 15],
        is: {
          args: /^[0-9()+-\s]*$/,
          msg: "El teléfono solo puede contener números y símbolos telefónicos",
        },
      },
    },
    celular: {
      type: DataTypes.STRING(15),
      validate: {
        len: [0, 15],
        is: {
          args: /^[0-9()+-\s]*$/,
          msg: "El celular solo puede contener números y símbolos telefónicos",
        },
      },
    },
    correo: {
      type: DataTypes.STRING(150),
      validate: {
        isEmail: {
          msg: "Debe proporcionar un correo electrónico válido",
        },
        len: [0, 150],
      },
    },
    id_municipio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "municipios",
        key: "id_municipio",
      },
    },
    id_nivel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "niveles",
        key: "id_nivel",
      },
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "alumnos",
    timestamps: false,
  }
);

module.exports = Alumno;  
    