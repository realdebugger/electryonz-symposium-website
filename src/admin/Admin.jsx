import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    

  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
    console.log("ENV SECRET:", import.meta.env.VITE_ADMIN_SECRET);
    console.log("ENTERED:", secret);
  const handleLogin = () => {
    if (secret === import.meta.env.VITE_ADMIN_SECRET) {
      sessionStorage.setItem("synerix_admin_auth", "true");
      navigate("/__synerix_admin_panel");
    } else {
      setError("Invalid admin key");
    }
  };

  return (
    <div className="container section" style={{ maxWidth: "400px" }}>
      <h2>Admin Access</h2>

      <input
        type="password"
        placeholder="Enter admin key"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        style={{ width: "100%", padding: "1rem" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        className="btn"
        style={{ width: "100%", marginTop: "1rem" }}
        onClick={handleLogin}
      >
        Enter
      </button>
    </div>
  );
};

export default AdminLogin;
