const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Bus = require("./models/Bus");
const Booking = require("./models/Booking");
const Reservation = require("./models/Reservation");

dotenv.config();

const cities = [
  "Agra",
  "Ahmedabad",
  "Amritsar",
  "Aurangabad",
  "Bangalore",
  "Bhopal",
  "Bhubaneswar",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Dehradun",
  "Delhi",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Jammu",
  "Kanpur",
  "Kochi",
  "Kolkata",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Mangalore",
  "Mumbai",
  "Mysore",
  "Nagpur",
  "Nashik",
  "Patna",
  "Pune",
  "Raipur",
  "Ranchi",
  "Surat",
  "Thiruvananthapuram",
  "Udaipur",
  "Vadodara",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam",
];
const busNames = [
  "Skyline Express",
  "Urban Glide",
  "RoadNest",
  "Swift Route",
  "Night Hopper",
  "Comfort Miles",
  "City Runner",
  "BlueLine Trips",
];

const makeTime = (baseHour, minute) => `${String(baseHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

const buses = [];
let idx = 0;
const templateVariants = [
  { seatType: "normal", isAC: true, departureHour: 7, departureMinute: 0, durationHours: 8 },
  { seatType: "normal", isAC: false, departureHour: 9, departureMinute: 30, durationHours: 8 },
  { seatType: "semi-sleeper", isAC: true, departureHour: 13, departureMinute: 0, durationHours: 9 },
  { seatType: "semi-sleeper", isAC: false, departureHour: 17, departureMinute: 15, durationHours: 9 },
  { seatType: "sleeper", isAC: true, departureHour: 21, departureMinute: 0, durationHours: 10 },
  { seatType: "sleeper", isAC: false, departureHour: 23, departureMinute: 30, durationHours: 10 },
];

for (let i = 0; i < cities.length; i += 1) {
  for (let j = 0; j < cities.length; j += 1) {
    if (i === j) continue;
    templateVariants.forEach((variant, variantIndex) => {
      const arrivalHour = (variant.departureHour + variant.durationHours) % 24;
      buses.push({
        name: `${busNames[(idx + variantIndex) % busNames.length]} ${idx + variantIndex + 1}`,
        source: cities[i],
        destination: cities[j],
        departureTime: makeTime(variant.departureHour, variant.departureMinute),
        arrivalTime: makeTime(arrivalHour, variant.departureMinute),
        price: 650 + ((idx + variantIndex) % 8) * 120,
        isAC: variant.isAC,
        seatType: variant.seatType,
        totalSeats: 40,
      });
    });

    idx += templateVariants.length;
  }
}

const seed = async () => {
  try {
    await connectDB();
    await Bus.deleteMany({});
    await Booking.deleteMany({});
    await Reservation.deleteMany({});
    await Bus.insertMany(buses);
    console.log("Seed data inserted");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
