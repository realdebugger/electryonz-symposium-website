import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // We'll add specific styles here if needed, or use inline/utility

const Navbar = ({ openJoinTeam }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Schedule', path: '/schedule' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="logo">
                    ALTRA<span className="logo-highlight">NZ</span>
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    {isOpen ? '✕' : '☰'}
                </div>

                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <li key={link.name} className="nav-item">
                            <Link
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}


                    {/* <li className="nav-item">
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: "1.2",
                            fontSize: "0.75rem",
                            fontWeight: "bold"
                        }}>
                            <span style={{ color: "rgba(255,255,255,0.7)", marginBottom: "2px" }}>
                                Already have a team?
                            </span>
                            <button
                                onClick={openJoinTeam}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--color-primary)",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    padding: "0",
                                    fontSize: "0.85rem",
                                    fontWeight: "bold",
                                    transition: "color 0.3s"
                                }}
                                onMouseEnter={(e) => e.target.style.color = "#fff"}
                                onMouseLeave={(e) => e.target.style.color = "var(--color-primary)"}
                            >
                                Join here
                            </button>
                        </div>
                    </li>
 */}


                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
