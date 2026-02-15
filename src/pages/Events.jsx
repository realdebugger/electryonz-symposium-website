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

  // ✅ ACCORDION STATE (only one open)
  const [openEventId, setOpenEventId] = useState(null);

  useEffect(() => {
    // Show offer if filtering by Technical or coming from URL
    if (filter === "Technical") {
      const isBeforeDeadline = new Date() < new Date("2026-02-22");
      if (isBeforeDeadline) {
        setShowOfferModal(true);
      }
    }
  }, [filter]);

  useEffect(() => {
    if (categoryFromUrl) {
      setFilter(categoryFromUrl);
      setOpenEventId(null); // close expanded card when category changes
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
