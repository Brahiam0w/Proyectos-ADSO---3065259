
// Variables globales
let mesas = [];
let contadorMesas = 1;

// Función para generar ID único automático
function generarIdMesa() {
    return `MESA-${String(contadorMesas).padStart(3, '0')}`;
}

// Función para obtener clases de Tailwind según el estado
function getClasesTailwind(estado) {
    switch (estado) {
        case 'Disponible':
            return 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100';
        case 'Ocupada':
            return 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100';
        case 'Deshabilitada':
            return 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100';
        default:
            return 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100';
    }
}

// Función para obtener el color del badge de Bootstrap
function getBadgeBootstrap(estado) {
    switch (estado) {
        case 'Disponible':
            return 'bg-success';
        case 'Ocupada':
            return 'bg-danger';
        case 'Deshabilitada':
            return 'bg-secondary';
        default:
            return 'bg-primary';
    }
}

// Función para crear el HTML de una mesa (combinando Tailwind + Bootstrap)
function crearTarjetaMesa(mesa) {
    const clasesTailwind = getClasesTailwind(mesa.estado);
    const badgeBootstrap = getBadgeBootstrap(mesa.estado);

    return `
                <div class="border-2 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${clasesTailwind}">
                    <div class="flex justify-between items-start mb-3">
                        <h5 class="text-xl font-bold">${mesa.id}</h5>
                        <span class="badge ${badgeBootstrap} rounded-pill px-3 py-2">${mesa.estado}</span>
                    </div>
                    
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center">
                            <span class="text-2xl mr-2">👥</span>
                            <span class="font-medium">Capacidad:</span>
                            <span class="ml-1 font-bold">${mesa.capacidad} personas</span>
                        </div>
                        
                        <div class="flex items-center">
                            <span class="text-2xl mr-2">📍</span>
                            <span class="font-medium">Ubicación:</span>
                            <span class="ml-1">${mesa.ubicacion}</span>
                        </div>
                        
                        <div class="flex items-center text-sm text-gray-600">
                            <span class="text-lg mr-2">🕐</span>
                            <span>Creada: ${mesa.fechaCreacion}</span>
                        </div>
                    </div>
                    
                    <div class="flex gap-2 pt-3 border-t border-current border-opacity-20">
                        <button 
                            class="btn btn-sm btn-outline-primary rounded-lg flex-1 hover:scale-105 transition-transform"
                            onclick="editarMesa('${mesa.id}')">
                            ✏️ Editar
                        </button>
                        <button 
                            class="btn btn-sm btn-outline-danger rounded-lg flex-1 hover:scale-105 transition-transform"
                            onclick="eliminarMesa('${mesa.id}')">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            `;
}

// Función para renderizar todas las mesas
function renderizarMesas() {
    const container = document.getElementById('mesasContainer');
    const emptyState = document.getElementById('emptyState');

    if (mesas.length === 0) {
        container.innerHTML = `
                    <div id="emptyState" class="col-span-full text-center py-12 cursor-pointer">
                        <div class="text-gray-600" >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="mx-auto h-20 w-20 mb-4" fill="none" viewBox="0 0 20 20">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-500 mb-2">No hay mesas registradas</h3>
                        <p class="text-gray-400">Haz clic en "AÑADIR MESA" para comenzar</p>
                    </div>
                `;
    } else {
        container.innerHTML = mesas.map(mesa => crearTarjetaMesa(mesa)).join('');
    }
}

// Función para añadir una nueva mesa
function anadirMesa(evento) {
    console.log('🔄 Función anadirMesa ejecutada');
    evento.preventDefault();
    evento.stopPropagation();

    // Obtener valores del formulario
    const capacidadInput = document.getElementById('capacidadMesa');
    const ubicacionSelect = document.getElementById('ubicacionMesa');
    const estadoSelect = document.getElementById('estadoMesa');

    if (!capacidadInput || !ubicacionSelect || !estadoSelect) {
        console.error('❌ No se encontraron los elementos del formulario');
        mostrarNotificacion('❌ Error: No se pudieron encontrar los campos del formulario', 'danger');
        return;
    }

    const capacidad = parseInt(capacidadInput.value);
    const ubicacion = ubicacionSelect.value;
    const estado = estadoSelect.value;

    console.log('📊 Datos del formulario:', { capacidad, ubicacion, estado });

    // Validación
    if (!capacidad || !ubicacion || !estado) {
        console.warn('⚠️ Validación fallida: campos vacíos');
        mostrarNotificacion('⚠️ Por favor, completa todos los campos', 'warning');
        return;
    }

    if (capacidad < 1 || capacidad > 20) {
        console.warn('⚠️ Validación fallida: capacidad fuera de rango');
        mostrarNotificacion('⚠️ La capacidad debe estar entre 1 y 20 personas', 'warning');
        return;
    }

    // Crear nueva mesa
    const nuevaMesa = {
        id: generarIdMesa(),
        capacidad: capacidad,
        ubicacion: ubicacion,
        estado: estado,
        fechaCreacion: new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    console.log('✨ Nueva mesa creada:', nuevaMesa);

    // Añadir a la lista
    mesas.push(nuevaMesa);
    contadorMesas++;

    // Limpiar formulario
    const form = document.getElementById('formMesa');
    if (form) {
        form.reset();
    }

    // Cerrar modal
    const modalElement = document.getElementById('modalMesa');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    } else {
        // Crear nueva instancia si no existe
        const newModal = new bootstrap.Modal(modalElement);
        newModal.hide();
    }

    // Renderizar mesas actualizadas
    renderizarMesas();

    // Mostrar notificación de éxito
    mostrarNotificacion(`✅ Mesa ${nuevaMesa.id} añadida exitosamente`, 'success');

    console.log('✅ Mesa añadida exitosamente. Total de mesas:', mesas.length);
}

