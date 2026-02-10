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
  // ✅ ACCORDION STATE (only one open)
  const [openEventId, setOpenEventId] = useState(null);

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
        Explore our lineup of brain-teasing technical challenges and
        adrenaline-pumping non-technical events.
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
          {["All", "Technical", "Non-Technical", "Workshop"].map(
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
