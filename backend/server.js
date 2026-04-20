const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const { errorHandler } = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "https://appw-two.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ]
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Bus Booking API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reservations", reservationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the process using this port or set a different PORT in backend/.env.`
    );
    process.exit(1);
  }

  throw error;
});
