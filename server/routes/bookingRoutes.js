const express=require("express")
const { checkAvailabilityofCar, createBooking, getUserBookings, getOwnerBookings, changeBookingStatus } = require("../controllers/bookingController.js")
const protect = require("../middlewares/auth.js")

const bookingRouter=express.Router()

bookingRouter.post('/check-availability', checkAvailabilityofCar)
bookingRouter.post('/create', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/owner', protect, getOwnerBookings)
bookingRouter.post('/change-status', protect, changeBookingStatus)

module.exports=bookingRouter