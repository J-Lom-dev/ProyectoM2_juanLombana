import pool from "../db/config.js";

export const getAllAuthors = async (req, res) => {
  try {
    const authors = await pool.query("SELECT * FROM authors ORDER BY id");
    res.status(200).json(authors.rows);
  } catch (error) {
    console.error("Error obteniendo autores:", error);
    res.status(500).json({ error: "Error obteniendo autores" });
  }
}; 

export const getAuthorById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM authors WHERE id = $1", [req.params.id]);;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error obteniendo autor:", error);
    res.status(500).json({ error: "Error obteniendo autor" });
  }
}; 

export const createAuthor = async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Nombre y email son requeridos" });
    }

    const result = await pool.query(
      "INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bio || null],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando autor:", error);

    if (error.code == "23505") {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    res.status(500).json({ error: "Error creando autor" });
  }
};

export const updateAuthor = async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    const result = await pool.query(
      `UPDATE authors
       SET name  = COALESCE($1, name),
           email = COALESCE($2, email),
           bio   = COALESCE($3, bio)
       WHERE id = $4
       RETURNING *`,
      [name, email, bio, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizando autor:", error);

    if (error.code == "23505") {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    res.status(500).json({ error: "Error actualizando autor" });
  }
};

export const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM authors WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Autor no encontrado" });
        }

        res.status(200).json({ 
            message: "Autor eliminado correctamente", 
            author: result.rows[0] 
        });

    } catch (error) {
        console.error("Error eliminando autor:", error);
        res.status(500).json({ error: "Error eliminando autor" });
    }
};
