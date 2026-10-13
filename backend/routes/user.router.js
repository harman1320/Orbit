import express from "express";
import * as userController from "../controllers/userController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/allUsers", authenticateUser, userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);

export default userRouter;
