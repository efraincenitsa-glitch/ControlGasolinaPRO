function renderDashboard() {
  const contenedor = document.getElementById("dashboard");

  const vehiculos = obtenerVehiculos();
  const cargas = obtenerCargas();

  const totalGastado = cargas.reduce((total, carga) => total + Number(carga.importe || 0), 0);
  const totalLitros = cargas.reduce((total, carga) => total + Number(carga.litros || 0), 0);
  const totalKm = cargas.reduce((total, carga) => total + Number(carga.kmRecorridos || 0), 0);
  const precioPromedio = totalLitros > 0 ? totalGastado / totalLitros : 0;
  const rendimientoPromedio = totalLitros > 0 ? totalKm / totalLitros : 0;
  const ultimoDiagnostico = cargas.length > 0 ? cargas[cargas.length - 1].diagnostico : null;

  contenedor.innerHTML = `
    <div class="resumen-grid">

      <div class="widget">
        <div class="icono">💰</div>
        <div class="titulo">Gasto total</div>
        <div class="valor">${formatoDinero(totalGastado)}</div>
      </div>

      <div class="widget">
        <div class="icono">⛽</div>
        <div class="titulo">Litros cargados</div>
        <div class="valor">${formatoNumero(totalLitros)} L</div>
      </div>

      <div class="widget">
        <div class="icono">🚗</div>
        <div class="titulo">Kilómetros recorridos</div>
        <div class="valor">${formatoNumero(totalKm, 0)} km</div>
      </div>

      <div class="widget">
        <div class="icono">📈</div>
        <div class="titulo">Rendimiento promedio</div>
        <div class="valor">${formatoNumero(rendimientoPromedio)} km/L</div>
      </div>

    </div>

    <div class="card">
      <h2>📊 Diagnóstico general</h2>

      ${ultimoDiagnostico ? `
        <div class="diagnostico ${ultimoDiagnostico.clase === "alerta" ? "alerta" : ""} ${ultimoDiagnostico.clase === "malo" ? "malo" : ""}">
          <h3>${ultimoDiagnostico.clase === "malo" ? "🔴" : ultimoDiagnostico.clase === "alerta" ? "🟡" : "🟢"} ${ultimoDiagnostico.texto}</h3>
          <p>${ultimoDiagnostico.observacion}</p>
        </div>
      ` : `
        <div class="info-box">
          Registra tu vehículo y después registra una carga de gasolina para generar el diagnóstico automático.
        </div>
      `}
    </div>

    <div class="card">
      <h2>📌 Resumen rápido</h2>
      <p><strong>Vehículos registrados:</strong> ${vehiculos.length}</p>
      <p><strong>Cargas registradas:</strong> ${cargas.length}</p>
      <p><strong>Precio promedio por litro:</strong> ${formatoDinero(precioPromedio)}</p>
      <p><strong>Costo promedio por kilómetro:</strong> ${totalKm > 0 ? formatoDinero(totalGastado / totalKm) : formatoDinero(0)}</p>
    </div>

    <div class="card">
      <h2>📱 Instalación en iPhone</h2>
      <div class="info-box">
        Abre esta página en Safari, toca Compartir y selecciona Agregar a pantalla de inicio. Así tu sistema quedará como aplicación en el escritorio del iPhone.
      </div>
    </div>
  `;
}