import express from "express";
import router from "./routes/indexRouter.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

app.use(router);

app.get("/health", (req, res, next) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: "Fallo la api" });
});

app.listen(PORT, () => {
  console.log(`Servidor Express en http://localhost:${PORT}`);
});
