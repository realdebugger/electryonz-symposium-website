import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/success.css";
import PageWrapper from "../components/pageWrapper";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1️⃣ Try router state
  let data = location.state;

  // 2️⃣ Fallback to sessionStorage
  if (!data) {
    const stored = sessionStorage.getItem("synerix_registration");
    if (stored) {
      data = JSON.parse(stored);
    }
  }

  

  // 3️⃣ Hard fallback
  if (!data) {
    return (
      <div className="container section" style={{ textAlign: "center" }}>
        <h2>No registration data found</h2>
        <button className="btn" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

const {
  name,
  email,
  college,
  event,
  amount,
  utr
} = data;





  console.log("SUCCESS DATA FULL:", data);
console.log("KEYS:", Object.keys(data));


  return (
    <PageWrapper>
    <div className="success-wrapper">
      <div className="success-card">

        {/* TITLE */}
        <h1 className="success-title">
          REGISTRATION SUBMITTED
        </h1>

        {/* DETAILS */}
        <div className="success-details">

          <div className="detail-row">
            <span className="detail-label">Name</span>
            <span className="detail-value">{name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{email}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">College</span>
            <span className="detail-value">{college}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Event(s)</span>
            <span className="detail-value">{event}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Amount</span>
            <span className="detail-value">₹{amount}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">UTR</span>
            <span className="detail-value">{utr || "—"}</span>
          </div>

        </div>

        {/* STATUS BOX */}
        <div className="status-box">
          ⏳ <b>Payment under verification</b>
          <br />
          You will receive a confirmation email once verified by admin.
        </div>

        {/* HOME BUTTON */}
        <button
          className="success-home-btn"
          onClick={() => navigate("/")}
        >
          GO TO HOME
        </button>

      </div>
      <p style={{textAlign: "center", marginTop: "2rem"}}>➕ Want to add more events?

If you wish to register for additional events,
please contact the event coordinators or help desk.

⚠️ Note:
• Additional amount may apply
• Payment status will go back to “Under Verification”
</p>

    </div>
    </PageWrapper>
  );
};

export default Success;
