import express from "express";
import * as repoController from "../controllers/repoController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import authorizeRepository from "../middleware/authorizeRepository.js";

const repoRouter = express.Router();

repoRouter.post(
  "/repo/create",
  authenticateUser,
  repoController.createRepository,
);

repoRouter.get("/repo/all", repoController.getAllRepositories);

repoRouter.get(
  "/repo/:id",
  authenticateUser,
  repoController.fetchRepositoryById,
);

repoRouter.get(
  "/repo/name/:name",
  authenticateUser,
  repoController.fetchRepositoryByName,
);

repoRouter.get(
  "/repo/user/:id",
  authenticateUser,
  repoController.fetchRepositoriesForCurrentUser,
);

repoRouter.put(
  "/repo/update/:id",
  authenticateUser,
  authorizeRepository,
  repoController.updateRepositoryById,
);

repoRouter.delete(
  "/repo/delete/:id",
  authenticateUser,
  authorizeRepository,
  repoController.deleteRepositoryById,
);

repoRouter.patch(
  "/repo/toggle/:id",
  authenticateUser,
  authorizeRepository,
  repoController.toggleVisibilityById,
);

export default repoRouter;
