import pool from "../db/config.js";
import { badRequest, notFound } from "../utils/errors.js";

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await pool.query("SELECT * FROM posts ORDER BY id");
    res.status(200).json(posts.rows);
  } catch (error) {
    console.error("Error obteniendo publicaciones:", error);
    return next(internalError("Error obteniendo publicaciones"));
  }
}; 

export const getpostsById = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);;

    if (result.rows.length === 0) {
      return next(notFound("publicación no encontrada"));
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error obteniendo la publicación:", error);

    return next(internalError("Error obteniendo la publicación"));
  }
}; 

export const createPosts = async (req, res, next) => {
  try {
    const { title, content, author_id, published} = req.body;

    if (!title || !content || !author_id) {
      return next(badRequest("titulo, contenido y autor_id son requeridos"))
    }

    const result = await pool.query(
      "INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, author_id, published ?? false],
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Error creando la publicaciones:", error);

    return next(internalError("Error creando las publicaciones"));
  }
};

export const updatePosts = async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;

    const result = await pool.query(
      `UPDATE posts
       SET title  = COALESCE($1, title),
           content = COALESCE($2, content),
           author_id = COALESCE($3, author_id),
           published = COALESCE($4, published)
       WHERE id = $5
       RETURNING *`,
      [title, content, author_id, published, req.params.id],
    );
  
    if (result.rows.length === 0) {
      return next(notFound("posts no encontrado"));
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizando posts:", error);
    return next(internalError("Error actualizando posts"));
  }
};

export const deletePosts = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM posts WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return next(notFound("publicación no encontrado"));
        }

        res.status(200).json({ 
            message: "publicación eliminada correctamente", 
            posts: result.rows[0] 
        });

    } catch (error) {
        console.error("Error eliminando el posts:", error);
        return next(internalError("Error eliminando posts"));
    }
};

export const getPostsByAuthorId = async (req, res, next) => {
    try {
        const { author_id } = req.params;

        const query = `
            SELECT posts.id, posts.title, posts.content, posts.published, posts.created_at,
                   authors.id AS author_id, authors.name AS author_name, authors.email AS author_email, authors.bio AS author_bio
            FROM posts
            JOIN authors ON posts.author_id = authors.id
            WHERE authors.id = $1
        `;

        const result = await pool.query(query, [author_id]);

        if (result.rows.length === 0) {
            return next(notFound("No se encontraron publicaciones para este autor o el autor no existe"));
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error obteniendo posts del autor:", error);
        return next(internalError("Error obteniendo las publicaciones del autor"));
    }
};