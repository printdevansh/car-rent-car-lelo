const express = require("express");
const { changeRoleToOwner, addCar, getOwnerCars, toggleCarAvailability, deleteCar, getDashboardData, updateUserImage } = require("../controllers/ownerController.js");
const protect = require("../middlewares/auth.js");
const upload = require("../middlewares/multer.js");

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"),protect,addCar )
ownerRouter.get("/cars", protect,getOwnerCars)
ownerRouter.post("/toggle-car", protect,toggleCarAvailability )
ownerRouter.post("/delete-car",protect,deleteCar)

ownerRouter.get('/dashboard', protect, getDashboardData)
ownerRouter.post('/update-image', upload.single("image"), protect, updateUserImage)

module.exports = ownerRouter;
