# MiniBlog API - Backend

**Sitio web:** 

[]
## 📖 Descripción

Esta aplicación es una API REST desarrollada en Node.js y Express, conectada a una base de datos en PostgreSQL, diseñada para gestionar usuarios y publicaciones (modelo tipo JSONPlaceholder) en el marco de los proyectos de Soy Henry.

La API permite realizar operaciones CRUD básicas e implementa validaciones, manejo de errores, pruebas unitarias y documentación con OpenAPI.

---

## 📌 Índice

- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [Configuración de la Base de Datos](#-configuración-de-la-base-de-datos)
- [Ejecución del Servidor](#-ejecución-del-servidor)
- [Endpoints Principales](#-endpoints-principales)
- [Pruebas con Clientes HTTP](#-pruebas-con-clientes-http)
- [Nota Importante para Ejecutar Tests](#️-nota-importante-para-ejecutar-los-tests)
- [Uso de Inteligencia Artificial](#-uso-de-inteligencia-artificial)
- [Autor](#-autor)

---

## ⚙️ Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas en tu entorno local:

- Node.js
- PostgreSQL (para la persistencia de datos)
- Git

---

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para clonar e iniciar el proyecto desde cero en tu máquina local:

1. **Cloná el repositorio:**

   git clone https://github.com/J-Lom-dev/ProyectoM2_juanLombana.git

2. **Instalá las dependencias del proyecto:**
   En la terminal del editor de código ejecuta:

   npm install

3. **Configurá las variables de entorno:**
   Creá un archivo `.env` en la raíz del proyecto y agregá las siguientes variables:
   PORT=3000

   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nombre_de_la_base_de_datos
   DB_USER=usuario_postgres
   DB_PASSWORD=tu_contraseña # Recomendación: si tu contraseña es numérica, cámbiala a alfanumérica.

---

## 🗄️ Configuración de la Base de Datos

1. Ingresá a tu gestor de PostgreSQL con tu usuario:

   psql -U tu_usuario

2. Creá la base de datos para el proyecto:

   CREATE DATABASE nombre_database;

3. Conéctate a la base de datos:

   \c nombre_database;

4. Ejecutá los scripts SQL provistos en el proyecto para inicializar las tablas y poblar los datos iniciales:
   - Primero, ejecutá el script de configuración ubicado en `\i src/db/setup.sql` para estructurar las tablas.
   - Segundo, ejecutá el script de inserción de datos iniciales ubicado en `\i src/db/seed.sql`.

---

## 💻 Ejecución del Servidor

Una vez configurada la base de datos y las variables de entorno, salé de postgres con el comando `\q` e iniciá el servidor en modo de desarrollo ejecutando:

npm run dev

El servidor quedará activo localmente en el puerto configurado.

---

## 🌐 Endpoints Principales

Podés probar el acceso inicial ingresando a las siguientes rutas en tu navegador o cliente HTTP:

- `GET http://localhost:3000/authors`
- `GET http://localhost:3000/authors/:id`
- `GET http://localhost:3000/posts`
- `GET http://localhost:3000/posts/:id`
- `GET http://localhost:3000/api-docs` *(Documentación Swagger/OpenAPI)*

---

## 🛠️ Pruebas con Clientes HTTP

Para realizar pruebas exhaustivas de las operaciones CRUD (creaciones, lecturas, actualizaciones y eliminaciones de usuarios y posts), podés utilizar herramientas de API externas como **Postman** o **Bruno**.

---

## ⚠️ Nota importante para ejecutar los tests

Las pruebas automatizadas (Vitest) realizan operaciones de limpieza y reinicio (`TRUNCATE`) en la base de datos.

Se recomienda encarecidamente utilizar una **base de datos independiente o exclusiva para testing** en tu archivo de entorno de pruebas para evitar la pérdida de datos de desarrollo.

Podés ejecutar la suite de pruebas con:
npm test o npm run test

---

## 🤖 Uso de Inteligencia Artificial

Durante el desarrollo de este proyecto se utilizaron herramientas de IA como asistente de aprendizaje para:

- Organizar la jerarquía de encabezados y secciones en Markdown.
- Corregir errores ortográficos y mejorar la redacción sin alterar el contenido ni el significado original del trabajo realizado.

---

## 👨‍💻 Autor

**Juan Pablo Lombana Ríos**  
GitHub: [https://github.com/J-Lom-dev]

*Proyecto desarrollado como parte del proceso de aprendizaje en desarrollo web.*