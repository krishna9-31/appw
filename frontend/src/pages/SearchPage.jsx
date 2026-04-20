import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CITIES } from "../constants/cities";
import { getConnectingRouteMap } from "../constants/routeMap";
import LiveClock from "../components/LiveClock";

const getTodayDateInput = () => new Date().toISOString().split("T")[0];

function SearchPage() {
  const navigate = useNavigate();
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const today = getTodayDateInput();
  const routePlans = getConnectingRouteMap(departureCity, arrivalCity);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!departureCity || !arrivalCity || !date) {
      setError("Please select departure city, arrival city and travel date.");
      return;
    }

    if (departureCity === arrivalCity) {
      setError("Departure and arrival cities cannot be same.");
      return;
    }

    if (date < today) {
      setError("Travel date cannot be in the past.");
      return;
    }

    navigate(`/buses?departureCity=${departureCity}&arrivalCity=${arrivalCity}&date=${date}&page=1&pageSize=10`);
  };

  return (
    <main className="page">
      <section className="container">
        <div className="top-row">
          <h1 className="title">Search Buses</h1>
          <LiveClock />
        </div>

        <div className="card">
          <p className="subtitle">Choose your departure, arrival, and travel date.</p>
          {error && <p className="alert-error">{error}</p>}

          <form className="form" onSubmit={handleSubmit}>
            <div>
              <label className="label">Departure City</label>
              <select className="select" value={departureCity} onChange={(e) => setDepartureCity(e.target.value)}>
                <option value="">Select source</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Arrival City</label>
              <select className="select" value={arrivalCity} onChange={(e) => setArrivalCity(e.target.value)}>
                <option value="">Select destination</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Travel Date</label>
              <input className="input" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <button className="button" type="submit">
              Search
            </button>
          </form>

          {routePlans.length > 0 && (
            <div className="route-map-card">
              <h3 style={{ margin: "12px 0 6px" }}>Connecting Route Map</h3>
              <p className="muted">Suggested paths for this journey:</p>
              <ul className="route-map-list">
                {routePlans.map((path) => (
                  <li key={path.join("-")}>{path.join(" -> ")}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default SearchPage;
