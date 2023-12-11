import { Categoria, Propiedad } from "../models/index.js";

const propiedades = async (req, res) => {
  const propiedades = await Propiedad.findAll({
    include: [{ model: Categoria, as: "categoria" }],
  });

  res.json(propiedades);
};

export { propiedades };
