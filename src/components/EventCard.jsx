import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { technicalEventDescriptions } from "../data/eventDescription";
import RulesModal from "../components/RulesModal";



import Tilt from 'react-parallax-tilt';

const EventCard = ({ event, isOpen, onToggle, index, onOpenRules }) => {
  const navigate = useNavigate();



  const categoryClass =
    event.category === "Technical"
      ? "warm"
      : event.category === "Non-Technical"
        ? "cold"
        : "workshop";

  let buttonColor;
  if (event.category === "Technical") buttonColor = "btn-secondary";
  else if (event.category === "Non-Technical") buttonColor = "btn";
  else buttonColor = "btn-tertiary";

  let borderColor;
  if (event.category === "Technical")
    borderColor = "var(--color-secondary)";
  else if (event.category === "Non-Technical")
    borderColor = "var(--color-primary)";
  else borderColor = "#a217ffff";

  const handleRegister = () => {
    // navigate("/register", {
    //   state: { preselectedEvent: event.title },
    // });
    window.open("https://altranz26.vercel.app", "_blank", "noopener,noreferrer");
  };

  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.3}
      glareColor="#ffffff"
      glarePosition="all"
      scale={1.02}
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      className={`event-card card ${categoryClass}`}
      style={{
        border: `1px solid ${borderColor}`,
        background: "rgba(255,255,255,0.03)",
        position: "relative",
        animation: `cardFadeUp 0.5s ease forwards`,
        animationDelay: `${index * 120}ms`,
        animationFillMode: "both"

      }}
    >
      {/* CATEGORY TAG */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: borderColor,
          color: "#000",
          padding: "0.2rem 1rem",
          fontSize: "0.8rem",
          fontWeight: "bold",
        }}
      >
        {event.category}
      </div>

      {/* BASIC CONTENT */}
      <h3 style={{ color: "#fff" }}>{event.title}</h3>

      {event.fee && event.category !== "Workshop" && (
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
          }}
        >
          Entry:&nbsp;
          {Object.entries(event.fee).map(([mode, price], i) => {
            const isEarlyBirdEvent = event.id === "paper-presentation" || event.id === "project-expo";
            const isEarlyBirdActive = new Date() < new Date("2026-02-22");
            const showEarlyBird = isEarlyBirdEvent && isEarlyBirdActive;

            return (
              <span key={mode}>
                {mode}:&nbsp;
                {showEarlyBird ? (
                  <>
                    <span style={{ textDecoration: "line-through", opacity: 0.6, marginRight: "5px" }}>
                      ₹{price}
                    </span>
                    <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>
                      ₹300
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--color-primary)", marginLeft: "5px", verticalAlign: "middle" }}>
                      (EARLY BIRD)
                    </span>
                  </>
                ) : (
                  `₹${price}`
                )}
                {i < Object.keys(event.fee).length - 1 && " | "}
              </span>
            );
          })}
        </p>
      )}

      {event.fee && event.category === "Workshop" && (
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
          }}
        >
          Entry:&nbsp;
          {Object.entries(event.fee).map(([mode, price], i) => (
            <span key={mode}>
              ₹{price}
              {i < Object.keys(event.fee).length - 1 && " | "}
            </span>
          ))}
        </p>
      )}

      {/* DETAILS BUTTON */}
      <div className="btn-grp">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="details-btn btn btn-secondary"
          style={{
            margin: "1rem 0",
            padding: "0.5rem 1rem",
          }}
        >
          {isOpen ? "Hide Details" : "Details"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Rules clicked (child):", event.title);
            onOpenRules(event);
          }}
        >
          Rules
        </button>
      </div>
      {/* EXPANDABLE SECTION (SMOOTH ANIMATION) */}
      <div
        className={`event-details ${isOpen ? "open" : ""}`}
        style={{
          marginTop: isOpen ? "1.5rem" : "0",
          paddingTop: isOpen ? "1.2rem" : "0",
          borderTop: isOpen
            ? "1px dashed var(--color-border)"
            : "none",
        }}
      >
        {technicalEventDescriptions[event.id] && (
          <p
            style={{
              color: "#ccc",
              lineHeight: 1.6,
              marginBottom: "0.8rem",
            }}
          >
            {technicalEventDescriptions[event.id]}
          </p>
        )}

        {event.category !== "Workshop" && (
          <p
            style={{
              color: "#aaa",
              fontSize: "0.9rem",
              lineHeight: 1.6,
            }}
          >
            🕒 Duration: {event.duration || "1–2 Hours"} <br />
            {event.maxMembers && (
              <>
                👥 Team Size: {event.maxMembers || "Solo / Team"} <br />
              </>
            )}
            📍 Venue: {event.venue || "Mechanical Block"} <br />
            🏆 Certificates & exciting prizes
          </p>
        )}

        {event.category === "Workshop" && (
          <p
            style={{
              color: "#aaa",
              fontSize: "0.9rem",
              lineHeight: 1.6,
            }}
          >
            🕒 Duration: {event.duration || "1–2 Hours"} hrs<br />
            📍 Venue: {event.venue || "Mechanical Block"} <br />
            🏆 Certificates will be provided
          </p>
        )}


        <button
          onClick={handleRegister}
          className={buttonColor}
          style={{
            marginTop: "1rem",
            borderColor: borderColor,
          }}
        >
          Register
        </button>
      </div>

    </Tilt>
  );
}


export default EventCard;
