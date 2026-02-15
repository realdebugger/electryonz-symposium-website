import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config/api";

const JoinTeam = ({ isOpen, onClose }) => {
    const [joinData, setJoinData] = useState({
        teamId: "",
        teamName: "",
        name: "",
    });
    const [joinError, setJoinError] = useState("");
    const [joinSuccess, setJoinSuccess] = useState(false);

    const inputStyle = {
        width: "100%",
        padding: "1rem",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid var(--color-border)",
        color: "#fff",
        marginBottom: "1rem",
    };

    const handleJoinChange = (e) => {
        setJoinData({ ...joinData, [e.target.name]: e.target.value });
        setJoinError("");
    };

    const handleJoinTeam = async () => {
        if (!joinData.teamId || !joinData.teamName || !joinData.name) {
            setJoinError("Please fill all fields");
            return;
        }
        try {
            setJoinError("");
            const res = await axios.post(`${API_BASE}/api/join-team`, joinData);
            if (res.data.success) {
                setJoinSuccess(true);
                setTimeout(() => {
                    setJoinSuccess(false);
                    setJoinData({ teamId: "", teamName: "", name: "" });
                    onClose();
                }, 1500);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setJoinError("Team ID doesn't exist. Please register the team first.");
            } else {
                setJoinError(err.response?.data?.message || "Failed to join team");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(5px)"
        }}>
            <div style={{
                background: "rgba(20, 20, 20, 0.95)",
                border: "1px solid var(--color-border)",
                padding: "2rem",
                borderRadius: "15px",
                maxWidth: "400px",
                width: "90%",
                textAlign: "center",
                boxShadow: "0 0 30px rgba(0, 255, 136, 0.2)"
            }}>
                <h2 style={{ color: "#00ff88", marginBottom: "1.5rem" }}>Join Team</h2>

                {joinSuccess ? (
                    <div style={{ color: "#00ff88", fontSize: "1.2rem", margin: "2rem 0" }}>
                        🎉 Joined Successfully!
                    </div>
                ) : (
                    <>
                        <input
                            name="teamId"
                            placeholder="Team ID (e.g. SYX-T1234)"
                            value={joinData.teamId}
                            onChange={handleJoinChange}
                            style={inputStyle}
                        />
                        <input
                            name="teamName"
                            placeholder="Team Name"
                            value={joinData.teamName}
                            onChange={handleJoinChange}
                            style={inputStyle}
                        />
                        <input
                            name="name"
                            placeholder="Your Name"
                            value={joinData.name}
                            onChange={handleJoinChange}
                            style={inputStyle}
                        />

                        {joinError && (
                            <div style={{ color: "#ff4d4f", marginBottom: "1rem", fontSize: "0.9rem" }}>
                                {joinError}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
                            <button
                                className="btn"
                                onClick={handleJoinTeam}
                                style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}
                            >
                                Join
                            </button>
                            <button
                                className="btn outline"
                                onClick={onClose}
                                style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default JoinTeam;