import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useReveal from "../hooks/useReveal";
import CountdownCounter from "../components/counter";
import ParticlesComponent from "../components/HeroParticles";
import { useEffect } from "react";
import gceLogo from "../assets/gce_logo.png";
import meaLogo from "../assets/mea_logo.png";


import CountdownTimer from "../components/CountdownTimer";

import Magnetic from "../components/Magnetic";

const Home = () => {
  useReveal();
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target); // 🔒 reveal only once
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));
  }, []);

  return (
    <div className="home-page">
      {/* ================= HERO SECTION ================= */}
      <section
        className="section reveal"
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          isolation: "isolate", // 👈 VERY IMPORTANT
        }}
      >

        {/* 🌌 Particle Background */}
        <ParticlesComponent />
        {/* Abstract shapes */}
        <div className="hero-section">
          <div
            style={{
              position: "absolute",
              top: "20%",
              right: "10%",
              width: "300px",
              height: "300px",
              border: "1px solid var(--color-primary)",
              borderRadius: "50%",
              opacity: 0.2,
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "5%",
              width: "200px",
              height: "200px",
              border: "1px solid var(--color-secondary)",
              transform: "rotate(45deg)",
              opacity: 0.2,
              zIndex: 1,
            }}
          />
          <div className="particle-vignette" />


          {/* Hero Content */}
          {/* ===== INSTITUTION HEADER ===== */}
          <div className="hero-institution">
            <img
              src={gceLogo}
              alt="GCE Bargur"
              className="inst-logo left"
            />

            <div className="inst-text">
              <p className="inst-college">Government College of Engineering, Bargur – Krishnagiri</p>
              <p className="inst-assoc">(An Autonomous Institution Affiliated to Anna University &
                Accredited by NAAC AND NBA )</p>
              <p className="inst-dept">Department of Electrical And Electronics Engineering</p>

            </div>

            <img
              src={meaLogo}
              alt="Electric Association"
              className="inst-logo right"
            />
          </div>

          <section className="hero">
            <div
              className="container"
              style={{
                textAlign: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div className="hero-branding">
                <div className="hero-presents reveal delay-1">PRESENTS</div>
                <div className="hero-phantasm reveal delay-2">ELECTRYONZ’26</div>

                <h1 className="hero-title glitch reveal delay-3" data-text="ALTRANZ">
                  ALTRA
                  <span className="hero-title-outline reveal delay-3">NZ</span>
                </h1>
              </div>

              <p className="hero-subtitle reveal delay-4">
                Organized a symposium that proved learning can be fun,
                networking can be awkwardly awesome, and ideas do collide—sometimes literally
              </p>

              <div className="hero-actions reveal delay-5">
                <Magnetic strength={0.2} radius={150}>
                  <a href="https://altranz26.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Register
                  </a>
                </Magnetic>

                <Magnetic strength={0.2} radius={150}>
                  <Link to="/events" className="btn btn-secondary">
                    View Events
                  </Link>
                </Magnetic>

              </div>
              <div className="hero-dates scanline reveal delay-6">
                FEBRUARY 26 & 27
              </div>


            </div>
          </section>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <div className="hero-timer">
        <CountdownTimer targetDate="2026-02-26T09:00:00" />
      </div>
      {/* ================= ABOUT TEASER ================= */}
      <section
        className="section reveal ignite-section"
        style={{ background: "var(--color-bg-card)" }}
      >
        <div className="container ignite-container">
          <h2 className="ignite-title">Charge Forward</h2>

          <p className="ignite-desc">
            Register today—because epic memories aren’t made from staying home
          </p>

          <ul className="ignite-list">
            {["10+ Events", "Cash Prizes"].map((item) => (
              <li key={item}>
                <span className="ignite-arrow">►</span>
                {item}
              </li>
            ))}
          </ul>

          <Link to="/about" className="ignite-link">
            Read More →
          </Link>
        </div>
      </section>




    </div>
  );
};

export default Home;