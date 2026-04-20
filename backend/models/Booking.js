const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      trim: true,
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    travelDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    seats: {
      type: [Number],
      required: true,
      validate: {
        validator: function validateSeats(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one seat must be booked",
      },
    },
    passengerDetails: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          age: {
            type: Number,
            required: true,
            min: 1,
            max: 120,
          },
          gender: {
            type: String,
            required: true,
            enum: ["male", "female", "other"],
          },
        },
      ],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { versionKey: false, timestamps: true }
);

bookingSchema.index({ busId: 1, travelDate: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
