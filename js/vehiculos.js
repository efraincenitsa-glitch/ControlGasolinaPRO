function renderVehiculos() {
  const contenedor = document.getElementById("vehiculos");

  const vehiculos = obtenerVehiculos();

  contenedor.innerHTML = `
    <div class="card">
      <h2>🚗 Datos del vehículo</h2>

      <div class="info-box">
        Primero registra tu vehículo. El rendimiento esperado se usará para comparar si el consumo está correcto o si el vehículo ya está gastando demasiada gasolina.
      </div>

      <div class="form-grid">

        <div class="campo">
          <label>Nombre del vehículo</label>
          <input id="vehiculoNombre" placeholder="Ejemplo: Clio, Versa, Hilux">
        </div>

        <div class="campo">
          <label>Marca</label>
          <input id="vehiculoMarca" placeholder="Ejemplo: Renault">
        </div>

        <div class="campo">
          <label>Modelo</label>
          <input id="vehiculoModelo" placeholder="Ejemplo: Expression">
        </div>

        <div class="campo">
          <label>Año</label>
          <input id="vehiculoAnio" type="number" placeholder="Ejemplo: 2006">
        </div>

        <div class="campo">
          <label>Placas</label>
          <input id="vehiculoPlacas" placeholder="Ejemplo: JLS123A">
        </div>

        <div class="campo">
          <label>Número de serie VIN</label>
          <input id="vehiculoVin" placeholder="Opcional">
        </div>

        <div class="campo">
          <label>Color</label>
          <input id="vehiculoColor" placeholder="Ejemplo: Gris">
        </div>

        <div class="campo">
          <label>Tipo de vehículo</label>
          <select id="vehiculoTipo">
            <option value="Compacto">Compacto</option>
            <option value="Sedán">Sedán</option>
            <option value="SUV">SUV</option>
            <option value="Camioneta">Camioneta</option>
            <option value="Carga">Carga</option>
            <option value="Motocicleta">Motocicleta</option>
          </select>
        </div>

        <div class="campo">
          <label>Combustible principal</label>
          <select id="vehiculoCombustible">
            <option value="Magna">Magna</option>
            <option value="Premium">Premium</option>
            <option value="Diésel">Diésel</option>
          </select>
        </div>

        <div class="campo">
          <label>Rendimiento esperado km/L</label>
          <input id="vehiculoRendimiento" type="number" step="0.01" placeholder="Ejemplo: 12">
        </div>

        <div class="campo">
          <label>Kilometraje actual</label>
          <input id="vehiculoKilometraje" type="number" placeholder="Ejemplo: 158000">
        </div>

        <div class="campo">
          <label>Km de última afinación</label>
          <input id="vehiculoAfinacion" type="number" placeholder="Ejemplo: 150000">
        </div>

      </div>

      <div class="acciones">
        <button class="btn btn-success" onclick="guardarVehiculo()">Guardar vehículo</button>
        <button class="btn btn-danger" onclick="borrarTodo()">Borrar todo</button>
      </div>
    </div>

    <div class="card">
      <h2>🚘 Vehículos registrados</h2>
      <div id="listaVehiculos">${generarListaVehiculos(vehiculos)}</div>
    </div>
  `;
}

function generarListaVehiculos(vehiculos) {
  if (vehiculos.length === 0) {
    return `<p class="mini">No hay vehículos registrados.</p>`;
  }

  return vehiculos.map(vehiculo => `
    <div class="historial-item">
      <div class="historial-top">
        <div>
          <strong>${vehiculo.nombre} - ${vehiculo.marca}</strong>
          <div class="mini">${vehiculo.modelo} ${vehiculo.anio || ""}</div>
          <div class="mini">Placas: ${vehiculo.placas || "Sin registro"}</div>
          <div class="mini">Rendimiento esperado: ${vehiculo.rendimiento} km/L</div>
          <div class="mini">Kilometraje: ${vehiculo.kilometraje} km</div>
        </div>
        <span class="badge badge-azul">${vehiculo.combustible}</span>
      </div>

      <div class="acciones">
        <button class="btn btn-light" onclick="cargarVehiculoParaEditar(${vehiculo.id})">Editar</button>
        <button class="btn btn-danger" onclick="eliminarVehiculo(${vehiculo.id})">Eliminar</button>
      </div>
    </div>
  `).join("");
}

