import React from "react";
import { Link } from "react-router-dom";
import "./FooterStyles.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">

        {/* ABOUT */}
        <div className="footer-col">
          <h4 className="footer-title">ABOUT US</h4>
          <p>
            Mechanical Engineering Association (MEA) is the major part of the
            Department of Mechanical Engineering, headed by
            Dr. P. Thirumal, Head of the Department.
          </p>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4 className="footer-title">CONTACT US</h4>

          <p>📍 Government College of Engineering</p>
          <p>NH 46, Chennai–Bangalore Highway</p>
          <p>Bargur, Krishnagiri – 635104</p>

          <p>✉️ synerix26@gmail.com</p>
          <p>📞 +91 6369143807</p>


          <div className="footer-socials">
            <a
              href="https://www.instagram.com/phantasm_gceb?igsh=MW9kYzE5cjFtbWo5ag=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a
              href="https://www.youtube.com/@synerix"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>

        </div>

        {/* LINKS */}
        <div className="footer-col">
          <h4 className="footer-title">LINKS</h4>
          <ul>
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/events">EVENT</Link></li>
            <li><Link to="/about">ABOUT</Link></li>
            <li><Link to="/contact">CONTACT US</Link></li>
            <li><Link to="/schedule">SCHEDULE</Link></li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        DEVELOPED BY MEAGCEB © 2026
      </div>
    </footer>
  );
};

export default Footer;
