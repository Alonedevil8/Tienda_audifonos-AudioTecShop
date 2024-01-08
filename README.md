# Proyecto Final - BootCamp Globant Academy

Descripción del Proyecto

La "Tienda de Audífonos " Es una plataforma innovadora diseñada para brindar a los amantes de la música una experiencia de compra única y personalizada. Construida utilizando la arquitectura de microservicios, esta aplicación ofrece un enfoque modular y escalable para gestionar diversos aspectos de una tienda de audífonos.

Características Principales:

    Los usuarios pueden explorar una amplia variedad de audífonos de alta calidad, con detalles detallados sobre cada producto, incluyendo especificaciones técnicas y reseñas de otros usuarios.

    Marcas y Categorías: La aplicación organiza los audífonos en diferentes marcas y categorías para facilitar la búsqueda y selección de productos según las preferencias individuales de los usuarios.

    Carrito de Compras: Los clientes pueden agregar audífonos a su carrito de compras, permitiéndoles revisar y ajustar su selección antes de realizar la compra final.

    Gestión de Usuarios: La plataforma proporciona una interfaz para que los usuarios gestionen sus perfiles, realicen un seguimiento de sus compras anteriores y administren su información personal.

    Microservicios Eficientes: La arquitectura de microservicios permite una gestión eficiente de cada componente, mejorando la escalabilidad, la flexibilidad y facilitando futuras expansiones y actualizaciones.

    Importación y Eliminación de Datos: Scripts dedicados facilitan la importación y eliminación de datos en la base de datos, brindando flexibilidad en la gestión de la información.

Tecnologías Utilizadas:

    Node.js: Plataforma de ejecución para el servidor.
    Express: Marco de aplicación web para Node.js.
    Webpack y PostCSS: Herramientas para la compilación y optimización de estilos y scripts.
    Tailwind CSS: Biblioteca de estilos utilizable y personalizable.
    Sequelize: ORM para interactuar con la base de datos MySQL.
    JWT: Para la autenticación segura de usuarios.
    Nodemailer: Facilita el envío de correos electrónicos para confirmaciones y comunicaciones.
    Concurrently y Nodemon: Herramientas para facilitar el desarrollo y la gestión del servidor.

    Información del Proyecto
    Configuración del Proyecto
    Scripts Disponibles
    Modelos de Datos
    Descripción de la Aplicación
    Licencia

#Información del Proyecto

    Nombre del Proyecto: tienda_audifonos_microservicios
    Versión: 1.0.0
    Autor: Andrés Dorado
    Licencia: ISC

#Configuración del Proyecto

Asegúrate de tener Node.js instalado en tu sistema. Luego, sigue estos pasos para configurar el proyecto:

    Clona este repositorio en tu máquina local: 
        git clone https://github.com/tu-usuario/tienda_audifonos_microservicios.git

    Navega al directorio del proyecto:
        cd tienda_audifonos_microservicios
    
    Instala las dependencias:
        npm install

#Scripts Disponibles

Este proyecto viene con varios scripts predefinidos en el archivo package.json:

    npm run start: Inicia la aplicación.
    npm run server: Inicia la aplicación con nodemon para reiniciar automáticamente en cambios.
    npm run css: Compila los estilos usando PostCSS y Tailwind CSS.
    npm run js: Compila los archivos JavaScript con Webpack.
    npm run dev: Inicia la aplicación en modo desarrollo, ejecutando los scripts CSS, JS y servidor simultáneamente.
    npm run db:importar: Importa datos iniciales a la base de datos.
    npm run db:eliminar: Elimina datos de la base de datos.

#Modelos de Datos

Los modelos de datos se importan desde sus respectivos archivos y se establecen relaciones utilizando el método "belongsTo". Aquí están los modelos disponibles:

    Audífono
    Marca
    Categoría
    Usuario
    Carrito

A continuación, se muestran las relaciones entre los modelos:

    #javascript
    
    Audífono.belongsTo(Marca); // Audífono pertenece a Marca.
    Audífono.belongsTo(Categoría); // Audífono pertenece a Categoría.
    Audífono.belongsTo(Usuario); // Audífono pertenece a Usuario.
    Audífono.belongsTo(Carrito, { foreignKey: "carritoId" });
    
    // Otras relaciones pueden agregarse según sea necesario.
    
    // Exporta los modelos de datos para poder utilizarlos en otros módulos.
    export { Audífono, Marca, Categoría, Usuario, Carrito };


#Vista

![Screenshot_2](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/a9d3b6c5-519f-4f84-8f49-f544cef2c519)
![Screenshot_3](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/0761199f-bd34-4a83-9429-1a5a56a9a2a5)
![Screenshot_14](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/51149f19-1bbb-4966-b025-9c49cf1a33f3)
![Screenshot_15](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/1e2d8080-4feb-4dbd-97c0-9bad15d189a8)
![Screenshot_4](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/94ab2ccd-6631-48d3-bcf7-03a9ad8e3016)
![Screenshot_5](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/183dc222-c64e-423b-b81d-13c0056840ed)
![Screenshot_6](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/b58f1dfe-57d1-4fdd-b6cb-01d5fd12f615)
![Screenshot_7](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/5ff1b409-1949-402e-bce7-355a22abedea)
![Screenshot_8](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/bca23323-0058-49fe-95eb-3a11abc2f5f9)
![Screenshot_9](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/ab0243d8-0f06-4c22-91ec-3f4a924a66ee)
![Screenshot_10](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/b07e9537-61bc-4199-bbeb-b0f314c9aac3)
![Screenshot_11](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/cc1fa484-929d-4403-adab-8dce28b08276)
![Screenshot_12](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/b2d45061-a5be-4a02-9ccc-2a4b66b881cc)
![Screenshot_13](https://github.com/Alonedevil8/Tienda_audifonos-Nodejs---Pug-Monolitica-/assets/6482729/481c8866-28d6-427f-b1bd-f470d5f24863)

Licencia

Este proyecto está bajo la Licencia ISC. Consulta el archivo LICENSE para obtener más detalles.

¡Gracias por visitar nuestro repositorio! Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto con nosotros.








