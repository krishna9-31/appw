const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    arrivalTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    isAC: {
      type: Boolean,
      required: true,
    },
    seatType: {
      type: String,
      required: true,
      enum: ["normal", "semi-sleeper", "sleeper"],
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);
