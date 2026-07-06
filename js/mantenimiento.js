function renderMantenimiento() {
  const contenedor = document.getElementById("mantenimiento");
  const vehiculos = obtenerVehiculos();

  contenedor.innerHTML = `
    <div class="card">
      <h2>🔧 Registrar mantenimiento</h2>

      <div class="form-grid">

        <div class="campo">
          <label>Vehículo</label>
          <select id="mantVehiculo">
            ${generarOpcionesVehiculos(vehiculos)}
          </select>
        </div>

        <div class="campo">
          <label>Tipo de servicio</label>
          <select id="mantTipo">
            <option value="Afinación">Afinación</option>
            <option value="Cambio de aceite">Cambio de aceite</option>
            <option value="Frenos">Frenos</option>
            <option value="Llantas">Llantas</option>
            <option value="Batería">Batería</option>
            <option value="Seguro">Seguro</option>
            <option value="Verificación">Verificación</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div class="campo">
          <label>Fecha</label>
          <input id="mantFecha" type="date" value="${fechaActualISO()}">
        </div>

        <div class="campo">
          <label>Kilometraje</label>
          <input id="mantKm" type="number" placeholder="Ejemplo: 160000">
        </div>

        <div class="campo">
          <label>Costo</label>
          <input id="mantCosto" type="number" step="0.01" placeholder="Ejemplo: 1200">
        </div>

        <div class="campo">
          <label>Próximo servicio en km</label>
          <input id="mantProximoKm" type="number" placeholder="Ejemplo: 170000">
        </div>

        <div class="campo campo-full">
          <label>Observaciones</label>
          <textarea id="mantObs" placeholder="Detalles del servicio realizado"></textarea>
        </div>

      </div>

      <div class="acciones">
        <button class="btn btn-success" onclick="guardarMantenimiento()">Guardar mantenimiento</button>
      </div>
    </div>

    <div class="card">
      <h2>📋 Historial de mantenimiento</h2>
      <div>${generarHistorialMantenimiento()}</div>
    </div>
  `;
}

function guardarMantenimiento() {
  const vehiculoId = Number(document.getElementById("mantVehiculo").value);
  const tipo = document.getElementById("mantTipo").value;
  const fecha = document.getElementById("mantFecha").value;
  const km = Number(document.getElementById("mantKm").value);
  const costo = Number(document.getElementById("mantCosto").value);
  const proximoKm = Number(document.getElementById("mantProximoKm").value);
  const observaciones = document.getElementById("mantObs").value.trim();

  if (!vehiculoId || !fecha || !km) {
    alert("Captura vehículo, fecha y kilometraje.");
    return;
  }

  const vehiculo = obtenerVehiculos().find(item => Number(item.id) === vehiculoId);

  const mantenimiento = {
    id: Date.now(),
    vehiculoId,
    vehiculoNombre: vehiculo ? `${vehiculo.nombre} - ${vehiculo.marca}` : "Sin vehículo",
    tipo,
    fecha,
    km,
    costo,
    proximoKm,
    observaciones
  };

  const mantenimientos = obtenerMantenimientos();
  mantenimientos.push(mantenimiento);
  guardarMantenimientos(mantenimientos);

  renderMantenimiento();
  renderDashboard();
  renderReportes();

  alert("Mantenimiento guardado correctamente.");
}

function generarHistorialMantenimiento() {
  const mantenimientos = obtenerMantenimientos().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  if (mantenimientos.length === 0) {
    return `<p class="mini">No hay mantenimientos registrados.</p>`;
  }

  return mantenimientos.map(item => `
    <div class="historial-item">
      <strong>${item.tipo}</strong>
      <div class="mini">${item.vehiculoNombre}</div>
      <div class="mini">Fecha: ${item.fecha}</div>
      <div class="mini">Kilometraje: ${Number(item.km).toLocaleString("es-MX")} km</div>
      <div class="mini">Costo: ${formatoDinero(item.costo)}</div>
      <div class="mini">Próximo servicio: ${item.proximoKm ? Number(item.proximoKm).toLocaleString("es-MX") + " km" : "Sin registro"}</div>
      <div class="mini">${item.observaciones || ""}</div>

      <div class="acciones">
        <button class="btn btn-danger" onclick="eliminarMantenimiento(${item.id})">Eliminar</button>
      </div>
    </div>
  `).join("");
}

function eliminarMantenimiento(id) {
  const confirmar = confirm("¿Deseas eliminar este mantenimiento?");

  if (!confirmar) {
    return;
  }

  const mantenimientos = obtenerMantenimientos().filter(item => item.id !== id);
  guardarMantenimientos(mantenimientos);

  renderMantenimiento();
  renderReportes();
}