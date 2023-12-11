import bcrypt from "bcrypt";

const usuarios = [
  {
    nombre: "Admin",
    email: "admin@admin.com",
    confirmado: 1,
    admin: 1,
    password: bcrypt.hashSync("avatar00", 10),
  },
  {
    nombre: "Jorge Ivan Ortega Melendez",
    email: "jiom1998@gmail.com",
    confirmado: 1,
    password: bcrypt.hashSync("avatar00", 10),
  },
];

export default usuarios;
