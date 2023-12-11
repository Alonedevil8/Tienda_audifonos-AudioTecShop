/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  // Obtiene las coordenadas latitud y longitud desde los elementos con id 'lat' y 'lng' en el documento.\r\n  // Si no se encuentran, utiliza valores predeterminados.\r\n  const lat = document.querySelector('#lat').value ||  6.2456004;\r\n  const lng = document.querySelector('#lng').value || -75.5626693;\r\n\r\n  // Crea un mapa Leaflet en el elemento con id 'mapa' y lo centra en las coordenadas latitud y longitud.\r\n  const mapa = L.map(\"mapa\").setView([lat, lng], 15);\r\n  let marker; // Declara una variable para el marcador.\r\n\r\n  // Crea un servicio de geocodificación utilizando la biblioteca de Esri.\r\n  const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n  // Agrega una capa de azulejos de OpenStreetMap al mapa.\r\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(mapa);\r\n\r\n  // Crea un marcador en las coordenadas latitud y longitud, que se puede arrastrar.\r\n  marker = new L.marker([lat, lng], {\r\n    draggable: true,\r\n    autoPan: true,\r\n  }).addTo(mapa);\r\n\r\n  // Escucha el evento \"moveend\" del marcador, que ocurre cuando se finaliza el movimiento del marcador.\r\n  marker.on(\"moveend\", function (e) {\r\n    // Actualiza el marcador con la nueva posición.\r\n    marker = e.target;\r\n    const posicion = marker.getLatLng();\r\n    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));\r\n\r\n    // Obtiene información de dirección inversa (geocodificación inversa) para las coordenadas actuales.\r\n    geocodeService\r\n      .reverse()\r\n      .latlng(posicion)\r\n      .run(function (error, resultado) {\r\n        if (!error && resultado && resultado.address) {\r\n          // Si no hay error y se obtiene una dirección, la muestra en un \"popup\" en el marcador.\r\n          const direccion = resultado.address.Match_addr || \"Dirección desconocida\";\r\n\r\n          console.log(posicion.lng); // Registra la longitud en la consola (para depuración).\r\n\r\n          marker.bindPopup(direccion).openPopup();\r\n        } else {\r\n          // Maneja el caso de error o si no se encuentra una dirección.\r\n          marker.bindPopup(\"Error o dirección no encontrada\").openPopup();\r\n        }\r\n\r\n        // Actualiza elementos en el documento con información de dirección y coordenadas.\r\n        document.querySelector(\".calle\").textContent = resultado.address.Match_addr;\r\n        document.querySelector(\"#calle\").value = resultado.address.Match_addr;\r\n        document.querySelector(\"#lat\").value = posicion.lat;\r\n        document.querySelector(\"#lng\").value = posicion.lng;\r\n      });\r\n  });\r\n})();\r\n\n\n//# sourceURL=webpack://Tienda_de_Audifonos/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;