function renderGasolina() {
  const contenedor = document.getElementById("gasolina");
  const vehiculos = obtenerVehiculos();

  contenedor.innerHTML = `
    <div class="card">
      <h2>⛽ Registrar carga de gasolina</h2>

      ${vehiculos.length === 0 ? `
        <div class="info-box">
          Primero registra un vehículo para poder capturar cargas de gasolina.
        </div>
      ` : ""}

      <div class="form-grid">

        <div class="campo campo-full">
          <label>Vehículo</label>
          <select id="cargaVehiculo" onchange="actualizarSugerenciaKm()">
            ${generarOpcionesVehiculos(vehiculos)}
          </select>
        </div>

        <div class="campo">
          <label>Kilometraje actual</label>
          <input id="cargaKm" type="number" placeholder="Ejemplo: 158350">
          <div id="sugerenciaKm" class="mini"></div>
        </div>

        <div class="campo">
          <label>Litros cargados</label>
          <input id="cargaLitros" type="number" step="0.01" placeholder="Ejemplo: 35">
        </div>

        <div class="campo">
          <label>Importe pagado</label>
          <input id="cargaImporte" type="number" step="0.01" placeholder="Ejemplo: 850">
        </div>

        <div class="campo">
          <label>Combustible</label>
          <select id="cargaCombustible">
            <option value="Magna">Magna</option>
            <option value="Premium">Premium</option>
            <option value="Diésel">Diésel</option>
          </select>
        </div>

        <div class="campo">
          <label>Fecha de carga</label>
          <input id="cargaFecha" type="date" value="${fechaActualISO()}">
        </div>

        <div class="campo">
          <label>Nombre de gasolinera</label>
          <input id="nombreGasolinera" placeholder="Ejemplo: Pemex Chapalita">
        </div>

        <div class="campo">
          <label>Foto del ticket</label>
          <input id="ticketGasolina" type="file" accept="image/*" capture="environment">
        </div>

        <div class="campo">
          <label>Latitud</label>
          <input id="latitudGasolinera" readonly placeholder="Presiona obtener ubicación">
        </div>

        <div class="campo">
          <label>Longitud</label>
          <input id="longitudGasolinera" readonly placeholder="Presiona obtener ubicación">
        </div>

        <div class="campo campo-full">
          <label>Observaciones</label>
          <textarea id="observacionesCarga" placeholder="Ejemplo: Carga completa, viaje, tráfico, carretera, etc."></textarea>
        </div>

      </div>

      <p id="estadoUbicacion" class="mini"></p>

      <div class="acciones">
        <button class="btn btn-light" onclick="obtenerUbicacionGasolinera()">📍 Obtener ubicación</button>
        <button class="btn btn-primary" onclick="registrarCargaGasolina()">Registrar gasolina y calcular</button>
      </div>
    </div>

    <div class="card">
      <h2>📋 Historial de gasolina</h2>
      <div id="historialGasolina">${generarHistorialGasolina()}</div>
    </div>
  `;

  actualizarSugerenciaKm();
}

function generarOpcionesVehiculos(vehiculos) {
  if (vehiculos.length === 0) {
    return `<option value="">Sin vehículos registrados</option>`;
  }

  return vehiculos.map(vehiculo => `
    <option value="${vehiculo.id}">
      ${vehiculo.nombre} - ${vehiculo.marca}
    </option>
  `).join("");
}

function actualizarSugerenciaKm() {
  const select = document.getElementById("cargaVehiculo");
  const salida = document.getElementById("sugerenciaKm");

  if (!select || !salida) {
    return;
  }

  const vehiculoId = Number(select.value);
  const ultimoKm = obtenerUltimoKilometraje(vehiculoId);

  if (!ultimoKm) {
    salida.textContent = "Primer registro de gasolina para este vehículo.";
    return;
  }

  salida.innerHTML = `Último kilometraje: <strong>${ultimoKm.toLocaleString("es-MX")} km</strong><br>Sugerido: <strong>${(ultimoKm + 1).toLocaleString("es-MX")} km</strong>`;
}

function obtenerUltimoKilometraje(vehiculoId) {
  const cargas = obtenerCargas()
    .filter(carga => Number(carga.vehiculoId) === Number(vehiculoId))
    .sort((a, b) => Number(b.km) - Number(a.km));

  if (cargas.length > 0) {
    return Number(cargas[0].km);
  }

  const vehiculo = obtenerVehiculos().find(item => Number(item.id) === Number(vehiculoId));

  if (vehiculo) {
    return Number(vehiculo.kilometraje);
  }

  return 0;
}

