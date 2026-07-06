function renderReportes() {
  const contenedor = document.getElementById("reportes");

  const cargas = obtenerCargas();
  const mantenimientos = obtenerMantenimientos();

  const totalGasolina = cargas.reduce((total, carga) => total + Number(carga.importe || 0), 0);
  const totalMantenimiento = mantenimientos.reduce((total, item) => total + Number(item.costo || 0), 0);
  const totalGeneral = totalGasolina + totalMantenimiento;

  contenedor.innerHTML = `
    <div class="card">
      <h2>📊 Reportes generales</h2>

      <div class="resumen-grid">

        <div class="widget">
          <div class="icono">⛽</div>
          <div class="titulo">Gasto gasolina</div>
          <div class="valor">${formatoDinero(totalGasolina)}</div>
        </div>

        <div class="widget">
          <div class="icono">🔧</div>
          <div class="titulo">Mantenimiento</div>
          <div class="valor">${formatoDinero(totalMantenimiento)}</div>
        </div>

        <div class="widget">
          <div class="icono">💵</div>
          <div class="titulo">Total general</div>
          <div class="valor">${formatoDinero(totalGeneral)}</div>
        </div>

        <div class="widget">
          <div class="icono">📋</div>
          <div class="titulo">Registros</div>
          <div class="valor">${cargas.length + mantenimientos.length}</div>
        </div>

      </div>
    </div>

    <div class="card">
      <h2>📁 Respaldo de información</h2>

      <div class="info-box">
        Puedes exportar tus datos en formato JSON para respaldarlos o moverlos a otro equipo.
      </div>

      <div class="acciones">
        <button class="btn btn-primary" onclick="exportarJSON()">Exportar respaldo JSON</button>
        <button class="btn btn-light" onclick="document.getElementById('archivoImportar').click()">Importar respaldo JSON</button>
      </div>

      <input id="archivoImportar" class="oculto" type="file" accept="application/json" onchange="importarJSON(event)">
    </div>

    <div class="card">
      <h2>🧾 Resumen por carga</h2>
      <div>${generarResumenCargasReporte(cargas)}</div>
    </div>
  `;
}

function generarResumenCargasReporte(cargas) {
  if (cargas.length === 0) {
    return `<p class="mini">Todavía no hay cargas para mostrar en reportes.</p>`;
  }

  const ordenadas = cargas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return ordenadas.map(carga => `
    <div class="historial-item">
      <strong>${carga.fecha} - ${carga.vehiculoNombre}</strong>
      <div class="mini">Gasolinera: ${carga.gasolinera || "Sin nombre"}</div>
      <div class="mini">Importe: ${formatoDinero(carga.importe)}</div>
      <div class="mini">Litros: ${formatoNumero(carga.litros)} L</div>
      <div class="mini">Rendimiento: ${formatoNumero(carga.rendimientoReal)} km/L</div>
      <div class="mini">Diagnóstico: ${carga.diagnostico.texto}</div>
    </div>
  `).join("");
}

function exportarJSON() {
  const respaldo = {
    fechaRespaldo: new Date().toISOString(),
    vehiculos: obtenerVehiculos(),
    cargas: obtenerCargas(),
    mantenimientos: obtenerMantenimientos()
  };

  const blob = new Blob([JSON.stringify(respaldo, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = "respaldo-control-gasolina-pro.json";
  enlace.click();

  URL.revokeObjectURL(url);
}

function importarJSON(evento) {
  const archivo = evento.target.files[0];

  if (!archivo) {
    return;
  }

  const lector = new FileReader();

  lector.onload = function(e) {
    try {
      const respaldo = JSON.parse(e.target.result);

      guardarVehiculos(respaldo.vehiculos || []);
      guardarCargas(respaldo.cargas || []);
      guardarMantenimientos(respaldo.mantenimientos || []);

      renderVehiculos();
      renderGasolina();
      renderDashboard();
      renderMantenimiento();
      renderReportes();

      alert("Respaldo importado correctamente.");
    } catch (error) {
      alert("El archivo no es válido.");
    }
  };

  lector.readAsText(archivo);
}