function SeatGrid({ totalSeats, bookedSeats, selectedSeats, onToggle }) {
  const bookedSet = new Set(bookedSeats);
  const selectedSet = new Set(selectedSeats);
  const rows = Math.ceil(totalSeats / 4);

  return (
    <div className="seat-layout">
      {Array.from({ length: rows }, (_, rowIndex) => {
        const rowStart = rowIndex * 4 + 1;
        const rowSeats = [rowStart, rowStart + 1, rowStart + 2, rowStart + 3];

        return (
          <div key={rowIndex} className="seat-row">
            {rowSeats.slice(0, 2).map((seatNumber) => {
              if (seatNumber > totalSeats) return <div key={seatNumber} className="seat-empty" />;
              const isBooked = bookedSet.has(seatNumber);
              const isSelected = selectedSet.has(seatNumber);
              let seatClass = "seat";
              if (isBooked) seatClass += " booked";
              if (!isBooked && isSelected) seatClass += " selected";

              return (
                <button
                  key={seatNumber}
                  type="button"
                  disabled={isBooked}
                  onClick={() => onToggle(seatNumber)}
                  className={seatClass}
                >
                  {seatNumber}
                </button>
              );
            })}

            <div className="seat-aisle" />

            {rowSeats.slice(2).map((seatNumber) => {
              if (seatNumber > totalSeats) return <div key={seatNumber} className="seat-empty" />;
              const isBooked = bookedSet.has(seatNumber);
              const isSelected = selectedSet.has(seatNumber);
              let seatClass = "seat";
              if (isBooked) seatClass += " booked";
              if (!isBooked && isSelected) seatClass += " selected";

              return (
                <button
                  key={seatNumber}
                  type="button"
                  disabled={isBooked}
                  onClick={() => onToggle(seatNumber)}
                  className={seatClass}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default SeatGrid;