function registrarCargaGasolina() {
  const vehiculoId = Number(document.getElementById("cargaVehiculo").value);
  const km = Number(document.getElementById("cargaKm").value);
  const litros = Number(document.getElementById("cargaLitros").value);
  const importe = Number(document.getElementById("cargaImporte").value);
  const combustible = document.getElementById("cargaCombustible").value;
  const fecha = document.getElementById("cargaFecha").value;
  const gasolinera = document.getElementById("nombreGasolinera").value.trim();
  const latitud = document.getElementById("latitudGasolinera").value;
  const longitud = document.getElementById("longitudGasolinera").value;
  const observaciones = document.getElementById("observacionesCarga").value.trim();

  if (!vehiculoId || !km || !litros || !importe || !fecha) {
    alert("Captura vehículo, kilometraje, litros, importe y fecha.");
    return;
  }

  const ultimoKm = obtenerUltimoKilometraje(vehiculoId);

  if (ultimoKm && km <= ultimoKm) {
    alert("El kilometraje actual debe ser mayor al último kilometraje registrado.");
    return;
  }

  const vehiculo = obtenerVehiculos().find(item => Number(item.id) === Number(vehiculoId));
  const kmRecorridos = ultimoKm ? km - ultimoKm : 0;
  const rendimientoReal = kmRecorridos > 0 ? kmRecorridos / litros : 0;
  const consumoL100 = rendimientoReal > 0 ? 100 / rendimientoReal : 0;
  const precioLitro = importe / litros;
  const costoKm = kmRecorridos > 0 ? importe / kmRecorridos : 0;
  const porcentajeEsperado = vehiculo && vehiculo.rendimiento ? (rendimientoReal / vehiculo.rendimiento) * 100 : 0;
  const diagnostico = crearDiagnostico(rendimientoReal, vehiculo ? vehiculo.rendimiento : 0);

  const nuevaCarga = {
    id: Date.now(),
    vehiculoId,
    vehiculoNombre: vehiculo ? `${vehiculo.nombre} - ${vehiculo.marca}` : "Sin vehículo",
    fecha,
    km,
    litros,
    importe,
    combustible,
    gasolinera,
    latitud,
    longitud,
    observaciones,
    kmRecorridos,
    rendimientoReal,
    consumoL100,
    precioLitro,
    costoKm,
    porcentajeEsperado,
    diagnostico
  };

  const cargas = obtenerCargas();
  cargas.push(nuevaCarga);
  guardarCargas(cargas);

  actualizarKilometrajeVehiculo(vehiculoId, km);

  renderGasolina();
  renderDashboard();
  renderVehiculos();
  renderReportes();

  alert("Carga registrada correctamente.");
}

function actualizarKilometrajeVehiculo(vehiculoId, km) {
  const vehiculos = obtenerVehiculos().map(vehiculo => {
    if (Number(vehiculo.id) === Number(vehiculoId)) {
      vehiculo.kilometraje = km;
    }

    return vehiculo;
  });

  guardarVehiculos(vehiculos);
}

function crearDiagnostico(rendimientoReal, rendimientoEsperado) {
  if (!rendimientoReal || !rendimientoEsperado) {
    return {
      estado: "primer-registro",
      texto: "Primer registro",
      observacion: "Se requiere una segunda carga para generar estadísticas reales.",
      clase: "alerta"
    };
  }

  const porcentaje = (rendimientoReal / rendimientoEsperado) * 100;

  if (porcentaje >= 90) {
    return {
      estado: "correcto",
      texto: "Consumo correcto",
      observacion: "Excelente rendimiento. El vehículo trabaja dentro de parámetros normales.",
      clase: "bueno"
    };
  }

  if (porcentaje >= 75) {
    return {
      estado: "regular",
      texto: "Consumo regular",
      observacion: "El consumo bajó contra el rendimiento esperado. Revisa presión de llantas, tráfico, carga del vehículo y hábitos de manejo.",
      clase: "alerta"
    };
  }

  return {
    estado: "alto",
    texto: "Consumo alto",
    observacion: "El vehículo está consumiendo más gasolina de lo esperado. Se recomienda revisar afinación, filtros, bujías, sensores, presión de llantas o posibles fugas.",
    clase: "malo"
  };
}

function generarHistorialGasolina() {
  const cargas = obtenerCargas().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  if (cargas.length === 0) {
    return `<p class="mini">No hay cargas registradas.</p>`;
  }

  return cargas.map(carga => `
    <div class="historial-item">
      <div class="historial-top">
        <div>
          <strong>${carga.vehiculoNombre}</strong>
          <div class="mini">${carga.fecha}</div>
          <div class="mini">Gasolinera: ${carga.gasolinera || "Sin nombre"}</div>
          <div class="mini">Km actual: ${Number(carga.km).toLocaleString("es-MX")} km</div>
          <div class="mini">Km recorridos: ${Number(carga.kmRecorridos).toLocaleString("es-MX")} km</div>
          <div class="mini">Litros: ${formatoNumero(carga.litros)} L</div>
          <div class="mini">Importe: ${formatoDinero(carga.importe)}</div>
          <div class="mini">Precio por litro: ${formatoDinero(carga.precioLitro)}</div>
          <div class="mini">Costo por km: ${formatoDinero(carga.costoKm)}</div>
          <div class="mini">Rendimiento: ${formatoNumero(carga.rendimientoReal)} km/L</div>
          <div class="mini">${carga.diagnostico.observacion}</div>
        </div>
        <span class="badge ${carga.diagnostico.clase === "malo" ? "badge-rojo" : carga.diagnostico.clase === "alerta" ? "badge-azul" : "badge-verde"}">
          ${carga.diagnostico.texto}
        </span>
      </div>

      <div class="acciones">
        <button class="btn btn-light" onclick="abrirMapa('${carga.latitud}', '${carga.longitud}')">Ver ubicación</button>
        <button class="btn btn-danger" onclick="eliminarCarga(${carga.id})">Eliminar carga</button>
      </div>
    </div>
  `).join("");
}

function eliminarCarga(id) {
  const confirmar = confirm("¿Deseas eliminar esta carga de gasolina?");

  if (!confirmar) {
    return;
  }

  const cargas = obtenerCargas().filter(carga => carga.id !== id);
  guardarCargas(cargas);

  renderGasolina();
  renderDashboard();
  renderReportes();
}