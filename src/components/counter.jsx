import { useEffect, useState } from "react";

const CountdownCounter = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const diff = new Date(targetDate) - new Date();

    if (diff <= 0) {
      return null; // event started
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 🔥 EVENT IS LIVE
  if (!timeLeft) {
    return <span className="live-now"> EVENT IS LIVE NOW</span>;
  }

  return (
    <div>
      <div className="starts-in">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>EVENT STARTS IN </h2></div>
    <div className="countdown"><span >
      {String(timeLeft.days).padStart(2, "0")}d:
      {String(timeLeft.hours).padStart(2, "0")}h:
      {String(timeLeft.minutes).padStart(2, "0")}m:
      {String(timeLeft.seconds).padStart(2, "0")}s
    </span></div>
    </div>
  );
};

export default CountdownCounter;