import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createBooking, createReservation, deleteReservation } from "../services/api";
import LiveClock from "../components/LiveClock";
import { getConnectingRouteMap } from "../constants/routeMap";

const emptyPassenger = { name: "", age: "", gender: "male" };
const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
const normalizeTtlSeconds = (value, fallback = 120) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  if (parsed > 1000) return Math.ceil(parsed / 1000);
  return Math.ceil(parsed);
};

function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingState = location.state;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservationId, setReservationId] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [locked, setLocked] = useState(false);
  const [locking, setLocking] = useState(false);
  const timerRef = useRef(null);
  const timerEndsAtRef = useRef(0);
  const hasAutoLockedRef = useRef(false);

  const passengersInitial = useMemo(() => {
    if (!bookingState || !Array.isArray(bookingState.selectedSeats)) return [];
    return bookingState.selectedSeats.map(() => ({ ...emptyPassenger }));
  }, [bookingState]);
  const [passengers, setPassengers] = useState(passengersInitial);

  if (
    !bookingState ||
    !bookingState.bus ||
    !Array.isArray(bookingState.selectedSeats) ||
    bookingState.selectedSeats.length === 0 ||
    !(bookingState.travelDate || bookingState.bus.travelDate)
  ) {
    return (
      <main className="page">
        <section className="auth-card">
          <p className="alert-error">No active booking session found.</p>
          <Link to="/search">Go to Search</Link>
        </section>
      </main>
    );
  }

  const { bus, selectedSeats, totalPrice } = bookingState;
  const travelDate = bookingState.travelDate || bus.travelDate;
  const seatSelectionQuery = bookingState.searchQuery || (travelDate ? `?date=${travelDate}` : "");
  const seatSelectionPath = `/buses/${bus.id}/seats${seatSelectionQuery}`;
  const routePaths = getConnectingRouteMap(bus.departureCity, bus.arrivalCity);
  const primaryRoutePath = routePaths[0] ? routePaths[0].join(" -> ") : `${bus.departureCity} -> ${bus.arrivalCity}`;

  const updatePassenger = (index, key, value) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const validatePassengers = () =>
    passengers.every(
      (p) => p.name.trim() && Number(p.age) > 0 && Number(p.age) < 121 && ["male", "female", "other"].includes(p.gender)
    );

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (reservationId) deleteReservation(reservationId).catch(() => {});
    },
    [reservationId]
  );

  const startTimer = (ttl = 120, activeReservationId = "") => {
    if (timerRef.current) clearInterval(timerRef.current);
    const ttlSeconds = normalizeTtlSeconds(ttl, 120);
    timerEndsAtRef.current = Date.now() + ttlSeconds * 1000;
    setTimerSeconds(ttlSeconds);

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((timerEndsAtRef.current - Date.now()) / 1000));
      setTimerSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        timerEndsAtRef.current = 0;
        if (activeReservationId) {
          deleteReservation(activeReservationId).catch(() => {});
        }
        setLocked(false);
        setReservationId("");
        setError("Timer expired. Your seat lock was released. Please reselect seats.");
      }
    }, 1000);
  };

  const lockSeats = async () => {
    setError("");
    setSuccess("");
    if (!selectedSeats.length) {
      setError("No seats selected.");
      return;
    }

    try {
      setLocking(true);
      const reservation = await createReservation({
        busId: bus.id,
        seats: selectedSeats,
        travelDate,
      });
      setReservationId(reservation.reservationId);
      setLocked(true);
      startTimer(reservation.ttlSeconds || 120, reservation.reservationId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLocking(false);
    }
  };

  useEffect(() => {
    if (hasAutoLockedRef.current) return;
    hasAutoLockedRef.current = true;
    lockSeats();
  }, []);

  const proceedPayment = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!locked || !reservationId) {
      setError("Seat lock is not active. Please wait for lock or retry.");
      return;
    }

    if (!validatePassengers()) {
      setError("Please fill valid passenger details for all seats.");
      return;
    }

    try {
      setLoading(true);
      const response = await createBooking({
        busId: bus.id,
        seats: selectedSeats,
        reservationId,
        travelDate,
        passengerDetails: passengers.map((p) => ({
          name: p.name.trim(),
          age: Number(p.age),
          gender: p.gender,
        })),
      });
      setSuccess(`${response.message}. Booking ID: ${response.id}`);
      setTimeout(() => navigate("/search"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page page-top">
      <section className="container">
        <div className="top-row">
          <h1 className="title">Booking Confirmation</h1>
          <Link to={seatSelectionPath} className="button-outline">
            Back to Seat Selection
          </Link>
        </div>

        {error && <p className="alert-error">{error}</p>}
        {success && <p className="alert-success">{success}</p>}

        <div className="two-col">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Passenger Details</h3>
            <form className="form" onSubmit={proceedPayment}>
              {passengers.map((passenger, index) => (
                <div key={index} className="passenger-block">
                  <p className="muted">Seat {selectedSeats[index]}</p>
                  <input
                    className="input"
                    placeholder="Name"
                    value={passenger.name}
                    onChange={(e) => updatePassenger(index, "name", e.target.value)}
                  />
                  <input
                    className="input"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Age"
                    value={passenger.age}
                    onChange={(e) => updatePassenger(index, "age", e.target.value)}
                  />
                  <select
                    className="select"
                    value={passenger.gender}
                    onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              ))}
              {!locked ? (
                <>
                  <p className="muted">{locking ? "Locking seats for 2 minutes..." : "Unable to lock seats right now."}</p>
                  {!locking && (
                    <button className="button" type="button" onClick={lockSeats}>
                      Retry Seat Lock
                    </button>
                  )}
                </>
              ) : (
                <>
                  <LiveClock label="Live Clock" />
                  <p className="muted">
                    Payment Timer: <strong>{formatTime(timerSeconds)}</strong>
                  </p>
                  {timerSeconds <= 0 && (
                    <p className="alert-error">
                      Reservation expired. <Link to={seatSelectionPath}>Return to seat selection</Link>
                    </p>
                  )}
                  <button className="button" type="submit" disabled={loading || timerSeconds <= 0}>
                    {loading ? "Processing..." : "Proceed Payment"}
                  </button>
                </>
              )}
            </form>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Bus Details</h3>
            <p className="muted">{bus.name}</p>
            <p className="muted">
              {bus.departureCity} to {bus.arrivalCity}
            </p>
            <p className="muted">
              {bus.departureTime} - {bus.arrivalTime}
            </p>
            <p className="muted">Travel Date: {travelDate}</p>
            <p className="muted">
              {bus.isAC ? "AC" : "NON-AC"} | {bus.seatType}
            </p>
            <h3>Booking Summary</h3>
            <p className="muted">Path: {primaryRoutePath}</p>
            <p className="muted">
              Locked Seats (2 min):{" "}
              {selectedSeats.map((seat) => (
                <span key={seat} className="seat-chip-locked">
                  {seat}
                </span>
              ))}
            </p>
            <p className="muted">Seats: {selectedSeats.join(", ")}</p>
            <p>
              <strong>Total Price: Rs. {totalPrice}</strong>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BookingConfirmationPage;
