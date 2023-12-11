(function () {
  // Obtiene las coordenadas latitud y longitud desde los elementos con id 'lat' y 'lng' en el documento.
  // Si no se encuentran, utiliza valores predeterminados.
  const lat = document.querySelector('#lat').value ||  6.2456004;
  const lng = document.querySelector('#lng').value || -75.5626693;

  // Crea un mapa Leaflet en el elemento con id 'mapa' y lo centra en las coordenadas latitud y longitud.
  const mapa = L.map("mapa").setView([lat, lng], 15);
  let marker; // Declara una variable para el marcador.

  // Crea un servicio de geocodificación utilizando la biblioteca de Esri.
  const geocodeService = L.esri.Geocoding.geocodeService();

  // Agrega una capa de azulejos de OpenStreetMap al mapa.
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  // Crea un marcador en las coordenadas latitud y longitud, que se puede arrastrar.
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  // Escucha el evento "moveend" del marcador, que ocurre cuando se finaliza el movimiento del marcador.
  marker.on("moveend", function (e) {
    // Actualiza el marcador con la nueva posición.
    marker = e.target;
    const posicion = marker.getLatLng();
    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

    // Obtiene información de dirección inversa (geocodificación inversa) para las coordenadas actuales.
    geocodeService
      .reverse()
      .latlng(posicion)
      .run(function (error, resultado) {
        if (!error && resultado && resultado.address) {
          // Si no hay error y se obtiene una dirección, la muestra en un "popup" en el marcador.
          const direccion = resultado.address.Match_addr || "Dirección desconocida";

          console.log(posicion.lng); // Registra la longitud en la consola (para depuración).

          marker.bindPopup(direccion).openPopup();
        } else {
          // Maneja el caso de error o si no se encuentra una dirección.
          marker.bindPopup("Error o dirección no encontrada").openPopup();
        }

        // Actualiza elementos en el documento con información de dirección y coordenadas.
        document.querySelector(".calle").textContent = resultado.address.Match_addr;
        document.querySelector("#calle").value = resultado.address.Match_addr;
        document.querySelector("#lat").value = posicion.lat;
        document.querySelector("#lng").value = posicion.lng;
      });
  });
})();
