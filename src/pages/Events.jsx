import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import { eventsData } from "../data/events";
import RulesModal from "../components/RulesModal";


const Events = () => {

  const eventsWrapperRef = useRef(null);
  const [activeRuleEvent, setActiveRuleEvent] = useState(null);
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");


  const [filter, setFilter] = useState(
    categoryFromUrl ? categoryFromUrl : "All"
  );
  const [showOfferModal, setShowOfferModal] = useState(false);

  const [showNonTechWarning, setShowNonTechWarning] = useState(false);
  const [showCombinedModal, setShowCombinedModal] = useState(false);

  // ✅ ACCORDION STATE (only one open)
  const [openEventId, setOpenEventId] = useState(null);

  // Checks for popups whenever filter changes
  useEffect(() => {
    // Show offer if filtering by Technical or coming from URL
    if (filter === "Technical") {
      const isBeforeDeadline = new Date() < new Date("2026-02-22");
      if (isBeforeDeadline) {
        setShowOfferModal(true);
      }
    } else if (filter === "Non-Technical") {
      setShowNonTechWarning(true);
    } else if (filter === "All") {
      setShowCombinedModal(true);
    }
  }, [filter]);

  // Syncs filter with URL category
  useEffect(() => {
    if (categoryFromUrl) {
      setFilter(categoryFromUrl);
      setOpenEventId(null);

      // Force trigger popups based on URL with a small delay to ensure it catches
      const timer = setTimeout(() => {
        if (categoryFromUrl === "Technical") {
          const isBeforeDeadline = new Date() < new Date("2026-02-22");
          if (isBeforeDeadline) setShowOfferModal(true);
        } else if (categoryFromUrl === "Non-Technical") {
          setShowNonTechWarning(true);
        }
      }, 300); // 300ms delay to be safe

      return () => clearTimeout(timer);
    }
  }, [categoryFromUrl]);

  const [showRules, setShowRules] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  const openRules = (event) => {
    console.log("Rules clicked:", event.title);
    setActiveEvent(event);
    setShowRules(true);
  };

  const closeRules = () => {
    setShowRules(false);
    setActiveEvent(null);
  };
  const filteredEvents =
    filter === "All"
      ? eventsData
      : eventsData.filter((e) => e.category === filter);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openEventId &&
        eventsWrapperRef.current &&
        !eventsWrapperRef.current.contains(e.target)
      ) {
        setOpenEventId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openEventId]);


  return (
    <div className="events-page">
      {/* EARLY BIRD MODAL */}
      {showOfferModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.8)", zIndex: 20000, display: "flex",
          justifyContent: "center", alignItems: "center", padding: "20px"
        }}>
          <div className="card" style={{
            maxWidth: "500px", padding: "2.5rem", border: "1px solid var(--color-primary)",
            textAlign: "center", background: "#0a0a0a", position: "relative"
          }}>
            <h2 style={{ color: "var(--color-primary)", marginBottom: "1rem" }}>⚡ EARLY BIRD OFFER ⚡</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Register for <strong style={{ color: "#fff" }}>Paper Presentation</strong> or <strong style={{ color: "#fff" }}>Project Expo</strong> before <strong style={{ color: "var(--color-primary)" }}>Feb 22</strong> and get a special discount!
            </p>
            <div style={{
              display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "2rem",
              fontSize: "1.2rem", fontWeight: "bold"
            }}>
              <span style={{ textDecoration: "line-through", opacity: 0.5 }}>₹350</span>
              <span style={{ color: "var(--color-primary)" }}>₹300 ONLY</span>
            </div>
            <button className="btn" onClick={() => setShowOfferModal(false)}>Got it!</button>
          </div>
        </div>
      )}

      {/* NON-TECHNICAL WARNING POPUP */}
      {showNonTechWarning && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.8)", zIndex: 20000, display: "flex",
          justifyContent: "center", alignItems: "center", padding: "20px",
          backdropFilter: "blur(5px)"
        }} onClick={() => {
          setShowNonTechWarning(false);
          setFilter("All");
        }}>
          <div className="card" style={{
            maxWidth: "400px", padding: "2rem", border: "1px solid var(--color-secondary)",
            textAlign: "center", background: "#0a0a0a", position: "relative",
            boxShadow: "0 0 30px rgba(192, 192, 192, 0.2)"
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "var(--color-secondary)", marginBottom: "1rem", fontSize: "1.5rem" }}>⚠️ IMPORTANT NOTICE</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "1.5rem", color: "#e0e0e0" }}>
              There is <strong>NO ON-SPOT REGISTRATION</strong> for Non-Technical events.
            </p>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "2rem" }}>
              Please register online before the deadline to participate.
            </p>
            <button className="btn btn-secondary" onClick={() => setShowNonTechWarning(false)}>
              I Understand
            </button>
            <button style={{
              background: "none", border: "none", color: "#666",
              textDecoration: "underline", marginLeft: "1rem", cursor: "pointer"
            }} onClick={() => {
              setShowNonTechWarning(false);
              setFilter("All");
            }}>
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* COMBINED MODAL (Default on "All") */}
      {showCombinedModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.85)", zIndex: 20000, display: "flex",
          justifyContent: "center", alignItems: "center", padding: "20px",
          backdropFilter: "blur(8px)"
        }}>
          <div className="card" style={{
            maxWidth: "600px", width: "100%", padding: "2rem", border: "1px solid var(--color-primary)",
            background: "#0a0a0a", position: "relative",
            maxHeight: "90vh", overflowY: "auto"
          }}>
            <button
              onClick={() => setShowCombinedModal(false)}
              style={{
                position: "absolute", top: "10px", right: "15px", background: "none", border: "none",
                color: "#fff", fontSize: "1.5rem", cursor: "pointer"
              }}
            >✕</button>

            {/* Part 1: Early Bird (Conditional based on date) */}
            {(new Date() < new Date("2026-02-22")) && (
              <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <h2 style={{ color: "var(--color-primary)", marginBottom: "1rem", textAlign: "center" }}>⚡ EARLY BIRD OFFER ⚡</h2>
                <p style={{ fontSize: "1rem", lineHeight: "1.5", marginBottom: "1rem", textAlign: "center", color: "#ddd" }}>
                  Register for <strong style={{ color: "#fff" }}>Paper Presentation</strong> or <strong style={{ color: "#fff" }}>Project Expo</strong> before <strong style={{ color: "var(--color-primary)" }}>Feb 22</strong> and get a special discount!
                </p>
                <div style={{
                  display: "flex", justifyContent: "center", gap: "1rem",
                  fontSize: "1.1rem", fontWeight: "bold"
                }}>
                  <span style={{ textDecoration: "line-through", opacity: 0.5 }}>₹350</span>
                  <span style={{ color: "var(--color-primary)" }}>₹300 ONLY</span>
                </div>
              </div>
            )}

            {/* Part 2: Non-Tech Warning */}
            <div style={{ textAlign: "center" }}>
              <h2 style={{ color: "var(--color-secondary)", marginBottom: "1rem" }}>⚠️ IMPORTANT NOTICE</h2>
              <p style={{ fontSize: "1rem", lineHeight: "1.5", marginBottom: "1rem", color: "#ddd" }}>
                There is <strong>NO ON-SPOT REGISTRATION</strong> for <strong style={{ color: "var(--color-secondary)" }}>Non-Technical events</strong>.
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                Please register online before the deadline.
              </p>
            </div>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button className="btn" onClick={() => setShowCombinedModal(false)}>
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Events
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "var(--color-text-muted)",
          marginBottom: "3rem",
          maxWidth: "600px",
          margin: "0 auto 3rem",
        }}
      >
        Show off your talent and make your friends jealous in style
      </p>

      {/* FILTER BUTTONS (UNCHANGED CLASSES) */}
      <div className="event-tabs-wrapper">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "3rem",
            flexWrap: "wrap",
          }}
        >
          {["All", "Technical", "Non-Technical"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setOpenEventId(null); // close open card
                }}
                style={{
                  padding: "0.8rem 2rem",
                  background:
                    filter === cat
                      ? "var(--color-primary)"
                      : "transparent",
                  border: "1px solid var(--color-primary)",
                  color:
                    filter === cat
                      ? "#000"
                      : "var(--color-primary)",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontFamily: "var(--font-tech)",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* EVENTS GRID (UNCHANGED CLASS) */}
      <div className="container">
        {filter === "Technical" && (
          <div style={{
            background: "rgba(255, 49, 49, 0.05)",
            border: "1px dashed #ff3131",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            textAlign: "center",
            animation: "fadeIn 0.8s ease-out"
          }}>
            <p style={{ color: "rgba(255, 230, 0, 0.9)", fontSize: "1.1rem", fontWeight: "500", margin: 0 }}>
              <span style={{ marginRight: "10px" }}>🎁</span>
              <strong style={{ color: "#ff3131" }}>BONUS OFFER:</strong> Register for <strong>Paper Presentation</strong> or <strong>Project Expo </strong>
              and participate in <strong>ALL other Technical Events</strong> for free!
            </p>
          </div>
        )}
      </div>

      <div className="events-grid" ref={eventsWrapperRef}>
        {filteredEvents.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            index={index}          // ✅ PASS INDEX
            isOpen={openEventId === event.id}
            onToggle={() =>
              setOpenEventId(prev =>
                prev === event.id ? null : event.id
              )
            }
            onOpenRules={openRules}
          />
        ))}

      </div>
      <RulesModal
        isOpen={showRules}
        event={activeEvent}
        onClose={closeRules}
      />
    </div>
  );
};

export default Events;
