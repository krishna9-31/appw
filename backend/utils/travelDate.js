const TRAVEL_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const normalizeTravelDate = (value) => {
  const raw = String(value || "").trim();
  if (!TRAVEL_DATE_REGEX.test(raw)) return null;

  const parsed = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;

  return raw;
};

module.exports = { normalizeTravelDate };
