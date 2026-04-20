const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Reservation = require("../models/Reservation");

const getUnavailableSeatSet = async (busId, travelDate, excludeReservationId = null) => {
  const now = new Date();

  const bookingDocs = await Booking.find({ busId, travelDate }, { seats: 1, _id: 0 }).lean();
  const reservedQuery = { busId, travelDate, expiresAt: { $gt: now } };

  if (excludeReservationId && mongoose.Types.ObjectId.isValid(excludeReservationId)) {
    reservedQuery._id = { $ne: excludeReservationId };
  }

  const reservationDocs = await Reservation.find(reservedQuery, { seats: 1, _id: 0 }).lean();

  const set = new Set();
  bookingDocs.forEach((doc) => doc.seats.forEach((seat) => set.add(seat)));
  reservationDocs.forEach((doc) => doc.seats.forEach((seat) => set.add(seat)));

  return set;
};

module.exports = { getUnavailableSeatSet };
