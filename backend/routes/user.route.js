import {userRegistration, getUser, getUserByClerkId, getCurrentUser} from "../controllers/user.controller.js";
import express from "express";

const userRouter = express.Router();

//Create and get User
userRouter.route("/user")
    .post(userRegistration)// For user registration
    .get(getUser)//To get the users

// Get current authenticated user
userRouter.get("/user/me", getCurrentUser);

// Get user by clerkId
userRouter.get("/user/clerk/:clerkId", getUserByClerkId);

export default userRouter;