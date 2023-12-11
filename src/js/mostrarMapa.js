(function () {
  const lat = document.querySelector("#lat").textContent;
  const lng = document.querySelector("#lng").textContent;
  const titulo = document.querySelector("#titulo").textContent;

  const mapa = L.map("mapa").setView([lat, lng], 16);

  // Agrega una capa de azulejos de OpenStreetMap al mapa.
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  // Crea un marcador en las coordenadas latitud y longitud, que se puede arrastrar.
  marker = new L.marker([lat, lng], {
    draggable: false,
    autoPan: true,
  })
    .addTo(mapa)
    .bindPopup(titulo);
})();
