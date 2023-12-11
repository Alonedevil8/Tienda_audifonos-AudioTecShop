import nodemailer from "nodemailer";

// Función para enviar correo de registro
const emailRegistro = async (datos) => {
  // Crear un objeto de transporte para enviar correos
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  // Enviar el correo de registro
  await transport.sendMail({
    from: "AudioTecShop.com",
    to: email,
    subject: "Confirma tu cuenta en AudioTecShop.com",
    text: "Confirma tu cuenta en AudioTecShop.com",
    html: `
    <html>
      <head>
        <title>Confirmación de Cuenta - AudioTecShop.com</title>
      </head>
      <body>
        <h1>¡Hola ${nombre}!</h1>
        <p>¡Gracias por registrarte en AudioTecShop.com!</p>
        <p>Para completar el proceso de registro y confirmar tu cuenta, por favor haz clic en el siguiente enlace:</p>
        <p><a href="http://localhost:3001/auth/confirma/${token}">Confirmar mi cuenta</a></p>
        <p>Si no has solicitado esta confirmación, puedes ignorar este mensaje.</p>
        <p>¡Esperamos que disfrutes de nuestros servicios!</p>
      </body>
    </html>
    `,
  });
};

// Función para enviar correo de restablecimiento de contraseña
const emailOlvidePassword = async (datos) => {
  // Crear un objeto de transporte para enviar correos
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  // Enviar correo electrónico para restablecer la contraseña
  await transport.sendMail({
    from: "AudioTecShop.com",
    to: email,
    subject: "Restablecer contraseña en AudioTecShop.com",
    text: "Restablecer contraseña en AudioTecShop.com",
    html: `
    <html>
      <head>
        <title>Restablecer Contraseña - AudioTecShop.com</title>
      </head>
      <body>
        <h1>¡Hola ${nombre}!</h1>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en AudioTecShop.com.</p>
        <p>Para cambiar tu contraseña, por favor haz clic en el siguiente enlace:</p>
        <p><a href="http://localhost:3001/auth/olvidePassword/${token}">Restablecer mi contraseña</a></p>
        <p>Si no has solicitado restablecer tu contraseña, puedes ignorar este mensaje.</p>
        <p>Este enlace para restablecer la contraseña caducará en 24 horas por razones de seguridad.</p>
        <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
        <p>¡Gracias por usar AudioTecShop.com!</p>
      </body>
    </html>
  `,
  });
};

// Exporta las funciones para su uso en otros archivos
export { emailRegistro, emailOlvidePassword };
