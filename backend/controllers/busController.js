const mongoose = require("mongoose");
const Bus = require("../models/Bus");
const { getUnavailableSeatSet } = require("../utils/availability");
const { normalizeTravelDate } = require("../utils/travelDate");

const toSlot = (departureTime) => {
  const [hourStr] = departureTime.split(":");
  const hour = Number(hourStr);
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 16) return "afternoon";
  if (hour >= 16 && hour < 20) return "evening";
  return "night";
};

const buildSeats = (bus, unavailableSet) => {
  const seats = [];
  for (let seatNumber = 1; seatNumber <= bus.totalSeats; seatNumber += 1) {
    const colIndex = (seatNumber - 1) % 4;
    seats.push({
      seatNumber,
      isAvailable: !unavailableSet.has(seatNumber),
      row: Math.ceil(seatNumber / 4),
      column: colIndex + 1,
      seatType: bus.seatType,
      sleeperLevel: bus.seatType === "sleeper" ? (colIndex % 2 === 0 ? "lower" : "upper") : undefined,
    });
  }
  return seats;
};

const normalizeBool = (value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
};

const getBuses = async (req, res, next) => {
  try {
    const {
      departureCity,
      arrivalCity,
      source,
      destination,
      date,
      seatType,
      isAC,
      departureSlot,
      page = 1,
      pageSize = 10,
    } = req.query;

    const depCity = (departureCity || source || "").trim();
    const arrCity = (arrivalCity || destination || "").trim();

    if (!depCity || !arrCity || !date) {
      return res.status(400).json({ message: "departureCity, arrivalCity and date are required" });
    }

    if (depCity.toLowerCase() === arrCity.toLowerCase()) {
      return res.status(400).json({ message: "departureCity and arrivalCity cannot be same" });
    }

    const travelDate = normalizeTravelDate(date);
    if (!travelDate) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedPageSize = Math.max(1, Math.min(50, Number(pageSize) || 10));

    const query = {
      source: new RegExp(`^${depCity}$`, "i"),
      destination: new RegExp(`^${arrCity}$`, "i"),
    };

    if (seatType) query.seatType = seatType.toLowerCase();
    if (isAC !== undefined && String(isAC).trim() !== "") {
      const normalized = normalizeBool(String(isAC).toLowerCase());
      if (normalized === null) return res.status(400).json({ message: "isAC must be true or false" });
      query.isAC = normalized;
    }

    let buses = await Bus.find(query).lean();

    if (departureSlot) {
      buses = buses.filter((bus) => toSlot(bus.departureTime) === departureSlot.toLowerCase());
    }

    const transformed = await Promise.all(
      buses.map(async (bus) => {
        const unavailableSet = await getUnavailableSeatSet(bus._id, travelDate);
        const availableSeats = bus.totalSeats - unavailableSet.size;

        return {
          id: bus._id,
          name: bus.name,
          travelDate,
          stops: [
            { stopName: bus.source, departureTime: bus.departureTime },
            { stopName: bus.destination, arrivalTime: bus.arrivalTime },
          ],
          departureCity: bus.source,
          arrivalCity: bus.destination,
          departureTime: bus.departureTime,
          arrivalTime: bus.arrivalTime,
          availableSeats,
          price: bus.price,
          seatTypes: [bus.seatType],
          isAC: bus.isAC,
          busType: bus.seatType,
        };
      })
    );

    const totalBuses = transformed.length;
    const totalPages = Math.max(1, Math.ceil(totalBuses / parsedPageSize));
    const start = (parsedPage - 1) * parsedPageSize;
    const busesPage = transformed.slice(start, start + parsedPageSize);

    return res.json({
      travelDate,
      page: parsedPage,
      pageSize: parsedPageSize,
      totalPages,
      totalBuses,
      buses: busesPage,
    });
  } catch (error) {
    return next(error);
  }
};

const getBusById = async (req, res, next) => {
  try {
    const { busId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ message: "Invalid bus id" });
    }

    const travelDate = normalizeTravelDate(req.query.date);
    if (!travelDate) {
      return res.status(400).json({ message: "Valid date query param is required" });
    }

    const bus = await Bus.findById(busId).lean();
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const unavailableSet = await getUnavailableSeatSet(bus._id, travelDate, req.query.reservationId || null);
    const seats = buildSeats(bus, unavailableSet);

    return res.json({
      id: bus._id,
      name: bus.name,
      travelDate,
      departureCity: bus.source,
      arrivalCity: bus.destination,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      availableSeats: bus.totalSeats - unavailableSet.size,
      price: bus.price,
      seatTypes: [bus.seatType],
      isAC: bus.isAC,
      seatType: bus.seatType,
      stops: [
        { stopName: bus.source, departureTime: bus.departureTime },
        { stopName: bus.destination, arrivalTime: bus.arrivalTime },
      ],
      seats,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getBuses, getBusById };
