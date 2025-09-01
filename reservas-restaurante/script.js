if (document.getElementById('pagina-mesas')) {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("mesaForm");
    const grid = document.getElementById("gridMesas");
    const editarMesaForm = document.getElementById("editarMesaForm");
    let contenedorMesas = document.getElementById("contenedorMesas");
    if (!contenedorMesas && grid) {
      contenedorMesas = document.createElement("div");
      contenedorMesas.id = "contenedorMesas";
      contenedorMesas.className = "contents";
      grid.appendChild(contenedorMesas);
    }
    if (!grid) return;
    let mesas = JSON.parse(localStorage.getItem("mesas")) || [];
    let contadorMesas = mesas.length ? Math.max(...mesas.map(m => m.id)) + 1 : 1;
    actualizarMesas();
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const capacidad = document.getElementById("capacidad").value;
        const ubicacion = document.getElementById("ubicacion").value;
        const estado = document.getElementById("estado").value;

        const nuevaMesa = {
          id: contadorMesas++,
          capacidad,
          ubicacion,
          estado
        };

        mesas.push(nuevaMesa);
        localStorage.setItem("mesas", JSON.stringify(mesas));
        renderMesa(nuevaMesa);
        form.reset();
        const modal = document.getElementById("miModal");
        const modalInstance = modal ? (bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal)) : null;
        if (modalInstance) modalInstance.hide();
      });
    }
    if (editarMesaForm) {
      editarMesaForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById("editMesaId").value);
        const capacidad = document.getElementById("editCapacidad").value;
        const ubicacion = document.getElementById("editUbicacion").value;
        const estado = document.getElementById("editEstado").value;

        const mesa = mesas.find(m => m.id === id);
        if (mesa) {
          mesa.capacidad = capacidad;
          mesa.ubicacion = ubicacion;
          mesa.estado = estado;
          localStorage.setItem("mesas", JSON.stringify(mesas));
          actualizarMesas();
        }

        const modal = document.getElementById("modalEditarMesa");
        const inst = modal ? (bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal)) : null;
        if (inst) inst.hide();
      });
    }
    function renderMesa(mesaData) {
      let bgColor = "";
      if (mesaData.estado === "Disponible") bgColor = "bg-green-200";
      else if (mesaData.estado === "Ocupada") bgColor = "bg-blue-200";
      else if (mesaData.estado === "Deshabilitada") bgColor = "bg-black text-white";

      const mesaEl = document.createElement("div");
      mesaEl.className = `card ${bgColor} shadow-xl p-4 flex flex-col justify-between items-center text-center rounded-2xl relative`;
      mesaEl.dataset.id = mesaData.id;

      mesaEl.innerHTML = `
        <h2 class="text-lg font-bold mb-2">Mesa ${mesaData.id}</h2>
        <div class="flex flex-col gap-1 text-sm mb-3">
          <p><span class="font-semibold">Capacidad:</span> ${mesaData.capacidad} personas</p>
          <p><span class="font-semibold">Ubicación:</span> ${mesaData.ubicacion}</p>
          <p><span class="font-semibold">Estado:</span> ${mesaData.estado}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-warning btn-editar">✏️ Editar</button>
          <button class="btn btn-sm btn-primary btn-reservar">📅 Reservar</button>
          <button class="btn btn-sm btn-danger btn-eliminar">❌ Eliminar</button>
        </div>
      `;
      mesaEl.querySelector(".btn-editar").addEventListener("click", () => {
        document.getElementById("editMesaId").value = mesaData.id;
        document.getElementById("editCapacidad").value = mesaData.capacidad;
        document.getElementById("editUbicacion").value = mesaData.ubicacion;
        document.getElementById("editEstado").value = mesaData.estado;
        const modal = document.getElementById("modalEditarMesa");
        if (modal) new bootstrap.Modal(modal).show();
      });
      mesaEl.querySelector(".btn-reservar").addEventListener("click", () => {
        localStorage.setItem("mesaPreseleccionada", mesaData.id);
        window.location.href = "reservas.html";
      });
      mesaEl.querySelector(".btn-eliminar").addEventListener("click", () => {
        if (confirm(`¿Deseas eliminar la Mesa ${mesaData.id}?`)) {
          mesas = mesas.filter(m => m.id !== mesaData.id);
          localStorage.setItem("mesas", JSON.stringify(mesas));
          actualizarMesas();
        }
      });

      (contenedorMesas || grid).appendChild(mesaEl);
    }
    function actualizarMesas() {
      if (contenedorMesas) {
        contenedorMesas.innerHTML = "";
        mesas.forEach(m => renderMesa(m));
      } else {
        const btnAdd = document.getElementById("btnAddMesa");
        grid.innerHTML = "";
        if (btnAdd) grid.appendChild(btnAdd);
        mesas.forEach(m => renderMesa(m));
      }
    }
  });
}



