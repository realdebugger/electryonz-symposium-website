import React, { useState, useEffect } from 'react';
import '../styles/Countdown.css';

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let newTimeLeft = {};

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            } else {
                newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }
            return newTimeLeft;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const units = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
    ];

    return (
        <div className="flip-timer">
            {units.map((unit) => (
                <div key={unit.label} className="flip-unit">
                    <div className="flip-card">
                        {String(unit.value).padStart(2, '0')}
                    </div>
                    <span className="flip-label">{unit.label}</span>
                </div>
            ))}
        </div>
    );
};

export default CountdownTimer;
