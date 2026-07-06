const DB = {
  vehiculos: "cgpro_vehiculos",
  cargas: "cgpro_cargas",
  mantenimientos: "cgpro_mantenimientos",
  config: "cgpro_config"
};

function leerStorage(clave) {
  const datos = localStorage.getItem(clave);
  if (!datos) {
    return [];
  }

  try {
    return JSON.parse(datos);
  } catch (error) {
    console.error("Error leyendo LocalStorage", error);
    return [];
  }
}

function guardarStorage(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

function obtenerVehiculos() {
  return leerStorage(DB.vehiculos);
}

function guardarVehiculos(vehiculos) {
  guardarStorage(DB.vehiculos, vehiculos);
}

function obtenerCargas() {
  return leerStorage(DB.cargas);
}

function guardarCargas(cargas) {
  guardarStorage(DB.cargas, cargas);
}

function obtenerMantenimientos() {
  return leerStorage(DB.mantenimientos);
}

function guardarMantenimientos(mantenimientos) {
  guardarStorage(DB.mantenimientos, mantenimientos);
}

function formatoDinero(valor) {
  const numero = Number(valor) || 0;

  return numero.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN"
  });
}

function formatoNumero(valor, decimales = 2) {
  const numero = Number(valor) || 0;
  return numero.toLocaleString("es-MX", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  });
}

function fechaActualISO() {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function borrarTodo() {
  const confirmar = confirm("¿Seguro que deseas borrar todos los datos de gasolina, vehículos y mantenimientos?");

  if (!confirmar) {
    return;
  }

  localStorage.removeItem(DB.vehiculos);
  localStorage.removeItem(DB.cargas);
  localStorage.removeItem(DB.mantenimientos);

  renderVehiculos();
  renderGasolina();
  renderDashboard();
  renderMantenimiento();
  renderReportes();

  alert("Todos los datos fueron eliminados.");
}
