DROP TABLE IF EXISTS turnos CASCADE;
DROP TABLE IF EXISTS alumnos CASCADE;
DROP TABLE IF EXISTS niveles CASCADE;
DROP TABLE IF EXISTS municipios CASCADE;
DROP TABLE IF EXISTS asuntos CASCADE;

-- Tablas de catálogo básicas
CREATE TABLE niveles (
    id_nivel SERIAL PRIMARY KEY,
    nombre_nivel VARCHAR(100) NOT NULL
);

CREATE TABLE municipios (
    id_municipio SERIAL PRIMARY KEY,
    nombre_municipio VARCHAR(100) NOT NULL
);

CREATE TABLE asuntos (
    id_asunto SERIAL PRIMARY KEY,
    nombre_asunto VARCHAR(200) NOT NULL
);

-- Tabla principal de alumnos
CREATE TABLE alumnos (
    id_alumno SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(200) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    paterno VARCHAR(100) NOT NULL,
    materno VARCHAR(100),
    curp VARCHAR(18) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    celular VARCHAR(15),
    correo VARCHAR(150),
    id_municipio INTEGER REFERENCES municipios(id_municipio),
    id_nivel INTEGER REFERENCES niveles(id_nivel),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de turnos
CREATE TABLE turnos (
    id_turno SERIAL PRIMARY KEY,
    numero_turno VARCHAR(20) UNIQUE NOT NULL,
    id_alumno INTEGER NOT NULL REFERENCES alumnos(id_alumno) ON DELETE CASCADE,
    id_asunto INTEGER NOT NULL REFERENCES asuntos(id_asunto),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_atencion', 'atendido', 'cancelado'))
);

-- Función simplificada para generar número de turno
CREATE OR REPLACE FUNCTION generar_numero_turno()
RETURNS TRIGGER AS $$
DECLARE
    abreviatura_municipio VARCHAR(4);
    contador_dia INTEGER;
BEGIN
    -- Obtener abreviatura del municipio (primeras 4 letras en mayúsculas)
    SELECT UPPER(SUBSTRING(m.nombre_municipio FROM 1 FOR 4))
    INTO abreviatura_municipio
    FROM alumnos a
    JOIN municipios m ON a.id_municipio = m.id_municipio
    WHERE a.id_alumno = NEW.id_alumno;
    
    -- Contar turnos de hoy para este municipio
    SELECT COUNT(*) + 1 INTO contador_dia
    FROM turnos t
    JOIN alumnos a ON t.id_alumno = a.id_alumno
    WHERE DATE(t.fecha_creacion) = CURRENT_DATE
    AND a.id_municipio = (SELECT id_municipio FROM alumnos WHERE id_alumno = NEW.id_alumno);
    
    -- Generar número de turno: ABRE-001
    NEW.numero_turno := abreviatura_municipio || '-' || LPAD(contador_dia::TEXT, 3, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_numero_turno
    BEFORE INSERT ON turnos
    FOR EACH ROW
    EXECUTE FUNCTION generar_numero_turno();

-- Datos básicos para los combos del formulario
INSERT INTO niveles (nombre_nivel) VALUES
('Licenciatura'),
('Maestría'),
('Doctorado'),
('Preparatoria'),
('Especialidad');

INSERT INTO municipios (nombre_municipio) VALUES
('Saltillo'),
('Torreón'),
('Monclova'),
('Piedras Negras'),
('Arteaga'),
('Ramos Arizpe'),
('Acuña'),
('Matamoros');

INSERT INTO asuntos (nombre_asunto) VALUES
('Inscripción'),
('Reinscripción'),
('Certificado'),
('Constancia'),
('Kardex'),
('Información General'),
('Titulación'),
('Beca'),
('Cambio de Carrera'),
('Equivalencias');