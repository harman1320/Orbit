import express from "express";
import * as issueController from "../controllers/issueController.js";

const issueRouter = express.Router();

issueRouter.post("/issue/create/:id", issueController.createIssue);
issueRouter.put("/issue/update/:id", issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);
issueRouter.get("/issue/all/:id", issueController.getAllIssues);
issueRouter.get("/issue/:id", issueController.getIssueById);

export default issueRouter;
