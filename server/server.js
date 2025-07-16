const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRouter = require("./routes/userRoutes.js");
const ownerRouter = require("./routes/ownerRoutes.js");
const bookingRouter = require("./routes/bookingRoutes.js");


dotenv.config(); // Load environment variables early

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 Server is running" });
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter)

// Define port
const PORT = process.env.PORT || 3000;

// Connect to DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server connected successfully on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1); // Optional: Exit process if DB fails
  });
