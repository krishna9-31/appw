const CITY_REGION = {
  Agra: "north",
  Ahmedabad: "west",
  Amritsar: "north",
  Aurangabad: "west",
  Bangalore: "south",
  Bhopal: "central",
  Bhubaneswar: "east",
  Chandigarh: "north",
  Chennai: "south",
  Coimbatore: "south",
  Dehradun: "north",
  Delhi: "north",
  Guwahati: "east",
  Hyderabad: "south",
  Indore: "central",
  Jaipur: "north",
  Jammu: "north",
  Kanpur: "north",
  Kochi: "south",
  Kolkata: "east",
  Lucknow: "north",
  Ludhiana: "north",
  Madurai: "south",
  Mangalore: "south",
  Mumbai: "west",
  Mysore: "south",
  Nagpur: "central",
  Nashik: "west",
  Patna: "east",
  Pune: "west",
  Raipur: "central",
  Ranchi: "east",
  Surat: "west",
  Thiruvananthapuram: "south",
  Udaipur: "west",
  Vadodara: "west",
  Varanasi: "north",
  Vijayawada: "south",
  Visakhapatnam: "south",
};

const REGION_HUB = {
  north: "Delhi",
  west: "Mumbai",
  south: "Bangalore",
  east: "Kolkata",
  central: "Nagpur",
};

const dedupePath = (path) => path.filter((city, index) => city && (index === 0 || city !== path[index - 1]));

export const getConnectingRouteMap = (departureCity, arrivalCity) => {
  if (!departureCity || !arrivalCity || departureCity === arrivalCity) return [];

  const depRegion = CITY_REGION[departureCity] || "central";
  const arrRegion = CITY_REGION[arrivalCity] || "central";
  const depHub = REGION_HUB[depRegion];
  const arrHub = REGION_HUB[arrRegion];

  const options = [
    [departureCity, arrivalCity],
    [departureCity, depHub, arrivalCity],
    [departureCity, depHub, arrHub, arrivalCity],
    [departureCity, "Nagpur", arrivalCity],
  ];

  const unique = new Set();
  return options
    .map((path) => dedupePath(path))
    .filter((path) => path.length >= 2)
    .filter((path) => {
      const key = path.join("->");
      if (unique.has(key)) return false;
      unique.add(key);
      return true;
    });
};
