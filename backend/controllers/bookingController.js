const mongoose = require("mongoose");
const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const Reservation = require("../models/Reservation");
const { getUnavailableSeatSet } = require("../utils/availability");
const { normalizeTravelDate } = require("../utils/travelDate");

const RESERVATION_MS = 2 * 60 * 1000;

const sanitizeSeats = (seats) => [...new Set(seats.map(Number))].filter(Number.isInteger).sort((a, b) => a - b);
const getSessionId = (req) => {
  const value = String(req.headers["x-session-id"] || req.body.sessionId || "").trim();
  return value || null;
};

const validatePassengers = (passengerDetails) =>
  Array.isArray(passengerDetails) &&
  passengerDetails.length > 0 &&
  passengerDetails.every(
    (p) =>
      p &&
      typeof p.name === "string" &&
      p.name.trim() &&
      Number.isInteger(Number(p.age)) &&
      Number(p.age) > 0 &&
      Number(p.age) < 121 &&
      ["male", "female", "other"].includes(String(p.gender).toLowerCase())
  );

const createBooking = async (req, res, next) => {
  try {
    const { busId, seats, passengerDetails, reservationId, travelDate } = req.body;
    const sessionId = getSessionId(req);

    if (!sessionId || !busId || !Array.isArray(seats) || !validatePassengers(passengerDetails) || !travelDate) {
      return res.status(400).json({ message: "Invalid booking request" });
    }

    const normalizedTravelDate = normalizeTravelDate(travelDate);
    if (!normalizedTravelDate) {
      return res.status(400).json({ message: "Invalid booking request" });
    }

    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ message: "Invalid booking request" });
    }

    const bus = await Bus.findById(busId).lean();
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const normalizedSeats = sanitizeSeats(seats);
    if (!normalizedSeats.length) return res.status(400).json({ message: "Invalid booking request" });
    if (passengerDetails.length !== normalizedSeats.length) {
      return res.status(400).json({ message: "Passenger details count must match selected seats" });
    }

    const validRange = normalizedSeats.every((seat) => seat >= 1 && seat <= bus.totalSeats);
    if (!validRange) return res.status(400).json({ message: "Invalid booking request" });

    const unavailableSet = await getUnavailableSeatSet(bus._id, normalizedTravelDate, reservationId || null);
    if (normalizedSeats.some((seat) => unavailableSet.has(seat))) {
      return res.status(409).json({ message: "Seat unavailable" });
    }

    if (reservationId) {
      if (!mongoose.Types.ObjectId.isValid(reservationId)) {
        return res.status(400).json({ message: "Invalid booking request" });
      }
      const reservation = await Reservation.findOne({
        _id: reservationId,
        busId: bus._id,
        travelDate: normalizedTravelDate,
        sessionId,
        expiresAt: { $gt: new Date() },
      }).lean();

      if (!reservation) {
        return res.status(409).json({ message: "Reservation expired" });
      }
    }

    const totalPrice = normalizedSeats.length * bus.price;
    const cleanedPassengers = passengerDetails.map((p) => ({
      name: p.name.trim(),
      age: Number(p.age),
      gender: String(p.gender).toLowerCase(),
    }));

    const booking = await Booking.create({
      sessionId,
      busId: bus._id,
      travelDate: normalizedTravelDate,
      seats: normalizedSeats,
      passengerDetails: cleanedPassengers,
      totalPrice,
    });

    if (reservationId && mongoose.Types.ObjectId.isValid(reservationId)) {
      await Reservation.deleteOne({ _id: reservationId, sessionId });
    }

    return res.status(201).json({
      message: "Booking successful",
      id: booking._id,
      busId: bus._id,
      travelDate: normalizedTravelDate,
      seatsBooked: normalizedSeats,
      totalPrice,
    });
  } catch (error) {
    return next(error);
  }
};

const createReservation = async (req, res, next) => {
  try {
    const { busId, seats, travelDate } = req.body;
    const sessionId = getSessionId(req);
    if (!sessionId || !busId || !Array.isArray(seats) || !travelDate) {
      return res.status(400).json({ message: "Invalid reservation request" });
    }

    const normalizedTravelDate = normalizeTravelDate(travelDate);
    if (!normalizedTravelDate) {
      return res.status(400).json({ message: "Invalid reservation request" });
    }

    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ message: "Invalid reservation request" });
    }

    const bus = await Bus.findById(busId).lean();
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const normalizedSeats = sanitizeSeats(seats);
    if (!normalizedSeats.length) return res.status(400).json({ message: "Select at least one seat" });

    const validRange = normalizedSeats.every((seat) => seat >= 1 && seat <= bus.totalSeats);
    if (!validRange) return res.status(400).json({ message: "Invalid seat selection" });

    const unavailableSet = await getUnavailableSeatSet(bus._id, normalizedTravelDate);
    if (normalizedSeats.some((seat) => unavailableSet.has(seat))) {
      return res.status(409).json({ message: "Seat unavailable" });
    }

    await Reservation.deleteMany({ busId: bus._id, sessionId, travelDate: normalizedTravelDate });

    const expiresAt = new Date(Date.now() + RESERVATION_MS);
    const reservation = await Reservation.create({
      sessionId,
      busId: bus._id,
      travelDate: normalizedTravelDate,
      seats: normalizedSeats,
      expiresAt,
    });

    return res.status(201).json({
      reservationId: reservation._id,
      travelDate: normalizedTravelDate,
      seats: reservation.seats,
      expiresAt,
      ttlSeconds: RESERVATION_MS / 1000,
    });
  } catch (error) {
    return next(error);
  }
};

const updateReservation = async (req, res, next) => {
  try {
    const { seats } = req.body;
    const sessionId = getSessionId(req);
    const { id } = req.params;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid reservation request" });
    }

    const reservation = await Reservation.findOne({
      _id: id,
      sessionId,
      expiresAt: { $gt: new Date() },
    });
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    const bus = await Bus.findById(reservation.busId).lean();
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const normalizedSeats = sanitizeSeats(seats || []);
    if (!normalizedSeats.length) return res.status(400).json({ message: "Select at least one seat" });

    const validRange = normalizedSeats.every((seat) => seat >= 1 && seat <= bus.totalSeats);
    if (!validRange) return res.status(400).json({ message: "Invalid seat selection" });

    const unavailableSet = await getUnavailableSeatSet(bus._id, reservation.travelDate, reservation._id);
    if (normalizedSeats.some((seat) => unavailableSet.has(seat))) {
      return res.status(409).json({ message: "Seat unavailable" });
    }

    reservation.seats = normalizedSeats;
    reservation.expiresAt = new Date(Date.now() + RESERVATION_MS);
    await reservation.save();

    return res.json({
      reservationId: reservation._id,
      travelDate: reservation.travelDate,
      seats: reservation.seats,
      expiresAt: reservation.expiresAt,
      ttlSeconds: RESERVATION_MS / 1000,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteReservation = async (req, res, next) => {
  try {
    const sessionId = getSessionId(req);
    const { id } = req.params;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid reservation request" });
    }

    await Reservation.deleteOne({ _id: id, sessionId });
    return res.json({ message: "Reservation released" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createBooking,
  createReservation,
  updateReservation,
  deleteReservation,
};
