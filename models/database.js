// javascript
import { Sequelize } from 'sequelize';
import 'dotenv/config';

class Database {
  constructor() {
    if (!Database.instance) {
      this.sequelize = new Sequelize('P2_Ticket', 'postgres', 'Yair316@!', {
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
      });

      // placeholders until init()
      this.Nivel = null;
      this.Municipio = null;
      this.Asunto = null;
      this.Alumno = null;
      this.Turno = null;
      this.Administrador = null;

      Database.instance = this;
    }

    return Database.instance;
  }

  async init() {
    // Use dynamic import() in ESM
    const { default: NivelModel } = await import('./Nivel.js');
    const { default: MunicipioModel } = await import('./Municipio.js');
    const { default: AsuntoModel } = await import('./Asunto.js');
    const { default: AlumnoModel } = await import('./Alumno.js');
    const { default: TurnoModel } = await import('./Turno.js');
    const { default: AdministradorModel } = await import('./Administrador.js');

    // If your model factories expect (sequelize, DataTypes), pass DataTypes:
    const DataTypes = Sequelize.DataTypes;

    this.Nivel = NivelModel(this.sequelize, DataTypes);
    this.Municipio = MunicipioModel(this.sequelize, DataTypes);
    this.Asunto = AsuntoModel(this.sequelize, DataTypes);
    this.Alumno = AlumnoModel(this.sequelize, DataTypes);
    this.Turno = TurnoModel(this.sequelize, DataTypes);
    this.Administrador = AdministradorModel(this.sequelize, DataTypes);

    this.initializeRelationships();
  }

  initializeRelationships() {
    this.Alumno.belongsTo(this.Municipio, { foreignKey: 'id_municipio' });
    this.Alumno.belongsTo(this.Nivel, { foreignKey: 'id_nivel' });

    this.Turno.belongsTo(this.Alumno, { foreignKey: 'id_alumno' });
    this.Turno.belongsTo(this.Asunto, { foreignKey: 'id_asunto' });

    this.Municipio.hasMany(this.Alumno, { foreignKey: 'id_municipio' });
    this.Nivel.hasMany(this.Alumno, { foreignKey: 'id_nivel' });
    this.Alumno.hasMany(this.Turno, { foreignKey: 'id_alumno' });
    this.Asunto.hasMany(this.Turno, { foreignKey: 'id_asunto' });
  }

  async testConnection() {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Conexión a la base de datos establecida correctamente');
      return true;
    } catch (error) {
      console.error('❌ No se pudo conectar a la base de datos:', error);
      return false;
    }
  }
}

const instance = new Database();
await instance.init(); // top-level await is valid in ESM

export const sequelize = instance.sequelize;
export const Nivel = instance.Nivel;
export const Municipio = instance.Municipio;
export const Asunto = instance.Asunto;
export const Alumno = instance.Alumno;
export const Turno = instance.Turno;
export const Administrador = instance.Administrador;
export const testConnection = instance.testConnection.bind(instance);
