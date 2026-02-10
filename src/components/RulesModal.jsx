import React, { useEffect, useRef } from "react";
import "./rulesModal.css";

const RulesModal = ({ isOpen, onClose, event }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isOpen]);

  // ✅ Render nothing AFTER hooks
  if (!isOpen || !event) return null;

  return (
    <div className="rules-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="rules-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{event.title} – Rules</h2>

        <ul>
          {event.rules?.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>

        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default RulesModal;
