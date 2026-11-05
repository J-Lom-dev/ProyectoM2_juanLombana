import "dotenv/config"
import express from "express";
import router from "./routes/indexRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();

app.use(express.json());


const swaggerDocument = YAML.load("src/docs/openapi.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(router); 

app.get("/health", (req, res, next) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use(errorHandler);

export default app;