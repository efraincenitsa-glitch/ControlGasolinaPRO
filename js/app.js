document.addEventListener("DOMContentLoaded", () => {
  inicializarTabs();
  renderVehiculos();
  renderGasolina();
  renderDashboard();
  renderMantenimiento();
  renderReportes();
  registrarServiceWorker();
});

function inicializarTabs() {
  const botones = document.querySelectorAll(".tab-btn");
  const secciones = document.querySelectorAll(".seccion");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const tab = boton.dataset.tab;

      botones.forEach(item => item.classList.remove("activo"));
      secciones.forEach(seccion => seccion.classList.remove("activa"));

      boton.classList.add("activo");
      document.getElementById(tab).classList.add("activa");

      if (tab === "dashboard") {
        renderDashboard();
      }

      if (tab === "vehiculos") {
        renderVehiculos();
      }

      if (tab === "gasolina") {
        renderGasolina();
      }

      if (tab === "mantenimiento") {
        renderMantenimiento();
      }

      if (tab === "reportes") {
        renderReportes();
      }
    });
  });
}

function registrarServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
      .then(() => {
        console.log("Service Worker registrado correctamente.");
      })
      .catch(error => {
        console.error("Error registrando Service Worker", error);
      });
  }
}