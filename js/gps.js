function obtenerUbicacionGasolinera() {
  const latitudInput = document.getElementById("latitudGasolinera");
  const longitudInput = document.getElementById("longitudGasolinera");
  const estado = document.getElementById("estadoUbicacion");

  if (!navigator.geolocation) {
    alert("Este dispositivo no permite obtener ubicación GPS.");
    return;
  }

  if (estado) {
    estado.textContent = "Obteniendo ubicación...";
  }

  navigator.geolocation.getCurrentPosition(
    posicion => {
      const latitud = posicion.coords.latitude;
      const longitud = posicion.coords.longitude;

      if (latitudInput) {
        latitudInput.value = latitud.toFixed(6);
      }

      if (longitudInput) {
        longitudInput.value = longitud.toFixed(6);
      }

      if (estado) {
        estado.textContent = "Ubicación cargada correctamente.";
      }
    },
    error => {
      console.error(error);

      if (estado) {
        estado.textContent = "No se pudo obtener la ubicación.";
      }

      alert("No se pudo obtener la ubicación. Revisa permisos de ubicación en Safari.");
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
}

function abrirMapa(latitud, longitud) {
  if (!latitud || !longitud) {
    alert("Esta carga no tiene ubicación registrada.");
    return;
  }

  const url = `https://www.google.com/maps?q=${latitud},${longitud}`;
  window.open(url, "_blank");
}