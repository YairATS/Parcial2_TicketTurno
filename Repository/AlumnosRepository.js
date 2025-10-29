import { Alumno } from '../models/Alumno.js';
import { sequelize } from '../models/database.js';

Alumno.init(sequelize);
class AlumnosRepository {
  async createAlumno(alumnoData) {
    try {
      const alumno = await Alumno.create(alumnoData);
      return alumno;
    } catch (error) {
      console.error('Error al crear el alumno:', error);
      throw error;
    }
  }
}

// Prueba de la clase AlumnosRepository
const alumnosRepository = new AlumnosRepository();
const alumnoData = {
  nombre: 'John',
  paterno: 'Doe',
  materno: 'Smith',
  id_municipio: 1,
  id_nivel: 1,
  nombre_completo: 'John Doe Smith'
};

alumnosRepository.createAlumno(alumnoData)
  .then(alumno => {
    console.log('Alumno creado:', alumno.toJSON());
  })
  .catch(error => {
    console.error('Error al crear el alumno:', error);
  });