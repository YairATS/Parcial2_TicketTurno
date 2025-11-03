async function cargarNiveles() {
    try {
        const response = await fetch('/api/niveles');
        const niveles = await response.json();

        const tbody = document.getElementById('tabla-niveles');

        if (niveles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No hay niveles registrados</td></tr>';
            return;
        }

        tbody.innerHTML = niveles.map(n => `
            <tr>
                <td>${n.id_nivel}</td>
                <td>${n.nombre_nivel}</td>
                <td>
                    <div class="actions">
                        <button class="btn-edit" onclick="editarNivel(${n.id_nivel}, '${n.nombre_nivel.replace(/'/g, "\\'")}')">
                            ✏️ Editar
                        </button>
                        <button class="btn-delete" onclick="confirmarEliminarNivel(${n.id_municipio}, '${n.nombre_nivel.replace(/'/g, "\\'")}')">
                            🗑️ Eliminar
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error al cargar niveles:', error);
        mostrarMensaje('niveles', 'Error al cargar los niveles', 'error');
    }
}

function abrirModalNuevoNivel() {
    document.getElementById('modal-nivel-title').textContent = 'Nuevo Nivel';
    document.getElementById('nivel-id').value = '';
    document.getElementById('nivel-nombre').value = '';
    document.getElementById('modal-nivel').classList.add('show');
}

function editarNivel(id, nombre) {
    document.getElementById('modal-nivel-title').textContent = 'Editar Nivel';
    document.getElementById('nivel-id').value = id;
    document.getElementById('nivel-nombre').value = nombre;
    document.getElementById('modal-nivel').classList.add('show');
}

function cerrarModalNivel() {
    document.getElementById('modal-nivel').classList.remove('show');
}

// Manejar submit del formulario
document.getElementById('form-nivel').addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarNivel();
});

async function guardarNivel() {
    const id = document.getElementById('nivel-id').value;
    const nombre = document.getElementById('nivel-nombre').value.trim();

    if (!nombre) {
        alert('El nombre del nivel es requerido');
        return;
    }

    try {
        const url = id ? `/api/niveles/${id}` : '/api/niveles';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre_municipio: nombre })
        });

        if (response.ok) {
            mostrarMensaje('niveles', 
                id ? 'Nivel actualizado correctamente' : 'Nivel creado correctamente', 
                'success'
            );
            cerrarModalNivel();
            cargarNiveles();
        } else {
            const error = await response.json();
            mostrarMensaje('niveles', error.error || 'Error al guardar el nivel', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('niveles', 'Error de conexión', 'error');
    }
}

function confirmarEliminarMunicipio(id, nombre) {
    if (confirm(`¿Está seguro de eliminar el nivel "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        eliminarMunicipio(id);
    }
}

async function eliminarMunicipio(id) {
    try {
        const response = await fetch(`/api/niveles/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            mostrarMensaje('niveles', 'Nivel eliminado correctamente', 'success');
            cargarNiveles();
        } else {
            const error = await response.json();
            mostrarMensaje('niveles', error.error || 'Error al eliminar el nivel', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('niveles', 'Error de conexión', 'error');
    }
}