if (document.getElementById('pagina-reservas')) {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reservaForm");
    const grid = document.getElementById("gridReservas");
    const mesaSelect = document.getElementById("mesaAsignada");
    let contenedorReservas = document.getElementById("contenedorReservas");
    if (!contenedorReservas && grid) {
      contenedorReservas = document.createElement("div");
      contenedorReservas.id = "contenedorReservas";
      contenedorReservas.className = "contents";
      grid.appendChild(contenedorReservas);
    }
    if (!grid) return;

    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    let mesas = JSON.parse(localStorage.getItem("mesas")) || [];
    let contadorReservas = reservas.length ? Math.max(...reservas.map(r => r.idReserva)) + 1 : 1;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fechaInput = document.getElementById("fechaReserva");
    if (fechaInput) fechaInput.min = tomorrow.toISOString().split('T')[0];
    function cargarMesasEnSelect(selectedMesaId = null) {
      if (!mesaSelect) return;
      mesaSelect.innerHTML = '<option value="">Seleccionar mesa...</option>';
      mesas = JSON.parse(localStorage.getItem("mesas")) || [];
      mesas.forEach(mesa => {
        if (mesa.estado === "Disponible" || (selectedMesaId !== null && mesa.id === selectedMesaId)) {
          const option = document.createElement("option");
          option.value = mesa.id;
          option.textContent = `Mesa ${mesa.id} - ${mesa.capacidad} personas (${mesa.ubicacion})${mesa.estado !== "Disponible" ? ' — ' + mesa.estado : ''}`;
          mesaSelect.appendChild(option);
        }
      });
    }
    function renderReserva(reservaData) {
      const reservaCard = document.createElement("div");
      reservaCard.className = "card shadow-sm p-2.5 rounded-2xl relative";

      let bgColor = "";
      switch (reservaData.estado) {
        case "Pendiente": bgColor = "bg-yellow-100"; break;
        case "Confirmada": bgColor = "bg-green-100"; break;
        case "Cancelada": bgColor = "bg-red-100"; break;
        case "Finalizada": bgColor = "bg-gray-300"; break;
        case "No Show": bgColor = "bg-purple-100"; break;
      }
      reservaCard.classList.add(bgColor);

      const mesa = mesas.find(m => m.id === reservaData.idMesaAsignada);
      const nombreMesa = mesa ? `Mesa ${mesa.id}` : `Mesa ${reservaData.idMesaAsignada}`;

      let img = "";
      if (reservaData.ocasionEspecial) {
        img = `<img src="img/${reservaData.ocasionEspecial.toLowerCase().replace(/ /g,'_')}.png" 
                  class="mx-auto mb-2 w-16 h-16">`;
      }

      reservaCard.innerHTML = `
        <div class="text-center">
          ${img}
          <h3 class="text-lg font-bold mb-2">Reserva #${reservaData.idReserva}</h3>
          <div class="text-sm space-y-1">
            <p><b>Cliente:</b> ${reservaData.nombreCliente}</p>
            <p><b>Personas:</b> ${reservaData.numeroPersonas}</p>
            <p><b>Fecha:</b> ${reservaData.fechaReserva}</p>
            <p><b>Hora:</b> ${reservaData.horaReserva}</p>
            <p><b>Mesa:</b> ${nombreMesa}</p>
            <p><b>Estado:</b> ${reservaData.estado}</p>
          </div>
        </div>
        <div class="flex justify-around mt-2">
          <button class="btn btn-sm btn-warning btn-editar">✏️ Editar</button>
          <button class="btn btn-sm btn-success btn-pagar">💲 Pagar</button>
          <button class="btn btn-sm btn-danger btn-eliminar">❌ Eliminar</button>
        </div>
      `;
      reservaCard.querySelector(".btn-eliminar").addEventListener("click", () => {
        if (confirm(`¿Eliminar la reserva de ${reservaData.nombreCliente}?`)) {
          reservas = reservas.filter(r => r.idReserva !== reservaData.idReserva);
          localStorage.setItem("reservas", JSON.stringify(reservas));
          actualizarReservas();
        }
      });
      reservaCard.querySelector(".btn-editar").addEventListener("click", () => {
        cargarMesasEnSelect(reservaData.idMesaAsignada);

        document.getElementById("editReservaId").value = reservaData.idReserva;
        document.getElementById("nombreCliente").value = reservaData.nombreCliente;
        document.getElementById("numeroPersonas").value = reservaData.numeroPersonas;
        document.getElementById("fechaReserva").value = reservaData.fechaReserva;
        document.getElementById("horaReserva").value = reservaData.horaReserva;
        document.getElementById("ocasionEspecial").value = reservaData.ocasionEspecial || "";
        document.getElementById("notasAdicionales").value = reservaData.notasAdicionales || "";
        if (document.getElementById("mesaAsignada")) document.getElementById("mesaAsignada").value = reservaData.idMesaAsignada || "";
        if (document.getElementById("estadoReserva")) document.getElementById("estadoReserva").value = reservaData.estado || "Pendiente";

        const modal = document.getElementById("modalReserva");
        if (modal) new bootstrap.Modal(modal).show();
      });
      reservaCard.querySelector(".btn-pagar").addEventListener("click", () => {
        if (!confirm("Marcar reserva como FINALIZADA?")) return;
        reservaData.estado = "Finalizada";
        mesas = JSON.parse(localStorage.getItem("mesas")) || [];
        const mesa = mesas.find(m => m.id === reservaData.idMesaAsignada);
        if (mesa) {
          mesa.estado = "Disponible";
          localStorage.setItem("mesas", JSON.stringify(mesas));
        }
        localStorage.setItem("reservas", JSON.stringify(reservas));
        actualizarReservas();
      });

      contenedorReservas.appendChild(reservaCard);
    }
    function actualizarReservas() {
      contenedorReservas.innerHTML = "";
      reservas.forEach(r => renderReserva(r));
    }
    function validarFormulario() {
      let esValido = true;
      document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      const nombre = document.getElementById("nombreCliente");
      const numero = document.getElementById("numeroPersonas");
      if (!nombre || !numero) return false;
      if (!nombre.value.trim()) {
        mostrarError("nombreCliente", "El nombre es obligatorio");
        esValido = false;
      }
      const personas = parseInt(numero.value);
      if (!personas || personas <= 0) {
        mostrarError("numeroPersonas", "Número inválido");
        esValido = false;
      }
      return esValido;
    }
    function mostrarError(campoId, mensaje) {
      const campo = document.getElementById(campoId);
      if (!campo) return;
      campo.classList.add('is-invalid');
      const feedback = campo.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = mensaje;
      }
    }
    actualizarReservas();
    cargarMesasEnSelect();
    const mesaPreseleccionada = localStorage.getItem("mesaPreseleccionada");
    if (mesaPreseleccionada && document.getElementById("mesaAsignada")) {
      cargarMesasEnSelect(parseInt(mesaPreseleccionada));
      document.getElementById("mesaAsignada").value = mesaPreseleccionada;
      localStorage.removeItem("mesaPreseleccionada");
    }
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;
        reservas = JSON.parse(localStorage.getItem("reservas")) || reservas;
        mesas = JSON.parse(localStorage.getItem("mesas")) || mesas;

        const editId = document.getElementById("editReservaId").value;
        if (editId) {
          
          const reserva = reservas.find(r => r.idReserva == editId);
          if (reserva) {
            reserva.nombreCliente = document.getElementById("nombreCliente").value.trim();
            reserva.numeroPersonas = parseInt(document.getElementById("numeroPersonas").value);
            reserva.fechaReserva = document.getElementById("fechaReserva").value;
            reserva.horaReserva = document.getElementById("horaReserva").value;
            reserva.ocasionEspecial = document.getElementById("ocasionEspecial").value || null;
            reserva.notasAdicionales = document.getElementById("notasAdicionales").value.trim() || null;
            reserva.idMesaAsignada = parseInt(document.getElementById("mesaAsignada").value) || null;
            
            reserva.estado = document.getElementById("estadoReserva") ? document.getElementById("estadoReserva").value : reserva.estado;
          }
        } else {
          const nuevaReserva = {
            idReserva: contadorReservas++,
            nombreCliente: document.getElementById("nombreCliente").value.trim(),
            numeroPersonas: parseInt(document.getElementById("numeroPersonas").value),
            fechaReserva: document.getElementById("fechaReserva").value,
            horaReserva: document.getElementById("horaReserva").value,
            ocasionEspecial: document.getElementById("ocasionEspecial").value || null,
            notasAdicionales: document.getElementById("notasAdicionales").value.trim() || null,
            idMesaAsignada: parseInt(document.getElementById("mesaAsignada").value),
            estado: document.getElementById("estadoReserva") ? document.getElementById("estadoReserva").value : "Pendiente"
          };
          reservas.push(nuevaReserva);
          mesas = JSON.parse(localStorage.getItem("mesas")) || mesas;
          const mesaSeleccionada = mesas.find(m => m.id === nuevaReserva.idMesaAsignada);
          if (mesaSeleccionada) {
            mesaSeleccionada.estado = "Ocupada";
            localStorage.setItem("mesas", JSON.stringify(mesas));
          }
        }

        localStorage.setItem("reservas", JSON.stringify(reservas));
        actualizarReservas();
        form.reset();
        document.getElementById("editReservaId").value = "";
        cargarMesasEnSelect();
        const modal = document.getElementById("modalReserva");
        const inst = modal ? (bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal)) : null;
        if (inst) inst.hide();
      });
    }
    const btnFiltrar = document.getElementById("btnFiltrar");
    if (btnFiltrar) {
      btnFiltrar.addEventListener("click", () => {
        const fechaFiltro = document.getElementById("filtroFecha").value;
        const estadoFiltro = document.getElementById("filtroEstado").value;
        contenedorReservas.innerHTML = "";
        reservas
          .filter(r => (!fechaFiltro || r.fechaReserva === fechaFiltro))
          .filter(r => (!estadoFiltro || r.estado === estadoFiltro))
          .forEach(r => renderReserva(r));
      });
    }
  });
}
