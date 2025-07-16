const express = require("express");
const { registerUser, loginUser, getUserData, getCars } = require("../controllers/userController.js");
const protect = require("../middlewares/auth.js");

const userRouter = express.Router();

// Route to register a user
userRouter.post("/register", registerUser);

// Route to login a user
userRouter.post("/login", loginUser);

// Route to get userdata
userRouter.get("/data",protect,getUserData)

//  Route to get cars data
userRouter.get("/cars", getCars)
module.exports = userRouter;
