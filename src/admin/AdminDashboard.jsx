import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { eventsData } from "../data/events";
import { API_BASE } from "../config/api";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [event, setEvent] = useState("");
  const [college, setCollege] = useState("");
  const [utr, setutr] = useState("");
  const [eventCounts, setEventCounts] = useState({});
  const [showEventCounts, setShowEventCounts] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);


  /* ================= FETCH ================= */


  const fetchRegistrations = async () => {
    console.log("FETCHING WITH:", { search, event, college, utr });

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search.trim());
      if (event.trim()) params.append("event", event.trim());
      if (college.trim()) params.append("college", college.trim());
      if (utr.trim()) params.append("utr", utr.trim());

      const res = await fetch(
        `${API_BASE}/api/admin/registrations?${params.toString()}`,
        {
          headers: {
            "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
          },
        }
      );

      const json = await res.json();

      if (json.success) {
        setData(json.registrations);
        setTotal(json.totalRegistrations);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };


  const getParticipantsByEvent = (eventName) => {
    return data.filter(row =>
      row.event
        ?.split(",")
        .map(e => e.trim())
        .includes(eventName)
    );
  };

  const fetchEventCounts = async () => {
    const res = await fetch(
      `${API_BASE}/api/admin/event-count`,
      {
        headers: {
          "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
        },
      }
    );

    const json = await res.json();
    if (json.success) {
      setEventCounts(json.eventCounts);
    }
  };


  const fetchData = async () => {
    const res = await fetch(
      `${API_BASE}/api/admin/registrations`,
      {
        headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
      }
    );
    const json = await res.json();
    if (json.success) {
      setData(json.registrations);
      setTotal(json.totalRegistrations);
    }
  };
  /* ================= Use Effect ================= */
  useEffect(() => {
    fetchEventCounts();
    fetchRegistrations();
  }, [search, event, college, utr]);

  /* ================= ADD EVENT ================= */
  const openAddEvent = (user) => {
    setSelectedUser(user);
    setSelectedEvents([]);
    setShowAddEvent(true);
  };

  // ✅ toggle event
  const toggleEvent = (ev) => {
    setSelectedEvents((prev) => {
      const exists = prev.find((e) => e.id === ev.id);
      if (exists) {
        return prev.filter((e) => e.id !== ev.id);
      }
      return [
        ...prev,
        {
          id: ev.id,
          title: ev.title,
          mode: ev.modes[0], // 👈 default mode
          fee: Number(ev.fee?.[ev.modes[0]]) || 0,
        },
      ];
    });
  };

  // ✅ update mode PER EVENT
  const updateMode = (eventId, mode, fee) => {
    setSelectedEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, mode, fee: Number(fee) || 0 }
          : e
      )
    );
  };

  const additionalAmount = selectedEvents.reduce(
    (sum, e) => sum + e.fee,
    0
  );

  const confirmAddEvent = async () => {
    if (!activeUserId) return alert("No participant selected");
    if (selectedEvents.length === 0) return alert("Select events");

    const payload = {
      eventIds: selectedEvents.map((e) => ({
        title: e.title,
        fee: e.fee,
      })),
    };

    const res = await fetch(
      `${API_BASE}/api/admin/add-event/${activeUserId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
        },
        body: JSON.stringify(payload),
      }
    );

    const json = await res.json();
    if (!json.success) return alert(json.message);

    setShowAddEvent(false);
    setSelectedEvents([]);
    fetchData();
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "synerix_registrations.xlsx"
    );
  };

  const verifyPayment = async (id) => {
    await fetch(`${API_BASE}/api/admin/payment/verify/${id}`, {
      method: "PUT",
      headers: {
        "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
      },
    });
    fetchData();
  };


  const undoPayment = async (id) => {
    await fetch(`${API_BASE}/api/admin/payment/undo/${id}`, {
      method: "PUT",
      headers: {
        "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
      },
    });
    fetchData();
  };

  const verifyAttendance = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/attendance/verify/${id}`, {
        method: "PUT",
        headers: {
          "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
        },
      });

      const json = await res.json();

      if (json.success) {
        setData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, attendance_status: "VERIFIED" } : item
          )
        );
      }
    } catch (err) {
      console.error("VERIFY UI ERROR", err);
    }
  };


  //---------------Undo--------------//
  const undoAttendance = async (id) => {
    const res = await fetch(
      `${API_BASE}/api/admin/attendance/undo/${id}`,
      {
        method: "PUT",
        headers: {
          "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
        },
      }
    );

    const json = await res.json();
    if (json.success) fetchData();
  };



  //---------------Delete--------------//
  const deleteUser = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to permanently delete this registration?"
    );

    if (!confirm) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/registration/${id}`,
        {
          method: "DELETE",
          headers: {
            "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
          },
        }
      );

      const json = await res.json();

      if (json.success) {
        setData((prev) => prev.filter((item) => item.id !== id));
        setTotal((prev) => prev - 1);
      }
    } catch (err) {
      console.error("DELETE UI ERROR", err);
    }
  };




  /* ================= UI (UNCHANGED STRUCTURE) ================= */
  return (
    <div className="admin-wrapper">
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Admin Dashboard
      </h2>

      {/* FILTER BAR */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <input placeholder="Search name/email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input placeholder="Event" value={event} onChange={(e) => setEvent(e.target.value)} />
        <input placeholder="College" value={college} onChange={(e) => setCollege(e.target.value)} />
        <input placeholder="UTR" value={utr} onChange={(e) => setutr(e.target.value)}></input>
        <button className="btnexcel" onClick={exportExcel}>Export Excel</button>
      </div>

      {/* SUMMARY */}
      <div style={{ maxWidth: "1200px", margin: "0 auto 1.5rem", padding: "1rem", background: "rgba(0,0,0,0.4)", borderRadius: "10px", textAlign: "center" }}>
        <b>Total Registrations:</b> {total}
      </div>
      <button
        className="btn"
        style={{ marginBottom: "1.5rem" }}
        onClick={() => {
          setShowEventCounts(prev => !prev);
          setExpandedEvent(null);
        }}
      >
        {showEventCounts
          ? "Hide Event-wise Count"
          : "View Event-wise Registration Count"}
      </button>

      {showEventCounts && (
        <div className="event-count-wrapper">

          <h3 style={{ marginBottom: "0.8rem" }}>
            Event-wise Registration Count
          </h3>

          <div className="event-count-grid">
            {Object.entries(eventCounts).map(([eventName, count]) => (
              <div key={eventName} className="event-count-block">

                {/* EVENT COUNT CARD */}
                <button
                  className="event-count-card"
                  onClick={() =>
                    setExpandedEvent(prev =>
                      prev === eventName ? null : eventName
                    )
                  }
                >
                  <span className="event-name">{eventName}</span>
                  <span className="event-number">{count}</span>
                </button>

                {/* EXPANDED PARTICIPANTS */}
                {expandedEvent === eventName && (
                  <div className="event-expand">
                    {getParticipantsByEvent(eventName).map(user => (
                      <div key={user.id} className="event-expand-row">
                        <span>{user.name}</span>
                        <span>{user.college}</span>
                        <span>₹{user.amount}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}



      {/* TABLE (UNCHANGED) */}
      <div className="admin-table">
        <div className="admin-row header admin-grid-row">
          <div>Name</div>
          <div>College</div>
          <div>Event</div>
          <div>Amount</div>
          <div>UTR</div>
          <div>Payment</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {data.map((row) => (
          <div className="admin-row admin-grid-row" key={row.id}>
            <div>{row.name}</div>
            <div>{row.college}</div>
            <div>{row.event}</div>
            <div>₹{row.amount}</div>
            <div>{row.utr}</div>

            <div>
              {row.payment_status === "VERIFIED" ? (
                <span className="status verified">✅ Verified</span>
              ) : (
                <span className="status paid">⏳ Pending</span>
              )}
            </div>

            <div>
              {row.attendance_status === "VERIFIED" ? (
                <>
                  <span style={{ color: "lightgreen" }}>🎟 Attended</span>
                  <br />
                  <button className="undo-btn" onClick={() => undoAttendance(row.id)}>
                    Undo Attendance
                  </button>
                </>
              ) : row.payment_status === "VERIFIED" ? (
                <button className="verify-btn" onClick={() => verifyAttendance(row.id)}>
                  Verify Attendance
                </button>
              ) : (
                <span style={{ opacity: 0.5 }}>—</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {row.payment_status === "PENDING_VERIFICATION" && (
                <button className="payverify-btn" onClick={() => verifyPayment(row.id)}>
                  Verify Payment
                </button>
              )}

              {row.payment_status === "VERIFIED" && row.attendance_status !== "VERIFIED" && (
                <button className="undo-btn" onClick={() => undoPayment(row.id)}>
                  Undo
                </button>
              )}

              <button
                className="verify-btn"
                onClick={() => {
                  setActiveUserId(row.id);
                  openAddEvent(row);
                }}
              >
                + Add Event
              </button>

              <button className="delete-btn" onClick={() => deleteUser(row.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD EVENT MODAL (UI SAME, LOGIC MULTI) */}
      {showAddEvent && selectedUser && (
        <div className="admin-modal">
          <h3>Add Events for {selectedUser.name}</h3>

          <div className="event-select-grid">
            {eventsData.map((ev) => {
              const selected = selectedEvents.find(
                (e) => e.id === ev.id
              );

              return (
                <div
                  key={ev.id}
                  className={`event-chip ${selected ? "selected" : ""}`}
                  onClick={() => toggleEvent(ev)}
                >
                  <div>{ev.title}</div>

                  {/* 🔥 MODE RESTORED */}
                  {selected && ev.modes.length > 1 && (
                    <select
                      value={selected.mode}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateMode(
                          ev.id,
                          e.target.value,
                          ev.fee?.[e.target.value]
                        )
                      }
                    >
                      {ev.modes.map((m) => (
                        <option key={m} value={m}>
                          {m} – ₹{ev.fee[m]}
                        </option>
                      ))}
                    </select>
                  )}

                  {selected && ev.modes.length === 1 && (
                    <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      Mode: {ev.modes[0]} – ₹{ev.fee[ev.modes[0]]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ marginTop: "1rem" }}>
            Additional Amount: ₹{additionalAmount}
          </p>

          <button className="verify-btn" onClick={confirmAddEvent}>
            Confirm Add Event
          </button>

          <button className="undo-btn" onClick={() => setShowAddEvent(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;








