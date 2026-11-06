import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import pool from "../src/db/config.js";

beforeEach(async () => {
    await pool.query("TRUNCATE posts, authors RESTART IDENTITY CASCADE");
    
    await pool.query(`
        INSERT INTO authors (id, name, email) VALUES 
        (1, 'Autor Uno', 'autor1@correo.com'),
        (2, 'Autor Dos', 'autor2@correo.com');
    `);

    await pool.query(`
        INSERT INTO posts (title, content, author_id, published) VALUES
        ('Introducción a Node.js', 'Node.js es un runtime de JavaScript...', 1, true),
        ('Express y Base de Datos', 'Aprende a conectar PostgreSQL...', 2, true);
    `);
});

describe("GET /posts", () => {
  test("debería devolver todos los posts sembrados con status 200", async () => {
    const response = await request(app).get("/posts");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("title", "Introducción a Node.js");
  });
});

describe("GET /posts/:id", () => {
  test("debería devolver un post por su ID con status 200", async () => {
    const response = await request(app).get("/posts/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("title", "Introducción a Node.js");
  });

  test("debería devolver status 404 si el post no existe", async () => {
    const response = await request(app).get("/posts/9999");

    expect(response.statusCode).toBe(404);
  });
});

describe("POST /posts", () => {
  test("debería crear un nuevo post exitosamente con status 201", async () => {
    const response = await request(app)
      .post("/posts")
      .send({
        title: "Nuevo Post",
        content: "Contenido del nuevo post...",
        author_id: 1,
        published: true
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("title", "Nuevo Post");
  });

  test("debería devolver status 400 si faltan campos requeridos", async () => {
    const response = await request(app)
      .post("/posts")
      .send({});

    expect(response.statusCode).toBe(400);
  });
});

describe("PUT /posts/:id", () => {
  test("debería actualizar un post existente con status 200", async () => {
    const response = await request(app)
      .put("/posts/1")
      .send({
        title: "Node.js Avanzado",
        content: "Contenido actualizado...",
        author_id: 1,
        published: false
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("title", "Node.js Avanzado");
  });

  test("debería devolver status 404 si se intenta actualizar un post que no existe", async () => {
    const response = await request(app)
      .put("/posts/9999")
      .send({
        title: "No Existe",
        content: "Contenido",
        author_id: 1,
        published: true
      });

    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /posts/:id", () => {
  test("debería eliminar un post existente con status 200 o 204", async () => {
    const response = await request(app).delete("/posts/1");

    expect([200, 204]).toContain(response.statusCode);
  });

  test("debería devolver status 404 si se intenta eliminar un post que no existe", async () => {
    const response = await request(app).delete("/posts/9999");

    expect(response.statusCode).toBe(404);
  });
});