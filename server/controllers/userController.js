const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Car = require("../models/Car.js");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // token valid for 7 days
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password || password.length < 8) {
      return res.json({
        success: false,
        message: "Please fill all fields. Password must be at least 8 characters.",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: "Registration successful",
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};



// Get user data using jwt token

const getUserData = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User data not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Get all the cars for frontend
const getCars=async (req,res)=>{
  try {
    const cars=await Car.find({isAvailable:true})
    res.json({success:true, cars})
  } catch (error) {
    console.log(error.message)
    res.json({success:false, message:error.message})
  }
}

module.exports = { registerUser, loginUser, getUserData, getCars};