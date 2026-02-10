import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useReveal from "../hooks/useReveal";
import CountdownCounter from "../components/counter";
import ParticlesComponent from "../components/HeroParticles";
import { useEffect } from "react";
import gceLogo from "../assets/gce_logo.png";
import meaLogo from "../assets/mea_logo.png";


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
              <p className="inst-dept">Department of Mechanical Engineering</p>
            </div>

            <img
              src={meaLogo}
              alt="Mechanical Association"
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
                <div className="hero-phantasm reveal delay-2">PHANTASM’26</div>

                <h1 className="hero-title reveal delay-3">
                  SYNER
                  <span className="hero-title-outline reveal delay-3">IX</span>
                </h1>
              </div>

              <p className="hero-subtitle reveal delay-4">
                The ultimate convergence of mechanical innovation and engineering excellence.
                Join us for hands-on challenges, technical mastery, and future-ready engineering.
              </p>

              <div className="hero-actions reveal delay-5">
                <Link to="/register" className="btn">
                  Register Now
                </Link>

                <Link to="/events" className="btn btn-secondary">
                  View Events
                </Link>

              </div>
              <div className="hero-dates scanline reveal delay-6">
                FEBRUARY 19, 20 & 21
              </div>


            </div>
          </section>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <div className="hero-timer">
        <CountdownCounter targetDate="2026-02-19T09:00:00" />
      </div>
      {/* ================= ABOUT TEASER ================= */}
      <section
        className="section reveal ignite-section"
        style={{ background: "var(--color-bg-card)" }}
      >
        <div className="container ignite-container">
          <h2 className="ignite-title">Ignite Your Potential</h2>

          <p className="ignite-desc">
            Synerix is not just a symposium; it's a platform for the next generation
            of innovators.
          </p>

          <ul className="ignite-list">
            {["20+ Events", "Cash Prizes", "Industry Experts"].map((item) => (
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


      {/* ================= HIGHLIGHTS ================= */}
      <div className="highlight-grid">
        {[
          { title: "Technical", color: "var(--color-primary)" },
          { title: "Non-Technical", color: "var(--color-secondary)" },
          { title: "Workshop", color: "#d946ef" },
        ].map((card) => (
          <div
            key={card.title}
            className={`highlight-section highlight-${card.title.toLowerCase().replace(" ", "-")}`}
            onClick={() => navigate(`/events?category=${card.title}`)}
          >
            <h3 style={{ color: card.color }}>{card.title}</h3>
          </div>

        ))}
      </div>

    </div>
  );
};

export default Home;