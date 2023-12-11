import {
  Categoria,
  Propiedad,
  Audifono,
  Marca,
  Precio,
} from "../models/index.js";
import { Sequelize } from "sequelize";
import jwt from "jsonwebtoken";

const inicio = async (req, res) => {
  const { _token } = req.cookies;
  let decoded;

  try {
    if (_token) {
      decoded = jwt.verify(_token, process.env.JWT_SECRET);
    }
  } catch (error) {
    decoded = "Ninguna";
  }

  let name;

  if (decoded) {
    name = decoded.nombre;
  } else {
    name = "no";
  }

  const [categorias, local] = await Promise.all([
    Categoria.findAll({ raw: true }),

    Propiedad.findAll({
      limit: 6,
      where: {
        categoriaId: 1,
        
      },
      include: [{ model: Categoria, as: "categoria" }],
      order: [["createdAt", "DESC"]],
    }),
  ]);

  const audifonos = await Audifono.findAll({
    include: [
      { model: Precio, as: "precio" },
      { model: Marca, as: "marca", scope: "eliminarPassword" },
    ],
    limit: 6, 
    order: [["createdAt", "DESC"]],
  });

  res.render("inicio", {
    pagina: "Inicio",
    categorias,
    local,
    audifonos,
    name,
    csrfToken: req.csrfToken(),
  });
};

const categoria = async (req, res) => {
  const { _token } = req.cookies;
  let decoded;

  try {
    if (_token) {
      decoded = jwt.verify(_token, process.env.JWT_SECRET);
    }
  } catch (error) {
    decoded = "Ninguna";
  }

  let name;

  if (decoded) {
    name = decoded.nombre;
  } else {
    name = "no";
  }

  const { id } = req.params;


  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    return res.redirect("/404");
  }


  const propiedades = await Propiedad.findAll({
    where: {
      categoriaId: id,
    },
  });

  res.render("categoria", {
    pagina: `${categoria.nombre} en Venta`,
    propiedades,
    csrfToken: req.csrfToken(),
    name,
  });
};

const noEncontrado = (req, res) => {
  const { _token } = req.cookies;
  let decoded;

  try {
    if (_token) {
      decoded = jwt.verify(_token, process.env.JWT_SECRET);
    }
  } catch (error) {
    decoded = "Ninguna";
  }

  let name;

  if (decoded) {
    name = decoded.nombre;
  } else {
    name = "no";
  }
  res.render("404", {
    pagina: "No Encontrada",
    csrfToken: req.csrfToken(),
    name,
  });
};

const nosotros = (req, res) => {
  const { _token } = req.cookies;
  let decoded;

  try {
    if (_token) {
      decoded = jwt.verify(_token, process.env.JWT_SECRET);
    }
  } catch (error) {
    decoded = "Ninguna";
  }

  let name;

  if (decoded) {
    name = decoded.nombre;
  } else {
    name = "no";
  }
  res.render("nosotros", {
    pagina: " Sobre Nosotros..",
    csrfToken: req.csrfToken(),
    name,
  });
};

const contacto = (req, res) => {
  const { _token } = req.cookies;
  let decoded;

  try {
    if (_token) {
      decoded = jwt.verify(_token, process.env.JWT_SECRET);
    }
  } catch (error) {
    decoded = "Ninguna";
  }

  let name;

  if (decoded) {
    name = decoded.nombre;
  } else {
    name = "no";
  }

  res.render("contactanos", {
    pagina: "Contactanos",
    csrfToken: req.csrfToken(),
    name,
  });
};

const trabajaCon = async (req, res) => {
  const { _token } = req.cookies;
  let decoded;

  try {
    if (_token) {
      decoded = jwt.verify(_token, process.env.JWT_SECRET);
    }
  } catch (error) {
    decoded = "Ninguna";
  }

  let name;

  if (decoded) {
    name = decoded.nombre;
  } else {
    name = "no";
  }

  const [categorias, local] = await Promise.all([
    Categoria.findAll({ raw: true }),

    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 1,

      },
      include: [{ model: Categoria, as: "categoria" }],
      order: [["createdAt", "DESC"]],
    }),
  ]);
  res.render("trabajaCon", {
    pagina: " Trabaja Con Nosotros.",
    categorias,
    local,
    csrfToken: req.csrfToken(),
    name,
  });
};

const buscador = async (req, res) => {
  const { _token } = req.cookies;
  let decoded;

  try {
    if (_token) {
      decoded = jwt.verify(_token, process.env.JWT_SECRET);
    }
  } catch (error) {
    decoded = "Ninguna";
  }

  let name;

  if (decoded) {
    name = decoded.nombre;
  } else {
    name = "no";
  }
  const { termino } = req.body;

  if (!termino.trim()) {
    return res.redirect("back");
  }

  const audifonos = await Audifono.findAll({
    where: {
      modelo: {
        [Sequelize.Op.like]: "%" + termino + "%",
      },
    },
  });

  res.render("busquedad", {
    pagina: "Resultados de la Busqueda",
    audifonos,
    csrfToken: req.csrfToken(),
    name,
  });
};

const verAudifonos = async (req, res) => {
  const { _token } = req.cookies;
  let decoded;

  try {
    if (_token) {
      decoded = jwt.verify(_token, process.env.JWT_SECRET);
    }
  } catch (error) {
    decoded = "Ninguna";
  }

  let name;

  if (decoded) {
    name = decoded.nombre;
  } else {
    name = "no";
  }

  const audifonos = await Audifono.findAll({
    where: {
      modelo: {
        [Sequelize.Op.like]: "%" + "kz" + "%",
      },
    },
  });

  const audifonos1 = await Audifono.findAll({
    where: {
      modelo: {
        [Sequelize.Op.like]: "%" + "moondrop" + "%",
      },
    },
  });

  const audifonos2 = await Audifono.findAll({
    where: {
      modelo: {
        [Sequelize.Op.like]: "%" + "cca" + "%",
      },
    },
  });

  const audifonos3 = await Audifono.findAll({
    where: {
      modelo: {
        [Sequelize.Op.like]: "%" + "1000" + "%",
      },
    },
  });

  res.render("audifonos", {
    pagina: "Marcas:",
    name,
    audifonos,
    audifonos1,
    audifonos2,
    audifonos3,
    csrfToken: req.csrfToken(),
  });
};

export {
  inicio,
  categoria,
  noEncontrado,
  buscador,
  nosotros,
  trabajaCon,
  contacto,
  verAudifonos,
};
