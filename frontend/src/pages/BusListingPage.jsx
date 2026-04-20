import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BusCard from "../components/BusCard";
import { fetchBuses } from "../services/api";
import { getConnectingRouteMap } from "../constants/routeMap";
import LiveClock from "../components/LiveClock";

const SLOT_OPTIONS = [
  { label: "Morning (6 AM - 12 PM)", value: "morning" },
  { label: "Afternoon (12 PM - 4 PM)", value: "afternoon" },
  { label: "Evening (4 PM - 8 PM)", value: "evening" },
  { label: "Night (8 PM - 6 AM)", value: "night" },
];

function BusListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState({ buses: [], page: 1, pageSize: 10, totalPages: 1, totalBuses: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const query = useMemo(
    () => ({
      departureCity: searchParams.get("departureCity") || "",
      arrivalCity: searchParams.get("arrivalCity") || "",
      date: searchParams.get("date") || "",
      seatType: searchParams.get("seatType") || "",
      isAC: searchParams.get("isAC") || "",
      departureSlot: searchParams.get("departureSlot") || "",
      page: searchParams.get("page") || "1",
      pageSize: searchParams.get("pageSize") || "10",
    }),
    [searchParams]
  );
  const hasRequiredQuery = Boolean(query.departureCity && query.arrivalCity && query.date);
  const routePlans = getConnectingRouteMap(query.departureCity, query.arrivalCity);

  useEffect(() => {
    if (!hasRequiredQuery) {
      setLoading(false);
      setResult({ buses: [], page: 1, pageSize: 10, totalPages: 1, totalBuses: 0 });
      setError("Search details are missing. Please start a new search.");
      return;
    }

    const loadBuses = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchBuses(query);
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadBuses();
  }, [query, hasRequiredQuery, retryCount]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "") next.delete(key);
    else next.set(key, value);
    next.set("page", "1");
    setSearchParams(next);
  };

  const goPage = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  };

  return (
    <main className="page page-top">
      <section className="container">
        <div className="top-row">
          <h1 className="title">Available Buses</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <LiveClock />
            <Link to="/search" className="button-outline">
              New Search
            </Link>
          </div>
        </div>

        <div className="listing-layout">
          <aside className="card filter-card">
            <h3 style={{ marginTop: 0 }}>Filters</h3>

            <label className="label">Seat Type</label>
            <select className="select" value={query.seatType} onChange={(e) => setFilter("seatType", e.target.value)}>
              <option value="">All</option>
              <option value="normal">Normal</option>
              <option value="semi-sleeper">Semi-Sleeper</option>
              <option value="sleeper">Sleeper</option>
            </select>

            <label className="label" style={{ marginTop: "10px" }}>
              AC / NON-AC
            </label>
            <select className="select" value={query.isAC} onChange={(e) => setFilter("isAC", e.target.value)}>
              <option value="">All</option>
              <option value="true">AC</option>
              <option value="false">NON-AC</option>
            </select>

            <label className="label" style={{ marginTop: "10px" }}>
              Departure Slots
            </label>
            <select
              className="select"
              value={query.departureSlot}
              onChange={(e) => setFilter("departureSlot", e.target.value)}
            >
              <option value="">All</option>
              {SLOT_OPTIONS.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </aside>

          <div>
            <p className="muted">
              {query.departureCity} to {query.arrivalCity} | {query.date}
            </p>
            {routePlans.length > 0 && (
              <div className="route-map-card" style={{ marginBottom: "12px" }}>
                <p className="muted" style={{ marginTop: 0 }}>
                  Connecting Route Map
                </p>
                <ul className="route-map-list">
                  {routePlans.map((path) => (
                    <li key={path.join("-")}>{path.join(" -> ")}</li>
                  ))}
                </ul>
              </div>
            )}

            {loading && <p className="muted">Loading buses...</p>}
            {error && <p className="alert-error">{error}</p>}
            {error && (
              <div style={{ marginTop: "8px" }}>
                <button type="button" className="button" onClick={() => setRetryCount((prev) => prev + 1)}>
                  Retry
                </button>
              </div>
            )}
            {!loading && !error && result.buses.length === 0 && <p className="alert-error">No buses found.</p>}

            <div className="list">
              {result.buses.map((bus) => (
                <BusCard key={bus.id} bus={bus} />
              ))}
            </div>

            {!loading && !error && result.totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="button"
                  disabled={result.page <= 1}
                  onClick={() => goPage(result.page - 1)}
                >
                  Prev
                </button>
                <span className="muted">
                  Page {result.page} / {result.totalPages}
                </span>
                <button
                  type="button"
                  className="button"
                  disabled={result.page >= result.totalPages}
                  onClick={() => goPage(result.page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default BusListingPage;
