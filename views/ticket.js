// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del formulario
    const form = document.getElementById('ticket-form');
    const nombreCompletoInput = document.getElementById('nombre-completo');
    const nombreInput = document.getElementById('nombre');
    const paternoInput = document.getElementById('paterno');
    const maternoInput = document.getElementById('materno');
    const curpInput = document.getElementById('curp');
    const nivelSelect = document.getElementById('nivel');
    const municipioSelect = document.getElementById('municipio');
    const asuntoSelect = document.getElementById('asunto');

    // Cargar datos de los combos al iniciar
    cargarNiveles();
    cargarMunicipios();
    cargarAsuntos();

    // Auto-completar nombre completo cuando cambian los campos individuales
    [nombreInput, paternoInput, maternoInput].forEach(input => {
        input.addEventListener('input', actualizarNombreCompleto);
    });

    // Validar CURP en tiempo real
    curpInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
        validarCURP(this.value);
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validarFormulario()) {
            enviarSolicitud();
        }
    });

    // ==================== FUNCIONES ====================

    // Cargar niveles desde la API
    async function cargarNiveles() {
        try {
            const response = await fetch('/api/niveles');
            const niveles = await response.json();
            
            nivelSelect.innerHTML = '<option value="" disabled selected>Seleccione Nivel</option>';
            niveles.forEach(nivel => {
                const option = document.createElement('option');
                option.value = nivel.id_nivel;
                option.textContent = nivel.nombre_nivel;
                nivelSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar niveles:', error);
            mostrarError('No se pudieron cargar los niveles educativos');
        }
    }

    // Cargar municipios desde la API
    async function cargarMunicipios() {
        try {
            const response = await fetch('/api/municipios');
            const municipios = await response.json();
            
            municipioSelect.innerHTML = '<option value="" disabled selected>Seleccione Municipio</option>';
            municipios.forEach(municipio => {
                const option = document.createElement('option');
                option.value = municipio.id_municipio;
                option.textContent = municipio.nombre_municipio;
                municipioSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar municipios:', error);
            mostrarError('No se pudieron cargar los municipios');
        }
    }

    // Cargar asuntos desde la API
    async function cargarAsuntos() {
        try {
            const response = await fetch('/api/asuntos');
            const asuntos = await response.json();
            
            asuntoSelect.innerHTML = '<option value="" disabled selected>Seleccione Asunto</option>';
            asuntos.forEach(asunto => {
                const option = document.createElement('option');
                option.value = asunto.id_asunto;
                option.textContent = asunto.nombre_asunto;
                asuntoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar asuntos:', error);
            mostrarError('No se pudieron cargar los asuntos');
        }
    }

    // Actualizar nombre completo automáticamente
    function actualizarNombreCompleto() {
        const nombre = nombreInput.value.trim();
        const paterno = paternoInput.value.trim();
        const materno = maternoInput.value.trim();
        
        const nombreCompleto = [nombre, paterno, materno]
            .filter(parte => parte.length > 0)
            .join(' ');
        
        nombreCompletoInput.value = nombreCompleto;
    }

    // Validar formato de CURP
    function validarCURP(curp) {
        const curpRegex = /^[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9A-Z]{2}$/;
        
        if (curp.length === 18) {
            if (curpRegex.test(curp)) {
                curpInput.style.borderColor = '#28a745';
                return true;
            } else {
                curpInput.style.borderColor = '#dc3545';
                return false;
            }
        } else {
            curpInput.style.borderColor = '#ccc';
            return false;
        }
    }

    // Validar todo el formulario
    function validarFormulario() {
        let errores = [];

        // Validar nombre completo
        if (!nombreCompletoInput.value.trim()) {
            errores.push('El nombre completo es requerido');
        }

        // Validar nombre individual
        if (!nombreInput.value.trim()) {
            errores.push('El nombre es requerido');
        }

        // Validar apellido paterno
        if (!paternoInput.value.trim()) {
            errores.push('El apellido paterno es requerido');
        }

        // Validar CURP
        const curp = curpInput.value.trim();
        if (!curp) {
            errores.push('La CURP es requerida');
        } else if (!validarCURP(curp)) {
            errores.push('La CURP no tiene un formato válido');
        }

        // Validar nivel
        if (!nivelSelect.value) {
            errores.push('Debe seleccionar un nivel educativo');
        }

        // Validar municipio
        if (!municipioSelect.value) {
            errores.push('Debe seleccionar un municipio');
        }

        // Validar asunto
        if (!asuntoSelect.value) {
            errores.push('Debe seleccionar un asunto');
        }

        // Validar correo si se proporciona
        const correo = document.getElementById('correo').value.trim();
        if (correo) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                errores.push('El correo electrónico no es válido');
            }
        }

        // Mostrar errores si existen
        if (errores.length > 0) {
            mostrarError(errores.join('\n'));
            return false;
        }

        return true;
    }

    // Enviar solicitud al servidor
    async function enviarSolicitud() {
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';

        const datos = {
            alumno: {
                nombre_completo: nombreCompletoInput.value.trim(),
                nombre: nombreInput.value.trim(),
                paterno: paternoInput.value.trim(),
                materno: maternoInput.value.trim() || null,
                curp: curpInput.value.trim().toUpperCase(),
                telefono: document.getElementById('telefono').value.trim() || null,
                celular: document.getElementById('celular').value.trim() || null,
                correo: document.getElementById('correo').value.trim() || null,
                id_nivel: parseInt(nivelSelect.value),
                id_municipio: parseInt(municipioSelect.value)
            },
            turno: {
                id_asunto: parseInt(asuntoSelect.value)
            }
        };

        try {
            const response = await fetch('/api/turnos/public/solicitar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (response.ok) {
                mostrarExito(resultado);
            } else {
                mostrarError(resultado.error || 'Error al procesar la solicitud');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Generar Turno';
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarError('Error de conexión. Por favor, intente nuevamente.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Generar Turno';
        }
    }

    // Mostrar mensaje de éxito
    function mostrarExito(resultado) {
        alert(`✅ Turno generado exitosamente!\n\nNúmero de turno: ${resultado.turno.numero_turno}\nCURP: ${resultado.alumno.curp}\n\nGuarde estos datos para consultar su turno.`);
        
        // Limpiar formulario
        form.reset();
        nombreCompletoInput.value = '';
        
        // Recargar combos
        nivelSelect.innerHTML = '<option value="" disabled selected>Seleccione Nivel</option>';
        municipioSelect.innerHTML = '<option value="" disabled selected>Seleccione Municipio</option>';
        asuntoSelect.innerHTML = '<option value="" disabled selected>Seleccione Asunto</option>';
        
        cargarNiveles();
        cargarMunicipios();
        cargarAsuntos();

        // Rehabilitar botón
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Generar Turno';
    }

    // Mostrar mensaje de error
    function mostrarError(mensaje) {
        alert('❌ Error:\n\n' + mensaje);
    }
});