function guardarVehiculo() {
  const idEditar = document.getElementById("vehiculoNombre").dataset.idEditar;

  const nombre = document.getElementById("vehiculoNombre").value.trim();
  const marca = document.getElementById("vehiculoMarca").value.trim();
  const modelo = document.getElementById("vehiculoModelo").value.trim();
  const anio = Number(document.getElementById("vehiculoAnio").value);
  const placas = document.getElementById("vehiculoPlacas").value.trim();
  const vin = document.getElementById("vehiculoVin").value.trim();
  const color = document.getElementById("vehiculoColor").value.trim();
  const tipo = document.getElementById("vehiculoTipo").value;
  const combustible = document.getElementById("vehiculoCombustible").value;
  const rendimiento = Number(document.getElementById("vehiculoRendimiento").value);
  const kilometraje = Number(document.getElementById("vehiculoKilometraje").value);
  const afinacion = Number(document.getElementById("vehiculoAfinacion").value);

  if (!nombre || !marca || !rendimiento || !kilometraje) {
    alert("Captura al menos nombre, marca, rendimiento esperado y kilometraje actual.");
    return;
  }

  let vehiculos = obtenerVehiculos();

  const vehiculo = {
    id: idEditar ? Number(idEditar) : Date.now(),
    nombre,
    marca,
    modelo,
    anio,
    placas,
    vin,
    color,
    tipo,
    combustible,
    rendimiento,
    kilometraje,
    afinacion
  };

  if (idEditar) {
    vehiculos = vehiculos.map(item => item.id === Number(idEditar) ? vehiculo : item);
  } else {
    vehiculos.push(vehiculo);
  }

  guardarVehiculos(vehiculos);

  renderVehiculos();
  renderGasolina();
  renderDashboard();
  renderMantenimiento();
  renderReportes();

  alert("Vehículo guardado correctamente.");
}

function cargarVehiculoParaEditar(id) {
  const vehiculos = obtenerVehiculos();
  const vehiculo = vehiculos.find(item => item.id === id);

  if (!vehiculo) {
    return;
  }

  document.getElementById("vehiculoNombre").value = vehiculo.nombre;
  document.getElementById("vehiculoNombre").dataset.idEditar = vehiculo.id;
  document.getElementById("vehiculoMarca").value = vehiculo.marca;
  document.getElementById("vehiculoModelo").value = vehiculo.modelo;
  document.getElementById("vehiculoAnio").value = vehiculo.anio;
  document.getElementById("vehiculoPlacas").value = vehiculo.placas;
  document.getElementById("vehiculoVin").value = vehiculo.vin;
  document.getElementById("vehiculoColor").value = vehiculo.color;
  document.getElementById("vehiculoTipo").value = vehiculo.tipo;
  document.getElementById("vehiculoCombustible").value = vehiculo.combustible;
  document.getElementById("vehiculoRendimiento").value = vehiculo.rendimiento;
  document.getElementById("vehiculoKilometraje").value = vehiculo.kilometraje;
  document.getElementById("vehiculoAfinacion").value = vehiculo.afinacion;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarVehiculo(id) {
  const confirmar = confirm("¿Deseas eliminar este vehículo? También se conservarán las cargas históricas registradas.");

  if (!confirmar) {
    return;
  }

  const vehiculos = obtenerVehiculos().filter(item => item.id !== id);
  guardarVehiculos(vehiculos);

  renderVehiculos();
  renderGasolina();
  renderDashboard();
  renderReportes();
}