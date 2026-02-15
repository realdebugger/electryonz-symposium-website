import React, { useRef, useState, useEffect } from 'react';

const Magnetic = ({ children, strength = 0.5, radius = 100 }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < radius) {
            // Calculate attraction force (higher distance = less force)
            const force = (1 - distance / radius) * strength;
            setPosition({
                x: distanceX * force,
                y: distanceY * force
            });
        } else {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={ref}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: position.x === 0 && position.y === 0
                    ? 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                    : 'transform 0.1s linear',
                display: 'inline-block'
            }}
        >
            {children}
        </div>
    );
};

export default Magnetic;
