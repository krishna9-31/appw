const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getSessionId = () => {
  const key = "bus_booking_session_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const next = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`;
  localStorage.setItem(key, next);
  return next;
};

const parseJSON = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const signup = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJSON(response);
};

export const login = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJSON(response);
};

export const fetchBuses = async (params) => {
  const sanitized = Object.entries(params || {}).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
  const query = new URLSearchParams(sanitized).toString();
  const response = await fetch(`${API_BASE_URL}/api/buses?${query}`);
  return parseJSON(response);
};

export const fetchBusById = async (id, options = {}) => {
  const { date = "", reservationId = "" } = options;
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (reservationId) params.set("reservationId", reservationId);
  const query = params.toString();
  const response = await fetch(`${API_BASE_URL}/api/buses/${id}${query ? `?${query}` : ""}`);
  return parseJSON(response);
};

export const createBooking = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-session-id": getSessionId(),
    },
    body: JSON.stringify(payload),
  });

  return parseJSON(response);
};

export const createReservation = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-session-id": getSessionId(),
    },
    body: JSON.stringify(payload),
  });
  return parseJSON(response);
};

export const updateReservation = async (id, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-session-id": getSessionId(),
    },
    body: JSON.stringify(payload),
  });
  return parseJSON(response);
};

export const deleteReservation = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
    method: "DELETE",
    headers: {
      "x-session-id": getSessionId(),
    },
  });
  return parseJSON(response);
};
