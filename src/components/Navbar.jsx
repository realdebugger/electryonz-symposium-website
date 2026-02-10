import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // We'll add specific styles here if needed, or use inline/utility

const Navbar = () => {
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
                    SYNER<span className="logo-highlight">IX</span>
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
                    <li className="nav-item">
                        <Link to="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>
                            Register
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
