import React from 'react';
import '../styles/CircuitBackground.css';

const CircuitBackground = () => {
    return (
        <div className="circuit-background">
            <svg className="circuit-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
                {/* Horizontal & Vertical lines with nodes */}
                <path className="circuit-line" d="M 100 100 H 300 V 250 H 500" />
                <circle className="circuit-node" cx="100" cy="100" r="3" />
                <circle className="circuit-node" cx="300" cy="250" r="3" />
                <circle className="circuit-node" cx="500" cy="250" r="3" />

                <path className="circuit-line" d="M 900 150 H 700 V 400 H 850" />
                <circle className="circuit-node" cx="900" cy="150" r="3" />
                <circle className="circuit-node" cx="700" cy="400" r="3" />
                <circle className="circuit-node" cx="850" cy="400" r="3" />

                <path className="circuit-line" d="M 50 800 H 200 V 600 H 100" />
                <circle className="circuit-node" cx="50" cy="800" r="3" />
                <circle className="circuit-node" cx="200" cy="600" r="3" />

                <path className="circuit-line" d="M 950 850 V 650 H 800 V 750" />
                <circle className="circuit-node" cx="950" cy="850" r="3" />
                <circle className="circuit-node" cx="800" cy="650" r="3" />

                <path className="circuit-line" d="M 400 900 V 750 H 600 V 850" />
                <circle className="circuit-node" cx="400" cy="900" r="3" />
                <circle className="circuit-node" cx="600" cy="750" r="3" />

                {/* Diagonal accents */}
                <path className="circuit-line" d="M 200 10 L 300 110 H 450" />
                <path className="circuit-line" d="M 800 10 L 700 110 H 550" />
            </svg>
        </div>
    );
};

export default CircuitBackground;
