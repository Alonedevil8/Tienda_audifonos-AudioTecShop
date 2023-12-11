import jwt from "jsonwebtoken";

// Función para generar un JSON Web Token (JWT)
const generarJWT = (datos) =>
  jwt.sign(
    {
      id: datos.id,
      nombre: datos.nombre
    },
    process.env.JWT_SECRET, // La clave secreta para firmar el JWT
    {
      expiresIn: "1d", // El tiempo de expiración del token (1 día en este caso)
    }
  );

// Función para generar un ID aleatorio
const generarId = () =>
  Math.random().toString(32).substring(2) + Date.now().toString(32);

// Exporta las funciones para su uso en otros archivos
export { generarId, generarJWT };
