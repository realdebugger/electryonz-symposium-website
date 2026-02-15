import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "../components/pageWrapper";
import { API_BASE } from "../config/api";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const amount = location.state?.amount || 0;
  const eventName = location.state?.event || "SYNERIX EVENT";

  const [utr, setUtr] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formattedAmount = parseFloat(amount).toFixed(2);
  // Truncate event name to 80 chars to avoid UPI limit errors
  const safeNote = (eventName || "SYNERIX EVENT").substring(0, 80);

  const upiLink = `upi://pay?pa=madhankumar1652005@oksbi&pn=${encodeURIComponent(
    "SYNERIX MEA"
  )}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(safeNote)}`;

  /* ===============================
     SUBMIT PAYMENT & REGISTER
  ================================ */
  const handleSubmitPayment = async () => {
    setError("");

    // 🔒 UTR FORMAT CHECK (Frontend)
    if (!/^[A-Za-z0-9]{12,22}$/.test(utr)) {
      setError("Please enter a valid Transaction ID (UTR)");
      return;
    }

    // 🔹 Load saved registration form
    const savedForm = sessionStorage.getItem("synerix_form_draft");
    if (!savedForm) {
      alert("Registration data not found. Please register again.");
      navigate("/register");
      return;
    }

    const formData = JSON.parse(savedForm);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      dept: formData.dept,
      year: formData.year,
      event: eventName,
      amount: amount,
      utr: utr,
    };

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      // ❌ Backend rejected (duplicate UTR etc.)
      if (!res.ok) {
        setError(json.message || "Registration failed");
        setLoading(false);
        return;
      }

      // ✅ BUILD FULL REGISTRATION OBJECT (IMPORTANT)
      const registrationData = {
        ...payload,
        registrationId: json.registrationId,
        paymentStatus: "PENDING_VERIFICATION",
      };

      // ✅ Persist for refresh safety
      sessionStorage.removeItem("synerix_form_draft");
      sessionStorage.setItem(
        "synerix_registration",
        JSON.stringify(registrationData)
      );

      // ✅ Navigate with FULL data
      navigate("/success", { state: registrationData });

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }



  };

  return (
    <PageWrapper>
      <div className="container section payment-page">
        <h1>Complete Payment</h1>

        <p>
          Event: <b>{eventName}</b>
        </p>
        <p>
          Amount: <b>₹{amount}</b>
        </p>

        {/* QR CODE */}
        <div className="payment-qr">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
              upiLink
            )}`}
            alt="UPI QR"
          />
          <p style={{ marginTop: "1rem", opacity: 0.7 }}>
            Scan using GPay / PhonePe / Paytm
          </p>
        </div>

        {/* OPTIONAL UPI BUTTON
        <a href={upiLink} className="btn" style={{ marginTop: "1rem" }}>
          Open UPI App
        </a> */}

        {/* UTR INPUT */}
        <div style={{ marginTop: "2rem", maxWidth: "320px", marginInline: "auto" }}>
          <p>
            After payment, paste your <b>Transaction ID (UTR)</b>
          </p>

          <input
            type="text"
            placeholder="Enter UTR / Transaction ID"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--color-border)",
              color: "#fff",
            }}
          />

          {error && (
            <p style={{ color: "#ff4d4d", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              ⚠️ {error}
            </p>
          )}

          <button
            className="btn"
            style={{ marginTop: "1rem", width: "100%" }}
            onClick={handleSubmitPayment}
            disabled={loading}
          >
            {loading
              ? "Verifying Payment..."
              : "Submit Payment & Complete Registration"}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Payment;
