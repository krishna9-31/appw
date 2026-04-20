import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import SeatGrid from "../components/SeatGrid";
import { fetchBusById } from "../services/api";

function SeatSelectionPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const travelDate = useMemo(() => new URLSearchParams(location.search).get("date") || "", [location.search]);

  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const loadBus = async () => {
    const data = await fetchBusById(id, { date: travelDate });
    setBus(data);
  };

  useEffect(() => {
    if (!travelDate) {
      setLoading(false);
      setBus(null);
      setError("Travel date is missing. Please go back and search again.");
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError("");
        await loadBus();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, travelDate]);

  const totalPrice = useMemo(() => (bus ? selectedSeats.length * bus.price : 0), [bus, selectedSeats]);

  const handleSeatToggle = (seatNumber) => {
    setError("");
    if (!bus) return;

    const isUnavailable = bus.seats.some((seat) => seat.seatNumber === seatNumber && !seat.isAvailable);
    if (isUnavailable) {
      setError(`Seat ${seatNumber} is no longer available. Please choose another seat.`);
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber].sort((a, b) => a - b)
    );
  };

  const proceed = async () => {
    if (!selectedSeats.length) {
      setError("Please select seats first.");
      return;
    }

    try {
      setVerifying(true);
      const latestBus = await fetchBusById(id, { date: travelDate });
      const unavailableSet = new Set(latestBus.seats.filter((seat) => !seat.isAvailable).map((seat) => seat.seatNumber));
      const unavailableSelected = selectedSeats.filter((seat) => unavailableSet.has(seat));

      if (unavailableSelected.length > 0) {
        setSelectedSeats((prev) => prev.filter((seat) => !unavailableSet.has(seat)));
        setBus(latestBus);
        setError(`Seat(s) ${unavailableSelected.join(", ")} just got booked. We refreshed availability.`);
        return;
      }

      navigate("/booking/confirm", {
        state: {
          bus: latestBus,
          travelDate,
          searchQuery: location.search,
          selectedSeats,
          totalPrice: selectedSeats.length * latestBus.price,
        },
      });
    } catch (err) {
      setError(err.message || "Unable to verify latest seat availability.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="page page-top">
      <section className="container">
        <div className="top-row">
          <div>
            <h1 className="title">Seat Selection</h1>
            {travelDate && <p className="muted">Travel Date: {travelDate}</p>}
          </div>
          <Link to={`/buses${location.search}`} className="button-outline">
            Back to Buses
          </Link>
        </div>

        {loading && <p className="muted">Loading bus details...</p>}
        {error && <p className="alert-error">{error}</p>}

        {!loading && bus && (
          <div className="two-col">
            <div className="card">
              <h3 style={{ marginTop: 0 }}>{bus.name}</h3>
              <p className="muted">
                {bus.departureCity} to {bus.arrivalCity}
              </p>
              <p className="muted">
                {bus.departureTime} - {bus.arrivalTime}
              </p>
              <p className="muted">
                {bus.isAC ? "AC" : "NON-AC"} | {bus.seatType}
              </p>
              <p className="muted">Available seats: {bus.availableSeats}</p>
              {bus.availableSeats <= 0 && <p className="alert-error">This bus is currently full. Please choose another bus.</p>}

              <SeatGrid
                totalSeats={bus.seats.length}
                bookedSeats={bus.seats.filter((seat) => !seat.isAvailable).map((seat) => seat.seatNumber)}
                selectedSeats={selectedSeats}
                onToggle={handleSeatToggle}
              />
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0 }}>Booking Summary</h3>
              <p className="muted">Selected Seats: {selectedSeats.length ? selectedSeats.join(", ") : "None"}</p>
              <p>
                <strong>Total: Rs. {totalPrice}</strong>
              </p>
              <button
                type="button"
                className="button"
                onClick={proceed}
                disabled={!selectedSeats.length || verifying || bus.availableSeats <= 0 || !travelDate}
              >
                {verifying ? "Checking availability..." : "Continue"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default SeatSelectionPage;