// Función para eliminar mesa
function eliminarMesa(id) {
    // Confirmación personalizada con SweetAlert-like
    if (confirm(`🗑️ ¿Estás seguro de que deseas eliminar la mesa ${id}?\n\nEsta acción no se puede deshacer.`)) {
        const index = mesas.findIndex(mesa => mesa.id === id);
        if (index !== -1) {
            mesas.splice(index, 1);
            renderizarMesas();
            mostrarNotificacion(`🗑️ Mesa ${id} eliminada exitosamente`, 'danger');
        }
    }
}

// Función para editar mesa (placeholder mejorado)
function editarMesa(id) {
    const mesa = mesas.find(m => m.id === id);
    if (mesa) {
        alert(`✏️ Editar Mesa: ${mesa.id}\n\n` +
            `📊 Capacidad actual: ${mesa.capacidad} personas\n` +
            `📍 Ubicación actual: ${mesa.ubicacion}\n` +
            `🔄 Estado actual: ${mesa.estado}\n` +
            `🕐 Creada el: ${mesa.fechaCreacion}\n\n` +
            `💡 Esta funcionalidad se puede implementar con otro modal similar.`);
    }
}

// Función para mostrar notificaciones (usando Tailwind + Bootstrap)
function mostrarNotificacion(mensaje, tipo = 'info') {
    const container = document.getElementById('notificationContainer');

    // Limpiar notificaciones anteriores
    container.innerHTML = '';

    // Mapear tipos a clases de Bootstrap y colores de Tailwind
    const tiposConfig = {
        'success': { bootstrap: 'alert-success', tailwind: 'bg-green-100 border-green-400 text-green-700' },
        'danger': { bootstrap: 'alert-danger', tailwind: 'bg-red-100 border-red-400 text-red-700' },
        'warning': { bootstrap: 'alert-warning', tailwind: 'bg-yellow-100 border-yellow-400 text-yellow-700' },
        'info': { bootstrap: 'alert-info', tailwind: 'bg-blue-100 border-blue-400 text-blue-700' }
    };

    const config = tiposConfig[tipo] || tiposConfig['info'];

    // Crear elemento de notificación
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${config.bootstrap} alert-dismissible fade show shadow-lg rounded-xl border-l-4 max-w-md`;
    alertDiv.innerHTML = `
                <div class="font-medium">${mensaje}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;

    container.appendChild(alertDiv);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }
    }, 5000);
}

// Event listeners principales
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Sistema de Mesas iniciado correctamente');

    // Event listener para el formulario
    const form = document.getElementById('formMesa');
    if (form) {
        form.addEventListener('submit', function (evento) {
            console.log('📝 Formulario enviado');
            anadirMesa(evento);
        });
        console.log('✅ Event listener del formulario configurado');
    } else {
        console.error('❌ No se encontró el formulario');
    }

    // Event listener alternativo para el botón de submit
    const submitBtn = document.querySelector('#formMesa button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', function (evento) {
            console.log('🖱️ Botón submit clickeado');
            evento.preventDefault();
            anadirMesa(evento);
        });
    }

    // Renderizar estado inicial
    renderizarMesas();

    // Event listener para cuando se abre el modal
    const modalElement = document.getElementById('modalMesa');
    if (modalElement) {
        modalElement.addEventListener('shown.bs.modal', function () {
            // Focus en el primer campo cuando se abre el modal
            const capacidadInput = document.getElementById('capacidadMesa');
            if (capacidadInput) {
                capacidadInput.focus();
            }
        });
    }

    console.log('Sistema completamente inicializado');
});
