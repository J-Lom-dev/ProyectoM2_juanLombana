import pool from "../db/config.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await pool.query("SELECT * FROM posts ORDER BY id");
    res.status(200).json(posts.rows);
  } catch (error) {
    console.error("Error obteniendo publicaciones:", error);
    res.status(500).json({ error: "Error obteniendo publicaciones" });
  }
}; 

export const getpostsById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "publicación no encontrada" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error obteniendo la publicación:", error);
    res.status(500).json({ error: "Error obteniendo la publicación" });
  }
}; 

export const createPosts = async (req, res) => {
  try {
    const { title, content, author_id, published} = req.body;

    if (!title || !content || !author_id) {
      return res.status(400).json({ error: "titulo, contenido y autor_id son requeridos" });
    }

    const result = await pool.query(
      "INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, author_id, published ?? false],
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Error creando la publicaciones:", error);

    res.status(500).json({ error: "Error creando las publicaciones" });
  }
};

export const updatePosts = async (req, res) => {
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
      return res.status(404).json({ error: "posts no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error actualizando posts:", error);

    res.status(500).json({ error: "Error actualizando posts" });
  }
};

export const deletePosts = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM posts WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "publicación no encontrado" });
        }

        res.status(200).json({ 
            message: "publicación eliminada correctamente", 
            posts: result.rows[0] 
        });

    } catch (error) {
        console.error("Error eliminando el posts:", error);
        res.status(500).json({ error: "Error eliminando posts" });
    }
};

export const getPostsByAuthorId = async (req, res) => {
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
            return res.status(404).json({ error: "No se encontraron publicaciones para este autor o el autor no existe" });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error obteniendo posts del autor:", error);
        res.status(500).json({ error: "Error obteniendo las publicaciones del autor" });
    }
};