import { Router } from "express";
import {
  getAllPosts,
  getPostsByAuthorId,
  getpostsById,
  createPosts,
  updatePosts,
  deletePosts
} from "../controllers/postsController.js";

const postsRouter = Router();

postsRouter.get("/", getAllPosts);
postsRouter.get("/author/:author_id", getPostsByAuthorId);
postsRouter.get("/:id", getpostsById);
postsRouter.post("/", createPosts);
postsRouter.put("/:id", updatePosts);
postsRouter.delete("/:id", deletePosts);


export default postsRouter;