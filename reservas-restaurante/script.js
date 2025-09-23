/* script.js - completo (correcciones: recreate Add button + evitar toasts duplicadas) */

/* ---------------- Toast system ---------------- */
function showToast(message, options = {}) {
  const opts = Object.assign({ type: 'info', title: null, timeout: 4000, sticky: false, id: null }, options);
  let container = document.getElementById('toasts');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toasts';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    container.style.position = 'fixed';
    container.style.zIndex = '1080';
    container.style.right = '1rem';
    container.style.bottom = '1rem';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.5rem';
    container.style.alignItems = 'flex-end';
    document.body.appendChild(container);
  }

  const toastId = opts.id || `toast_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const toast = document.createElement('div');
  toast.className = `toast-custom toast-${opts.type}`;
  toast.id = toastId;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const icon = document.createElement('div');
  icon.style.fontSize = '1.05rem';
  icon.style.width = '28px';
  icon.style.textAlign = 'center';
  icon.style.flex = '0 0 28px';
  icon.innerHTML = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' }[opts.type] || 'ℹ️';

  const content = document.createElement('div');
  content.style.flex = '1 1 auto';
  if (opts.title) {
    const title = document.createElement('div');
    title.className = 'toast-title';
    title.textContent = opts.title;
    content.appendChild(title);
  }
  const body = document.createElement('div');
  body.className = 'toast-body';
  body.textContent = message;
  content.appendChild(body);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.setAttribute('aria-label', 'Cerrar notificación');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => hideToast(toastId));

  toast.appendChild(icon);
  toast.appendChild(content);
  toast.appendChild(closeBtn);

  container.insertBefore(toast, container.firstChild);

  if (!opts.sticky && opts.timeout > 0) {
    toast._timeoutId = setTimeout(() => hideToast(toastId), opts.timeout);
  }

  return toastId;
}

function hideToast(id) {
  const node = document.getElementById(id);
  if (!node) return;
  if (node._timeoutId) clearTimeout(node._timeoutId);
  node.style.transition = 'transform 160ms ease, opacity 160ms ease';
  node.style.transform = 'translateX(10px)';
  node.style.opacity = '0';
  setTimeout(() => { if (node && node.parentNode) node.parentNode.removeChild(node); }, 180);
}

/* ---------------- Validación nativa reemplazada (robusta) ---------------- */
(function replaceNativeValidation() {
  function getLabelTextFor(el) {
    if (!el) return null;
    if (el.id) {
      const lbl = document.querySelector(`label[for="${el.id}"]`);
      if (lbl) return lbl.innerText.trim();
    }
    const parentLabel = el.closest('label');
    if (parentLabel) return parentLabel.innerText.trim();
    return el.placeholder || el.getAttribute('aria-label') || el.name || el.id || 'Este campo';
  }

  // Evita toasts duplicadas por campo en un corto periodo
  const INVALID_THROTTLE_MS = 1200;

  function markInvalidField(field, message) {
    if (!field) return;
    // si ya lo manejamos hace poco, no mostramos otra toast
    const last = Number(field.dataset.invalidHandledAt || 0);
    const now = Date.now();
    if (now - last < INVALID_THROTTLE_MS) {
      // solo aseguramos feedback visual, no toast
      field.classList.add('is-invalid');
      let feedback = field.nextElementSibling;
      if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        field.parentNode.insertBefore(feedback, field.nextSibling);
      }
      feedback.textContent = message;
      try { field.focus(); } catch (e) {}
      return;
    }

    field.dataset.invalidHandledAt = String(now);
    field.classList.add('is-invalid');

    let feedback = field.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      field.parentNode.insertBefore(feedback, field.nextSibling);
    }
    feedback.textContent = message;

    // mostrar toast una única vez
    showToast(message, { type: 'warning', timeout: 4200 });

    try { field.focus(); } catch (err) {}
    // limpiar el flag tras un tiempo para permitir futuras validaciones
    setTimeout(() => {
      delete field.dataset.invalidHandledAt;
    }, INVALID_THROTTLE_MS + 200);
  }

  function clearInvalidField(field) {
    if (!field) return;
    if (field.classList.contains('is-invalid')) {
      try {
        if (field.checkValidity && field.checkValidity()) {
          field.classList.remove('is-invalid');
          const fb = field.nextElementSibling;
          if (fb && fb.classList.contains('invalid-feedback')) fb.textContent = '';
        }
      } catch (err) {}
    }
  }

  function disableNativeValidationOnForms() {
    document.querySelectorAll('form').forEach(f => {
      try {
        f.setAttribute('novalidate', 'novalidate');
        f.noValidate = true;
      } catch (err) {}
    });
  }

  function onInvalidCapture(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const field = e.target;
    if (!field) return;
    const label = getLabelTextFor(field);
    const message = label ? `${label} es obligatorio.` : 'Completa este campo.';
    markInvalidField(field, message);
  }

  function onFormSubmitCapture(e) {
    const form = e.target;
    if (!form || form.nodeName !== 'FORM') return;
    form.noValidate = true;
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopImmediatePropagation();
      // primer campo inválido
      const invalidField = Array.from(form.elements).find(el => typeof el.checkValidity === 'function' && !el.checkValidity());
      if (invalidField) {
        const label = getLabelTextFor(invalidField);
        const message = label ? `${label} es obligatorio.` : 'Completa este campo.';
        markInvalidField(invalidField, message);
      } else {
        showToast('Completa los campos obligatorios', { type: 'warning' });
      }
      return false;
    }
    return true;
  }

  function ensureNoValidateOnModalOpen() {
    document.querySelectorAll('.modal').forEach(modalEl => {
      modalEl.addEventListener('shown.bs.modal', () => {
        disableNativeValidationOnForms();
      });
    });
  }

  function attach() {
    disableNativeValidationOnForms();
    document.addEventListener('invalid', onInvalidCapture, true);
    document.addEventListener('submit', onFormSubmitCapture, true);
    document.addEventListener('input', (e) => clearInvalidField(e.target), true);
    document.addEventListener('change', (e) => clearInvalidField(e.target), true);
    ensureNoValidateOnModalOpen();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();

/* ---------------- Helpers fecha/timestamps ---------------- */
function parseFechaHoraLocal(fechaStr, horaStr) {
  if (!fechaStr || !horaStr) return null;
  const f = fechaStr.split('-'), h = horaStr.split(':');
  if (f.length !== 3 || h.length < 2) return null;
  const y = Number(f[0]), m = Number(f[1]) - 1, d = Number(f[2]), hh = Number(h[0]), mm = Number(h[1]);
  if ([y,m,d,hh,mm].some(Number.isNaN)) return null;
  return new Date(y,m,d,hh,mm,0,0);
}

function ensureTimestamps(reservas) {
  let changed = false;
  const defaultDur = 120;
  reservas.forEach(r => {
    if (!r) return;
    const dur = Number(r.duracionMinutos) || defaultDur;
    if (r.startTimestamp && r.endTimestamp) {
      r.startTimestamp = Number(r.startTimestamp);
      r.endTimestamp = Number(r.endTimestamp);
      return;
    }
    const d = parseFechaHoraLocal(r.fechaReserva, r.horaReserva);
    if (!d) return;
    r.startTimestamp = d.getTime();
    r.endTimestamp = r.startTimestamp + dur * 60 * 1000;
    r.duracionMinutos = dur;
    changed = true;
  });
  return changed;
}

/* ---------------- Core logic ---------------- */
function aplicarEstadosSegunReservas() {
  try {
    const ahora = Date.now();
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const mesas = JSON.parse(localStorage.getItem('mesas')) || [];

    const modified = ensureTimestamps(reservas);
    if (modified) localStorage.setItem('reservas', JSON.stringify(reservas));

    mesas.forEach(m => { if (m.estado !== 'Deshabilitada') m.estado = 'Disponible'; });

    const ocupadas = new Set();
    let finalizadas = 0;

    reservas.forEach(r => {
      if (!r) return;
      if (r.estado !== 'Pendiente' && r.estado !== 'Confirmada') return;
      const s = Number(r.startTimestamp), e = Number(r.endTimestamp);
      if (Number.isNaN(s) || Number.isNaN(e)) return;
      const mid = Number(r.idMesaAsignada);
      if (ahora >= s && ahora < e) {
        if (!Number.isNaN(mid)) ocupadas.add(mid);
      } else if (ahora >= e) {
        if (r.estado !== 'Finalizada') { r.estado = 'Finalizada'; finalizadas++; }
      }
    });

    mesas.forEach(m => {
      if (m.estado === 'Deshabilitada') return;
      const id = Number(m.id);
      m.estado = (!Number.isNaN(id) && ocupadas.has(id)) ? 'Ocupada' : 'Disponible';
    });

    localStorage.setItem('mesas', JSON.stringify(mesas));
    if (finalizadas > 0) localStorage.setItem('reservas', JSON.stringify(reservas));

    if (typeof window.actualizarMesas === 'function') window.actualizarMesas();
    if (typeof window.actualizarReservas === 'function') window.actualizarReservas();

    return { ocupadas: ocupadas.size, finalizadas };
  } catch (err) {
    console.error('aplicarEstadosSegunReservas error', err);
    return { ocupadas: 0, finalizadas: 0 };
  }
}

/* ---------------- Timers por reserva ---------------- */
const scheduledTimers = {};
function clearAllScheduledTimers() {
  Object.values(scheduledTimers).forEach(o => {
    if (o.startId) clearTimeout(o.startId);
    if (o.endId) clearTimeout(o.endId);
  });
  for (const k in scheduledTimers) delete scheduledTimers[k];
}
function scheduleTimersForReservation(reserva) {
  if (!reserva || typeof reserva.idReserva === 'undefined') return;
  const key = String(reserva.idReserva);
  if (scheduledTimers[key]) {
    if (scheduledTimers[key].startId) { clearTimeout(scheduledTimers[key].startId); scheduledTimers[key].startId = null; }
    if (scheduledTimers[key].endId) { clearTimeout(scheduledTimers[key].endId); scheduledTimers[key].endId = null; }
  } else scheduledTimers[key] = { startId: null, endId: null };

  if (!reserva.startTimestamp || !reserva.endTimestamp) {
    const d = parseFechaHoraLocal(reserva.fechaReserva, reserva.horaReserva);
    if (!d) return;
    const dur = Number(reserva.duracionMinutos) || 120;
    reserva.startTimestamp = d.getTime();
    reserva.endTimestamp = reserva.startTimestamp + dur * 60 * 1000;
    const all = JSON.parse(localStorage.getItem('reservas')) || [];
    const idx = all.findIndex(x => Number(x.idReserva) === Number(reserva.idReserva));
    if (idx >= 0) { all[idx] = reserva; localStorage.setItem('reservas', JSON.stringify(all)); }
  }

  const now = Date.now();
  const startDelay = Number(reserva.startTimestamp) - now;
  const endDelay = Number(reserva.endTimestamp) - now;

  if (startDelay > 0) {
    scheduledTimers[key].startId = setTimeout(() => {
      aplicarEstadosSegunReservas();
      showToast(`Reserva ${reserva.idReserva} iniciada — Mesa ${reserva.idMesaAsignada} ocupada`, { type: 'info', timeout: 3000 });
    }, startDelay);
  }

  if (endDelay > 0) {
    scheduledTimers[key].endId = setTimeout(() => {
      aplicarEstadosSegunReservas();
      showToast(`Reserva ${reserva.idReserva} finalizada — Mesa ${reserva.idMesaAsignada} liberada`, { type: 'success', timeout: 3500 });
    }, endDelay);
  }
}
function scheduleTimersForAllReservations() {
  clearAllScheduledTimers();
  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  reservas.forEach(scheduleTimersForReservation);
}

/* ---------------- Auto-ajustado + handlers ---------------- */
let logicalTimerId = null, uiTimerId = null;
function scheduleLogicalLoop(intervalMs = 60000) {
  if (logicalTimerId) clearTimeout(logicalTimerId);
  aplicarEstadosSegunReservas();
  scheduleTimersForAllReservations();
  const now = Date.now();
  const delay = intervalMs - (now % intervalMs) + 10;
  logicalTimerId = setTimeout(() => scheduleLogicalLoop(intervalMs), delay);
}
function scheduleUiLoop(uiIntervalMs = 5000) {
  if (uiTimerId) clearTimeout(uiTimerId);
  aplicarEstadosSegunReservas();
  if (typeof window.actualizarMesas === 'function') window.actualizarMesas();
  if (typeof window.actualizarReservas === 'function') window.actualizarReservas();
  uiTimerId = setTimeout(() => scheduleUiLoop(uiIntervalMs), uiIntervalMs);
}
function attachVisibilityAndStorageHandlers() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      aplicarEstadosSegunReservas();
      scheduleTimersForAllReservations();
      if (typeof window.actualizarMesas === 'function') window.actualizarMesas();
    }
  });
  window.addEventListener('focus', () => {
    aplicarEstadosSegunReservas();
    scheduleTimersForAllReservations();
    if (typeof window.actualizarMesas === 'function') window.actualizarMesas();
  });
  window.addEventListener('storage', (e) => {
    if (!e) return;
    if (e.key === 'reservas' || e.key === 'mesas') {
      aplicarEstadosSegunReservas();
      scheduleTimersForAllReservations();
      if (typeof window.actualizarMesas === 'function') window.actualizarMesas();
      if (typeof window.actualizarReservas === 'function') window.actualizarReservas();
    }
  });
}

/* ---------------- UI helpers: recrear Add Button si hace falta ---------------- */
/**
 * Crea un botón 'Añadir Mesa' con el mismo aspecto y comportamiento que el original.
 * Lo devuelve (no lo añade automáticamente).
 */
function createAddMesaButton() {
  const btn = document.createElement('div');
  btn.id = 'btnAddMesa';
  btn.className = 'sticky top-0 left-0 z-10 card w-full bg-white shadow-sm p-2.5 cursor-pointer flex flex-col items-center justify-center rounded-2xl';
  btn.setAttribute('data-bs-toggle', 'modal');
  btn.setAttribute('data-bs-target', '#miModal');
  btn.innerHTML = `
    <div class="text-gray-600">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
      </svg>
    </div>
    <h3 class="text-lg text-center font-medium text-gray-500">AÑADIR MESA</h3>
  `;
  // No es necesario adjuntar eventos especiales porque usamos data-bs-* para abrir modal
  return btn;
}

/* ---------------- UI: Mesas y Reservas rendering ---------------- */
function buildMesaCard(mesaData) {
  const div = document.createElement('div');
  const bgClass = mesaData.estado === 'Disponible' ? 'bg-green-100' : (mesaData.estado === 'Ocupada' ? 'bg-blue-100' : 'bg-gray-800 text-white');
  div.className = `card ${bgClass} shadow-xl p-4 flex flex-col justify-between items-center text-center rounded-2xl relative`;
  div.dataset.id = mesaData.id;
  div.innerHTML = `
    <h2 class="text-lg font-bold mb-2">Mesa ${mesaData.id}</h2>
    <div class="flex flex-col gap-1 text-sm mb-3">
      <p><span class="font-semibold">Capacidad:</span> ${mesaData.capacidad} personas</p>
      <p><span class="font-semibold">Ubicación:</span> ${mesaData.ubicacion}</p>
      <p><span class="font-semibold">Estado:</span> ${mesaData.estado}</p>
    </div>
    <div class="flex gap-2">
      <button class="btn btn-sm btn-warning btn-editar">✍️ Editar</button>
      <button class="btn btn-sm btn-primary btn-reservar">🗓️ Reservar</button>
      <button class="btn btn-sm btn-danger btn-eliminar">❌ Eliminar</button>
    </div>
  `;
  div.querySelector('.btn-editar').addEventListener('click', () => {
    document.getElementById('editMesaId').value = mesaData.id;
    document.getElementById('editCapacidad').value = mesaData.capacidad;
    document.getElementById('editUbicacion').value = mesaData.ubicacion;
    document.getElementById('editEstado').value = mesaData.estado;
    const modal = document.getElementById('modalEditarMesa');
    if (modal) new bootstrap.Modal(modal).show();
  });
  div.querySelector('.btn-reservar').addEventListener('click', () => {
    localStorage.setItem('mesaPreseleccionada', mesaData.id);
    window.location.href = 'reservas.html';
  });
  div.querySelector('.btn-eliminar').addEventListener('click', () => {
    mostrarConfirmacion(`¿Está seguro de que desea eliminar la Mesa ${mesaData.id}?`, () => {
      const mesasNow = JSON.parse(localStorage.getItem('mesas')) || [];
      const nuevas = mesasNow.filter(m => Number(m.id) !== Number(mesaData.id));
      localStorage.setItem('mesas', JSON.stringify(nuevas));
      if (typeof window.actualizarMesas === 'function') window.actualizarMesas();
      showToast('Mesa eliminada', { type: 'success' });
    });
  });
  return div;
}

function refreshMesasUI() {
  if (!document.getElementById('pagina-mesas')) return;
  const grid = document.getElementById('gridMesas');
  if (!grid) return;

  let contenedor = document.getElementById('contenedorMesas');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'contenedorMesas';
    contenedor.className = 'contents';
  }
  contenedor.innerHTML = '';

  const mesas = JSON.parse(localStorage.getItem('mesas')) || [];
  mesas.forEach(m => contenedor.appendChild(buildMesaCard(m)));

  // reconstruir grid sin eliminar el add button permanentemente:
  grid.innerHTML = '';

  // intentar obtener el btnAdd original; si no existe, crear uno nuevo
  let btnAdd = document.getElementById('btnAddMesa');
  if (!btnAdd) {
    btnAdd = createAddMesaButton();
  }
  grid.appendChild(btnAdd);
  grid.appendChild(contenedor);
}

/* ---------------- Reservas UI ---------------- */
function buildReservaCard(r) {
  const div = document.createElement('div');
  div.className = 'card shadow-sm p-2.5 rounded-2xl relative';
  const mesas = JSON.parse(localStorage.getItem('mesas')) || [];
  const mesa = mesas.find(m => Number(m.id) === Number(r.idMesaAsignada));
  const nombreMesa = mesa ? `Mesa ${mesa.id}` : `Mesa ${r.idMesaAsignada}`;
  let bg = '';
  switch (r.estado) {
    case 'Pendiente': bg = 'bg-yellow-100'; break;
    case 'Confirmada': bg = 'bg-green-100'; break;
    case 'Cancelada': bg = 'bg-red-100'; break;
    case 'Finalizada': bg = 'bg-gray-300'; break;
    case 'No Show': bg = 'bg-purple-100'; break;
  }
  if (bg) div.classList.add(bg.replace('bg-','bg-'));
  div.innerHTML = `
    <div class="text-center">
      <h3 class="text-lg font-bold mb-2">Reserva #${r.idReserva}</h3>
      <div class="text-sm space-y-1">
        <p><b>Cliente:</b> ${r.nombreCliente}</p>
        <p><b>Personas:</b> ${r.numeroPersonas}</p>
        <p><b>Fecha:</b> ${r.fechaReserva}</p>
        <p><b>Hora:</b> ${r.horaReserva}</p>
        <p><b>Mesa:</b> ${nombreMesa}</p>
        <p><b>Estado:</b> ${r.estado}</p>
      </div>
    </div>
    <div class="flex justify-around mt-2">
      <button class="btn btn-sm btn-warning btn-editar">✍️ Editar</button>
      <button class="btn btn-sm btn-success btn-pagar">💸 Pagar</button>
      <button class="btn btn-sm btn-danger btn-eliminar">❌ Eliminar</button>
    </div>
  `;
  div.querySelector('.btn-eliminar').addEventListener('click', () => {
    mostrarConfirmacion(`¿Está seguro de que desea eliminar la reserva de ${r.nombreCliente}?`, () => {
      let reservasNow = JSON.parse(localStorage.getItem('reservas')) || [];
      reservasNow = reservasNow.filter(x => Number(x.idReserva) !== Number(r.idReserva));
      localStorage.setItem('reservas', JSON.stringify(reservasNow));
      if (typeof window.actualizarReservas === 'function') window.actualizarReservas();
      showToast('Reserva eliminada', { type: 'success' });
    });
  });
  div.querySelector('.btn-pagar').addEventListener('click', () => {
    mostrarConfirmacion('¿Está seguro de marcar esta reserva como FINALIZADA?', () => {
      let reservasNow = JSON.parse(localStorage.getItem('reservas')) || [];
      const rr = reservasNow.find(x => Number(x.idReserva) === Number(r.idReserva));
      if (rr) {
        rr.estado = 'Finalizada';
        localStorage.setItem('reservas', JSON.stringify(reservasNow));
        const mesasNow = JSON.parse(localStorage.getItem('mesas')) || [];
        const mesa = mesasNow.find(m => Number(m.id) === Number(rr.idMesaAsignada));
        if (mesa) { mesa.estado = 'Disponible'; localStorage.setItem('mesas', JSON.stringify(mesasNow)); }
        if (typeof window.actualizarReservas === 'function') window.actualizarReservas();
        if (typeof window.actualizarMesas === 'function') window.actualizarMesas();
        showToast('Reserva marcada como Finalizada', { type: 'success' });
      }
    });
  });
  div.querySelector('.btn-editar').addEventListener('click', () => {
    cargarMesasEnSelect(r.idMesaAsignada);
    document.getElementById('editReservaId').value = r.idReserva;
    document.getElementById('nombreCliente').value = r.nombreCliente;
    document.getElementById('numeroPersonas').value = r.numeroPersonas;
    document.getElementById('fechaReserva').value = r.fechaReserva;
    document.getElementById('horaReserva').value = r.horaReserva;
    document.getElementById('ocasionEspecial').value = r.ocasionEspecial || '';
    document.getElementById('notasAdicionales').value = r.notasAdicionales || '';
    if (document.getElementById('mesaAsignada')) document.getElementById('mesaAsignada').value = r.idMesaAsignada || '';
    if (document.getElementById('estadoReserva')) document.getElementById('estadoReserva').value = r.estado || 'Pendiente';
    const modal = document.getElementById('modalReserva');
    if (modal) new bootstrap.Modal(modal).show();
  });
  return div;
}

function refreshReservasUI() {
  if (!document.getElementById('pagina-reservas')) return;
  let cont = document.getElementById('contenedorReservas');
  if (!cont) {
    cont = document.createElement('div'); cont.id = 'contenedorReservas'; cont.className = 'contents';
    const grid = document.getElementById('gridReservas'); if (grid) grid.appendChild(cont);
  }
  cont.innerHTML = '';
  const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
  reservas.forEach(r => cont.appendChild(buildReservaCard(r)));
}

/* ---------------- cargar select mesas ---------------- */
function cargarMesasEnSelect(selectedMesaId = null) {
  const mesaSelect = document.getElementById('mesaAsignada');
  if (!mesaSelect) return;
  mesaSelect.innerHTML = '<option value="">Seleccionar mesa...</option>';
  const mesas = JSON.parse(localStorage.getItem('mesas')) || [];
  mesas.forEach(m => {
    if (m.estado === 'Disponible' || (selectedMesaId !== null && Number(m.id) === Number(selectedMesaId))) {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `Mesa ${m.id} - ${m.capacidad} personas (${m.ubicacion})${m.estado !== 'Disponible' ? ' — ' + m.estado : ''}`;
      mesaSelect.appendChild(opt);
    }
  });
}

/* ---------------- mostrarConfirmacion (modal) ---------------- */
function mostrarConfirmacion(mensaje, callback) {
  const modal = document.getElementById('modalConfirmacion');
  const mensajeElement = document.getElementById('mensajeConfirmacion');
  let btnConfirmar = document.getElementById('btnConfirmarAccion');
  if (!modal || !mensajeElement || !btnConfirmar) { if (callback) callback(); return; }
  mensajeElement.textContent = mensaje;
  const nuevoBtn = btnConfirmar.cloneNode(true);
  btnConfirmar.parentNode.replaceChild(nuevoBtn, btnConfirmar);
  btnConfirmar = nuevoBtn;
  btnConfirmar.addEventListener('click', () => {
    if (typeof callback === 'function') callback();
    const inst = bootstrap.Modal.getInstance(modal);
    if (inst) inst.hide();
  });
  new bootstrap.Modal(modal).show();
}

/* ---------------- Inicialización/forms ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  window.actualizarMesas = refreshMesasUI;
  window.actualizarReservas = refreshReservasUI;
  if (document.getElementById('pagina-mesas')) refreshMesasUI();
  if (document.getElementById('pagina-reservas')) refreshReservasUI();

  attachVisibilityAndStorageHandlers();

  // Mesas form
  const mesaForm = document.getElementById('mesaForm');
  if (mesaForm) {
    mesaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let mesas = JSON.parse(localStorage.getItem('mesas')) || [];
      const contador = mesas.length ? Math.max(...mesas.map(m => Number(m.id))) + 1 : 1;
      const nueva = {
        id: contador,
        capacidad: document.getElementById('capacidad').value,
        ubicacion: document.getElementById('ubicacion').value,
        estado: document.getElementById('estado').value || 'Disponible'
      };
      mesas.push(nueva);
      localStorage.setItem('mesas', JSON.stringify(mesas));
      window.actualizarMesas();
      showToast('Mesa añadida', { type: 'success' });
      mesaForm.reset();
      const modal = document.getElementById('miModal');
      if (modal) (bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal)).hide();
    });
  }

  const editarMesaForm = document.getElementById('editarMesaForm');
  if (editarMesaForm) {
    editarMesaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let mesas = JSON.parse(localStorage.getItem('mesas')) || [];
      const id = Number(document.getElementById('editMesaId').value);
      const mesa = mesas.find(m => Number(m.id) === id);
      if (mesa) {
        mesa.capacidad = document.getElementById('editCapacidad').value;
        mesa.ubicacion = document.getElementById('editUbicacion').value;
        mesa.estado = document.getElementById('editEstado').value;
        localStorage.setItem('mesas', JSON.stringify(mesas));
        window.actualizarMesas();
        showToast('Mesa actualizada', { type: 'success' });
      }
      const modal = document.getElementById('modalEditarMesa');
      if (modal) (bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal)).hide();
    });
  }

  // Reservas form
  const reservaForm = document.getElementById('reservaForm');
  if (reservaForm) {
    const fechaInput = document.getElementById('fechaReserva');
    if (fechaInput) {
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
      fechaInput.min = tomorrow.toISOString().split('T')[0];
    }

    reservaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombreCliente').value.trim();
      const nro = parseInt(document.getElementById('numeroPersonas').value);
      const fecha = document.getElementById('fechaReserva').value;
      const hora = document.getElementById('horaReserva').value;
      const mesaId = Number(document.getElementById('mesaAsignada').value);
      if (!nombre || !nro || !fecha || !hora || !mesaId) {
        showToast('Completa todos los campos obligatorios', { type: 'warning' });
        return;
      }

      let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
      let contador = reservas.length ? Math.max(...reservas.map(r => Number(r.idReserva))) + 1 : 1;
      const editId = document.getElementById('editReservaId').value;
      const duracionMinutos = 120;

      if (editId) {
        const res = reservas.find(r => Number(r.idReserva) === Number(editId));
        if (res) {
          res.nombreCliente = nombre;
          res.numeroPersonas = nro;
          res.fechaReserva = fecha;
          res.horaReserva = hora;
          res.ocasionEspecial = document.getElementById('ocasionEspecial').value || null;
          res.notasAdicionales = document.getElementById('notasAdicionales').value.trim() || null;
          res.idMesaAsignada = mesaId;
          res.estado = document.getElementById('estadoReserva') ? document.getElementById('estadoReserva').value : res.estado;
          const inicio = parseFechaHoraLocal(res.fechaReserva, res.horaReserva);
          if (inicio) {
            res.startTimestamp = inicio.getTime();
            res.endTimestamp = res.startTimestamp + duracionMinutos * 60 * 1000;
            res.duracionMinutos = duracionMinutos;
          }
          localStorage.setItem('reservas', JSON.stringify(reservas));
          showToast('Reserva actualizada', { type: 'success' });
        }
      } else {
        const inicio = parseFechaHoraLocal(fecha, hora);
        const startTs = inicio ? inicio.getTime() : null;
        const endTs = startTs ? startTs + duracionMinutos * 60 * 1000 : null;
        const nueva = {
          idReserva: contador++,
          nombreCliente: nombre,
          numeroPersonas: nro,
          fechaReserva: fecha,
          horaReserva: hora,
          ocasionEspecial: document.getElementById('ocasionEspecial').value || null,
          notasAdicionales: document.getElementById('notasAdicionales').value.trim() || null,
          idMesaAsignada: mesaId,
          estado: document.getElementById('estadoReserva') ? document.getElementById('estadoReserva').value : 'Pendiente',
          startTimestamp: startTs,
          endTimestamp: endTs,
          duracionMinutos: duracionMinutos
        };
        reservas.push(nueva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        showToast('Reserva creada', { type: 'success' });
        scheduleTimersForReservation(nueva);
      }

      aplicarEstadosSegunReservas();
      if (typeof window.actualizarReservas === 'function') window.actualizarReservas();
      if (typeof window.actualizarMesas === 'function') window.actualizarMesas();

      reservaForm.reset();
      document.getElementById('editReservaId').value = '';
      cargarMesasEnSelect();
      const modal = document.getElementById('modalReserva');
      if (modal) (bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal)).hide();
    });
  }

  // Filtro
  const btnFiltrar = document.getElementById('btnFiltrar');
  if (btnFiltrar) {
    btnFiltrar.addEventListener('click', () => {
      const fechaFiltro = document.getElementById('filtroFecha').value;
      const estadoFiltro = document.getElementById('filtroEstado').value;
      const todas = JSON.parse(localStorage.getItem('reservas')) || [];
      const filtradas = todas.filter(r => (!fechaFiltro || r.fechaReserva === fechaFiltro))
                             .filter(r => (!estadoFiltro || r.estado === estadoFiltro));
      const cont = document.getElementById('contenedorReservas');
      if (!cont) return;
      cont.innerHTML = '';
      filtradas.forEach(r => cont.appendChild(buildReservaCard(r)));
    });
  }

  // preselección de mesa
  const mesaPreseleccionada = localStorage.getItem('mesaPreseleccionada');
  if (mesaPreseleccionada && document.getElementById('mesaAsignada')) {
    cargarMesasEnSelect(parseInt(mesaPreseleccionada));
    document.getElementById('mesaAsignada').value = mesaPreseleccionada;
    localStorage.removeItem('mesaPreseleccionada');
  }
});

/* ---------------- Inicio bucles y timers ---------------- */
window.addEventListener('load', () => {
  scheduleLogicalLoop(60000);
  scheduleUiLoop(5000);
  scheduleTimersForAllReservations();
});
