import { useEffect, useState } from "react";

const formatClock = (value) =>
  value.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

function LiveClock({ label = "Current Time" }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <p className="muted live-clock">
      {label}: <strong>{formatClock(now)} IST</strong>
    </p>
  );
}

export default LiveClock;
