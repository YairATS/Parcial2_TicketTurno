import { sequelize, Nivel, Municipio, Asunto, Alumno, Turno } from './models/database.js';

async function testConnection() {
  try {
    console.log('🔌 Iniciando prueba de conexión...\n');
    
    // 1. Probar conexión a la BD
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');
    
    // 2. Sincronizar modelos (solo crea tablas si no existen)
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados correctamente');
    
    // 3. Verificar que las tablas existen y pueden consultarse
    console.log('\n📊 Verificando tablas:');
    
    const nivelesCount = await Nivel.count();
    console.log(`   Tabla 'niveles': ✅ (${nivelesCount} registros)`);
    
    const municipiosCount = await Municipio.count();
    console.log(`   Tabla 'municipios': ✅ (${municipiosCount} registros)`);
    
    const asuntosCount = await Asunto.count();
    console.log(`   Tabla 'asuntos': ✅ (${asuntosCount} registros)`);
    
    const alumnosCount = await Alumno.count();
    console.log(`   Tabla 'alumnos': ✅ (${alumnosCount} registros)`);
    
    const turnosCount = await Turno.count();
    console.log(`   Tabla 'turnos': ✅ (${turnosCount} registros)`);
    
    // 4. Probar estructura de modelos
    console.log('\n🔍 Probando consultas básicas:');
    
    // Probar que podemos hacer consultas simples
    const municipios = await Municipio.findAll({ 
      attributes: ['id_municipio', 'nombre_municipio'], 
    });
    console.log('   Municipios encontrados:', municipios.length);
    
    const asuntos = await Asunto.findAll({
      attributes: ['id_asunto', 'nombre_asunto'],
      limit: 3
    });
    console.log('   Asuntos encontrados:', asuntos.length);

    const ListaMunicipios = municipios.map(m => m.nombre_municipio).join(', ');
    console.log('   Ejemplo de municipios:', ListaMunicipios);
    
    
    console.log('\n🎉 ¡Todas las pruebas pasaron correctamente!');
    console.log('✅ La base de datos está lista para usar');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('Detalles:', error);
  } finally {
    // Cerrar conexión
    await sequelize.close();
    console.log('\n🔒 Conexión cerrada');
  }
}

// Ejecutar la prueba
testConnection();
