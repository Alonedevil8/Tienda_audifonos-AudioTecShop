import { Dropzone } from "dropzone";

// Obtener el token CSRF desde una etiqueta meta en el documento HTML
const token = document
  .querySelector('meta[name="csrfToken"]')
  .getAttribute("content");

// Opciones de configuración para el objeto Dropzone
Dropzone.options.imagen = {
  dictDefaultMessage: "Arrastra archivos aquí o haz clic para cargarlos",
  acceptedFiles: ".png, .jpg, .jpeg",
  maxFilesize: 5, // Tamaño máximo del archivo en MB
  maxFiles: 1, // Número máximo de archivos que se pueden cargar
  parallelUploads: 1, // Cantidad de cargas en paralelo permitidas
  autoProcessQueue: false, // Desactiva la carga automática de archivos al agregarlos
  addRemoveLinks: true, // Muestra enlaces para eliminar archivos
  dictRemoveFile: "Borra Archivo", // Texto para eliminar archivos
  dictMaxFilesExceeded: "Máximo Una Imagen", // Mensaje cuando se excede el número máximo de archivos
  headers: {
    "CSRF-Token": token, // Encabezado CSRF para seguridad
  },
  paramName: "imagen", // Nombre del campo para el archivo
  init: function () {
    const dropzone = this;
    const btnPublicar = document.querySelector("#publicar1");

    // Agrega un evento al botón de "publicar" para iniciar la carga de archivos
    btnPublicar.addEventListener("click", function () {
      dropzone.processQueue();
    });

    // Escucha el evento "queuecomplete" que se dispara cuando se completa la carga de archivos
    dropzone.on("queuecomplete", function () {
      // Redirigir a la página "/mis-propiedades" después de una carga exitosa
      if (dropzone.getActiveFiles().length == 0) {
        window.location.href = "/mis-audifonos";
      }
    });
  },
};
