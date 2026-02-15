import React, { useState, useEffect } from 'react';

const DesktopPopup = () => {
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setInnerWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Width threshold for mobile/tablet (1024px)
    const isMobileView = innerWidth < 1024;

    if (!isMobileView) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(5, 5, 5, 0.98)', // Darker, more gated
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(10px)',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid var(--color-primary, #FFD700)',
                padding: '3rem 2rem',
                borderRadius: '16px',
                maxWidth: '500px',
                textAlign: 'center',
                boxShadow: '0 0 50px rgba(255, 215, 0, 0.15)',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <div style={{
                    fontSize: '3rem',
                    marginBottom: '1.5rem',
                    color: 'var(--color-primary)'
                }}>
                    🖥️
                </div>

                <h3 style={{
                    color: 'var(--color-primary, #FFD700)',
                    marginBottom: '1rem',
                    fontSize: '1.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    fontFamily: 'var(--font-hero, serif)'
                }}>
                    DESKTOP ONLY
                </h3>

                <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '2rem',
                    lineHeight: '1.8',
                    fontSize: '1.1rem'
                }}>
                    To experience the full cinematic beauty of **ALTRANZ 2026**, please use a
                    Desktop Computer or enable Desktop Mode in your browser's settings.
                </p>

                <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-primary)',
                    letterSpacing: '1px',
                    opacity: 0.6,
                    borderTop: '1px solid rgba(255, 215, 0, 0.2)',
                    paddingTop: '1.5rem',
                    fontStyle: 'italic'
                }}>
                    This popup will automatically disappear once you switch to a larger screen view.
                </div>
            </div>
        </div>
    );
};

export default DesktopPopup;
