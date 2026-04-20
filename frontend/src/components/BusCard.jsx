import { Link, useLocation } from "react-router-dom";

function BusCard({ bus }) {
  const location = useLocation();
  const isFull = bus.availableSeats <= 0;

  return (
    <div className="bus-card">
      <div>
        <h3>{bus.name}</h3>
        <p className="muted">
          {bus.departureCity} to {bus.arrivalCity}
        </p>
        <p className="muted">
          {bus.departureTime} - {bus.arrivalTime}
        </p>
        <p className="muted">
          {bus.isAC ? "AC" : "Non-AC"} | {bus.busType}
        </p>
        <p className="muted">Available seats: {bus.availableSeats}</p>
      </div>

      <div>
        <p>
          <strong>Rs. {bus.price}</strong>
        </p>
        {isFull ? (
          <button className="button button-disabled-static" style={{ marginTop: "8px" }} type="button" disabled>
            Full Bus
          </button>
        ) : (
          <Link to={`/buses/${bus.id}/seats${location.search}`}>
            <button className="button" style={{ marginTop: "8px" }} type="button">
              Book Now
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default BusCard;
