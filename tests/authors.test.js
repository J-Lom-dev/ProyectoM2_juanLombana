import { describe, test, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import pool from "../src/db/config.js";

beforeEach(async () => {
  await pool.query("TRUNCATE authors RESTART IDENTITY CASCADE");
  await pool.query(`
    INSERT INTO authors (name, email, bio) VALUES
      ('Ana García',  'ana@example.com',    'Full-stack dev'),
      ('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico')
  `);
});

afterAll(async () => {
  await pool.end();
});

describe("GET /api/authors", () => {
  test("devuelve los autores sembrados", async () => {
    const response = await request(app).get("/authors");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("name");
  });
});

describe("GET /authors/:id", () => {
    test("debería devolver un autor por su ID con status 200", async () => {
        const response = await request(app).get("/authors/1");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("name", "Ana García");
    });

    test("debería devolver status 404 si el autor no existe", async () => {
        const response = await request(app).get("/authors/9999");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error", "Autor no encontrado");
    });
});

describe("POST /authors", () => {
    test("debería crear un nuevo autor exitosamente con status 201", async () => {
        const response = await request(app)
            .post("/authors")
            .send({
                name: "Lucía Pérez",
                email: "lucia@example.com",
                bio: "Escritora de tecnología"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("Lucía Pérez");
    });

    test("debería devolver status 409 si el email ya está registrado", async () => {
        const response = await request(app)
            .post("/authors")
            .send({
                name: "Otro Autor",
                email: "ana@example.com", 
                bio: "Bio de prueba"
            });

        expect(response.statusCode).toBe(409);
        expect(response.body).toHaveProperty("error", "El email ya está registrado");

    });

    test("debería devolver status 400 si falta nombre o email", async () => {
        const response = await request(app)
            .post("/authors")
            .send({
                bio: "Faltan nombre y email"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error", "Nombre y email son requeridos");

    });
 
});

describe("PUT /authors/:id", () => {
    test("debería actualizar un autor existente con status 200", async () => {
        const response = await request(app)
            .put("/authors/1")
            .send({
                name: "Ana García Actualizada",
                email: "ana.nueva@example.com",
                bio: "Bio actualizada"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe("Ana García Actualizada");
    });

    test("debería devolver status 404 si intenta actualizar un autor que no existe", async () => {
        const response = await request(app)
            .put("/authors/9999")
            .send({
                name: "No existe",
                email: "test@example.com"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error", "Autor no encontrado");
    });
});

describe("DELETE /authors/:id", () => {
    test("debería eliminar un autor existente con status 200", async () => {
        const response = await request(app).delete("/authors/1");

        expect([200]).toContain(response.statusCode);
    });

    test("debería devolver status 404 si intenta eliminar un autor inexistente", async () => {
        const response = await request(app).delete("/authors/9999");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("error", "Autor no encontrado");
    });
});
