import { Router } from "express";
import { createUsers, demo, getAllUsers, getUsersById} from "../controllers/usersController.js";

const usersRouter = Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUsersById);
usersRouter.post("/", createUsers);
usersRouter.get("/demo/:id", demo);

export default usersRouter;

