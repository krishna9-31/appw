const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
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
        message: "At least one seat must be reserved",
      },
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

reservationSchema.index({ busId: 1, travelDate: 1, expiresAt: 1 });

module.exports = mongoose.model("Reservation", reservationSchema);
