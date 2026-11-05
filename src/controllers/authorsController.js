import pool from "../db/config.js";
import { badRequest, conflict, internalError, notFound } from "../utils/errors.js";

export const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await pool.query("SELECT * FROM authors ORDER BY id");
    res.status(200).json(authors.rows);
  } catch (error) {
    console.error("Error obteniendo autores:", error);
    return next(internalError("Error obteniendo autores"));
  }
}; 

export const getAuthorById = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM authors WHERE id = $1", [req.params.id]);;

    if (result.rows.length === 0) {
      return next(notFound("Autor no encontrado"));
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error obteniendo autor:", error);
    return next(internalError("Error obteniendo autor"));
  }
}; 

export const createAuthor = async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;

    if (!name || !email) {
      return next(badRequest("Nombre y email son requeridos" ));
    }

    const result = await pool.query(
      "INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bio || null],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creando autor:", error);

    if (error.code == "23505") {
      return next(conflict("El email ya está registrado" ));
    }

    return next(internalError("Error creando autor"));
  }
};

export const updateAuthor = async (req, res, next) => {
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
      return next(notFound("Autor no encontrado"));
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizando autor:", error);

    if (error.code == "23505") {
      return next(conflict("El email ya está registrado"));
    }

     return next(internalError("Error actualizando autor"));
  }
};

export const deleteAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM authors WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return next(notFound("Autor no encontrado"));
        }

        res.status(200).json({ 
            message: "Autor eliminado correctamente", 
            author: result.rows[0] 
        });

    } catch (error) {
        console.error("Error eliminando autor:", error);
        return next(internalError("Error eliminando autor"));
    }
};
