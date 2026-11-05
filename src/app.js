import "dotenv/config"
import express from "express";
import router from "./routes/indexRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Middleware
app.use(express.json());
 
app.use(router); 

app.get("/health", (req, res, next) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use(errorHandler);

export default app;