const imagekit = require("../config/imageKit.js")
const Booking = require("../models/Booking.js")
const Car = require("../models/Car.js")
const User = require("../models/User.js")
const fs=require("fs")

// Api TO change role of user
const changeRoleToOwner=async (req,res)=>{
    try{
        const {_id}=req.user
        await User.findByIdAndUpdate(_id, {role:"owner"})
        res.json({success:true, message:"Now you can list cars"})
    }catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})

    }
}


// Api to List Car
const addCar=async (req,res)=>{
    try{
        const {_id}=req.user
        let car=JSON.parse(req.body.carData)
        const imageFile=req.file

        // Add image to imageKit
        const fileBuffer=fs.readFileSync(imageFile.path)
       const response= await imagekit.upload({
        file:fileBuffer,
        fileName:imageFile.originalname,
        folder: "/cars"
       })

       // opptimization through imageKit URL transformation
var optimizedImageURL = imagekit.url({
    path : response.filePath,
    transformation : [
        {width:'1280'}, //width resizing
        {quality:'auto'}, //Auto Compression
        {format:'webp'} //convert to modern format
    ]
});

const image=optimizedImageURL
await Car.create({...car, owner:_id, image})

res.json({success:true, message:"Car Added"})


    }catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}




// Api to list owners cars
const getOwnerCars=async (req,res)=>{
    try{
        const {_id}=req.user
        const cars=await Car.find({owner:_id})
        res.json({success:true, cars})
    }catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

// Api to toggle Car Availability

const toggleCarAvailability=async (req,res)=>{
    try{
        const {_id}=req.user
        const {carId}=req.body
        const car=await Car.findById(carId)

        // check if car belongs to the user
        if(car.owner.toString() !=_id.toString()){
            return res.json({success:false, message:"Unauthorized"})
        }
        car.isAvailable=!car.isAvailable
        await car.save()

         res.json({status:true, message:"Availability Toggled"})

    }catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}
// Api to delete a car
const deleteCar=async (req,res)=>{
    try{
        const {_id}=req.user
        const {carId}=req.body
        const car=await Car.findById(carId)

        // check if car belongs to the user
        if(car.owner.toString() !=_id.toString()){
            return res.json({success:false, message:"Unauthorized"})
        }
        car.owner=null
        car.isAvailable=false
        await car.save()

         res.json({status:true, message:"Car removed"})

    }catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

// Api to get dashboard data
const getDashboardData=async (req,res)=>{
    try{
        const {_id, role}=req.user
        if(role!=='owner'){
            return res.json({success:false, message:"Unauthorized"})
        }

        const cars=await Car.find({owner:_id})
        const bookings=await Booking.find({owner:_id}).populate('car').sort({createdAt:-1})

        const pendingBookings=await Booking.find({owner:_id, status:"pending"})
        const completedBookings=await Booking.find({owner:_id, status:"completed"})

        // Calculate monthly revenue from bookings where status is completed
        const monthlyRevenue=bookings.slice().filter(booking=>booking.status==='confirmed').reduce((acc,booking)=>acc+booking.price,0)

        const dashboardData={
            totalCars:cars.length,
            totalBookings:bookings.length,
            pendingBookings:pendingBookings.length,
            completedBookings:completedBookings.length,
            recentBookings:bookings.slice(0,3),
            monthlyRevenue
        }
        res.json({success:true, dashboardData})
    }catch(error){
        console.log(error.message)
        res.json({status:false, message:error.message})
    }
}

// Api to update user image
const updateUserImage=async (req,res)=>{
    try {
        const {_id}=req.user
        const imageFile=req.file

        // Upload image to imageKit
        const fileBuffer=fs.readFileSync(imageFile.path)
       const response= await imagekit.upload({
        file:fileBuffer,
        fileName:imageFile.originalname,
        folder: "/users"
       })

       // opptimization through imageKit URL transformation
var optimizedImageURL = imagekit.url({
    path : response.filePath,
    transformation : [
        {width:'400'}, //width resizing
        {quality:'auto'}, //Auto Compression
        {format:'webp'} //convert to modern format
    ]
});

const image=optimizedImageURL
await User.findByIdAndUpdate(_id, {image})
res.json({success:true, message:"Image Updated"})
    } catch (error) {
        console.log(error.message)
        res.json({status:false, message:error.message})
    }
}

module.exports = {
  changeRoleToOwner,
  addCar,
  getOwnerCars,
  toggleCarAvailability,
  deleteCar,
  getDashboardData,
  updateUserImage,
};