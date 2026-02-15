import React, { useEffect, useState } from "react";

const Preloader = ({ onFinish }) => {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        // Start exit animation after 2.5 seconds
        const timer = setTimeout(() => {
            setFade(true);
        }, 2500);

        // Unmount/Finish after animation completes
        const finishTimer = setTimeout(() => {
            onFinish();
        }, 3300); // 2500 + 800ms transition

        return () => {
            clearTimeout(timer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div className={`preloader ${fade ? "fade-out" : ""}`}>
            <div className="preloader-content">
                <h1 className="preloader-title">
                    <span>ALTRA</span>
                    <span className="outline">NZ</span>
                </h1>
                <p className="preloader-subtitle">ELECTRYONZ'26</p>
                <div className="preloader-line"></div>
            </div>
        </div>
    );
};

export default Preloader;
