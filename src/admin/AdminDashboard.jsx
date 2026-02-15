// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { eventsData } from "../data/events";
// import { API_BASE } from "../config/api";

// const AdminDashboard = () => {
//   const [data, setData] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [search, setSearch] = useState("");
//   const [event, setEvent] = useState("");
//   const [college, setCollege] = useState("");
//   const [utr, setutr] = useState("");
//   const [eventCounts, setEventCounts] = useState({});
//   const [showEventCounts, setShowEventCounts] = useState(false);
//   const [expandedEvent, setExpandedEvent] = useState(null);

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedEvents, setSelectedEvents] = useState([]);
//   const [activeUserId, setActiveUserId] = useState(null);
//   const [showAddEvent, setShowAddEvent] = useState(false);


//   /* ================= FETCH ================= */


//   const fetchRegistrations = async () => {
//     console.log("FETCHING WITH:", { search, event, college, utr });

//     try {
//       const params = new URLSearchParams();

//       if (search.trim()) params.append("search", search.trim());
//       if (event.trim()) params.append("event", event.trim());
//       if (college.trim()) params.append("college", college.trim());
//       if (utr.trim()) params.append("utr", utr.trim());

//       const res = await fetch(
//         `${API_BASE}/api/admin/registrations?${params.toString()}`,
//         {
//           headers: {
//             "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
//           },
//         }
//       );

//       const json = await res.json();

//       if (json.success) {
//         setData(json.registrations);
//         setTotal(json.totalRegistrations);
//       }
//     } catch (err) {
//       console.error("FETCH ERROR:", err);
//     }
//   };


//   const getParticipantsByEvent = (eventName) => {
//     return data.filter(row =>
//       row.event
//         ?.split(",")
//         .map(e => e.trim())
//         .includes(eventName)
//     );
//   };

//   const fetchEventCounts = async () => {
//     const res = await fetch(
//       `${API_BASE}/api/admin/event-count`,
//       {
//         headers: {
//           "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
//         },
//       }
//     );

//     const json = await res.json();
//     if (json.success) {
//       setEventCounts(json.eventCounts);
//     }
//   };


//   const fetchData = async () => {
//     const res = await fetch(
//       `${API_BASE}/api/admin/registrations`,
//       {
//         headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
//       }
//     );
//     const json = await res.json();
//     if (json.success) {
//       setData(json.registrations);
//       setTotal(json.totalRegistrations);
//     }
//   };
//   /* ================= Use Effect ================= */
//   useEffect(() => {
//     fetchEventCounts();
//     fetchRegistrations();
//   }, [search, event, college, utr]);

//   /* ================= ADD EVENT ================= */
//   const openAddEvent = (user) => {
//     setSelectedUser(user);
//     setSelectedEvents([]);
//     setShowAddEvent(true);
//   };

//   // ✅ toggle event
//   const toggleEvent = (ev) => {
//     setSelectedEvents((prev) => {
//       const exists = prev.find((e) => e.id === ev.id);
//       if (exists) {
//         return prev.filter((e) => e.id !== ev.id);
//       }
//       return [
//         ...prev,
//         {
//           id: ev.id,
//           title: ev.title,
//           mode: ev.modes[0], // 👈 default mode
//           fee: Number(ev.fee?.[ev.modes[0]]) || 0,
//         },
//       ];
//     });
//   };

//   // ✅ update mode PER EVENT
//   const updateMode = (eventId, mode, fee) => {
//     setSelectedEvents((prev) =>
//       prev.map((e) =>
//         e.id === eventId
//           ? { ...e, mode, fee: Number(fee) || 0 }
//           : e
//       )
//     );
//   };

//   const additionalAmount = selectedEvents.reduce(
//     (sum, e) => sum + e.fee,
//     0
//   );

//   const confirmAddEvent = async () => {
//     if (!activeUserId) return alert("No participant selected");
//     if (selectedEvents.length === 0) return alert("Select events");

//     const payload = {
//       eventIds: selectedEvents.map((e) => ({
//         title: e.title,
//         fee: e.fee,
//       })),
//     };

//     const res = await fetch(
//       `${API_BASE}/api/admin/add-event/${activeUserId}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     const json = await res.json();
//     if (!json.success) return alert(json.message);

//     setShowAddEvent(false);
//     setSelectedEvents([]);
//     fetchData();
//   };

//   const exportExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

//     const buffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     saveAs(
//       new Blob([buffer], { type: "application/octet-stream" }),
//       "synerix_registrations.xlsx"
//     );
//   };

//   const verifyPayment = async (id) => {
//     await fetch(`${API_BASE}/api/admin/payment/verify/${id}`, {
//       method: "PUT",
//       headers: {
//         "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
//       },
//     });
//     fetchData();
//   };


//   const undoPayment = async (id) => {
//     await fetch(`${API_BASE}/api/admin/payment/undo/${id}`, {
//       method: "PUT",
//       headers: {
//         "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
//       },
//     });
//     fetchData();
//   };

//   const verifyAttendance = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/api/admin/attendance/verify/${id}`, {
//         method: "PUT",
//         headers: {
//           "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
//         },
//       });

//       const json = await res.json();

//       if (json.success) {
//         setData((prev) =>
//           prev.map((item) =>
//             item.id === id ? { ...item, attendance_status: "VERIFIED" } : item
//           )
//         );
//       }
//     } catch (err) {
//       console.error("VERIFY UI ERROR", err);
//     }
//   };


//   //---------------Undo--------------//
//   const undoAttendance = async (id) => {
//     const res = await fetch(
//       `${API_BASE}/api/admin/attendance/undo/${id}`,
//       {
//         method: "PUT",
//         headers: {
//           "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
//         },
//       }
//     );

//     const json = await res.json();
//     if (json.success) fetchData();
//   };



//   //---------------Delete--------------//
//   const deleteUser = async (id) => {
//     const confirm = window.confirm(
//       "Are you sure you want to permanently delete this registration?"
//     );

//     if (!confirm) return;

//     try {
//       const res = await fetch(
//         `${API_BASE}/api/admin/registration/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
//           },
//         }
//       );

//       const json = await res.json();

//       if (json.success) {
//         setData((prev) => prev.filter((item) => item.id !== id));
//         setTotal((prev) => prev - 1);
//       }
//     } catch (err) {
//       console.error("DELETE UI ERROR", err);
//     }
//   };




//   /* ================= UI (UNCHANGED STRUCTURE) ================= */
//   return (
//     <div className="admin-wrapper">
//       <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
//         Admin Dashboard
//       </h2>

//       {/* FILTER BAR */}
//       <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
//         <input placeholder="Search name/email" value={search} onChange={(e) => setSearch(e.target.value)} />
//         <input placeholder="Event" value={event} onChange={(e) => setEvent(e.target.value)} />
//         <input placeholder="College" value={college} onChange={(e) => setCollege(e.target.value)} />
//         <input placeholder="UTR" value={utr} onChange={(e) => setutr(e.target.value)}></input>
//         <button className="btnexcel" onClick={exportExcel}>Export Excel</button>
//       </div>

//       {/* SUMMARY */}
//       <div style={{ maxWidth: "1200px", margin: "0 auto 1.5rem", padding: "1rem", background: "rgba(0,0,0,0.4)", borderRadius: "10px", textAlign: "center" }}>
//         <b>Total Registrations:</b> {total}
//       </div>
//       <button
//         className="btn"
//         style={{ marginBottom: "1.5rem" }}
//         onClick={() => {
//           setShowEventCounts(prev => !prev);
//           setExpandedEvent(null);
//         }}
//       >
//         {showEventCounts
//           ? "Hide Event-wise Count"
//           : "View Event-wise Registration Count"}
//       </button>

//       {showEventCounts && (
//         <div className="event-count-wrapper">

//           <h3 style={{ marginBottom: "0.8rem" }}>
//             Event-wise Registration Count
//           </h3>

//           <div className="event-count-grid">
//             {Object.entries(eventCounts).map(([eventName, count]) => (
//               <div key={eventName} className="event-count-block">

//                 {/* EVENT COUNT CARD */}
//                 <button
//                   className="event-count-card"
//                   onClick={() =>
//                     setExpandedEvent(prev =>
//                       prev === eventName ? null : eventName
//                     )
//                   }
//                 >
//                   <span className="event-name">{eventName}</span>
//                   <span className="event-number">{count}</span>
//                 </button>

//                 {/* EXPANDED PARTICIPANTS */}
//                 {expandedEvent === eventName && (
//                   <div className="event-expand">
//                     {getParticipantsByEvent(eventName).map(user => (
//                       <div key={user.id} className="event-expand-row">
//                         <span>{user.name}</span>
//                         <span>{user.college}</span>
//                         <span>₹{user.amount}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//               </div>
//             ))}
//           </div>
//         </div>
//       )}



//       {/* TABLE (UNCHANGED) */}
//       <div className="admin-table">
//         <div className="admin-row header admin-grid-row">
//           <div>Name</div>
//           <div>College</div>
//           <div>Event</div>
//           <div>Amount</div>
//           <div>UTR</div>
//           <div>Payment</div>
//           <div>Status</div>
//           <div>Action</div>
//         </div>

//         {data.map((row) => (
//           <div className="admin-row admin-grid-row" key={row.id}>
//             <div>{row.name}</div>
//             <div>{row.college}</div>
//             <div>{row.event}</div>
//             <div>₹{row.amount}</div>
//             <div>{row.utr}</div>

//             <div>
//               {row.payment_status === "VERIFIED" ? (
//                 <span className="status verified">✅ Verified</span>
//               ) : (
//                 <span className="status paid">⏳ Pending</span>
//               )}
//             </div>

//             <div>
//               {row.attendance_status === "VERIFIED" ? (
//                 <>
//                   <span style={{ color: "lightgreen" }}>🎟 Attended</span>
//                   <br />
//                   <button className="undo-btn" onClick={() => undoAttendance(row.id)}>
//                     Undo Attendance
//                   </button>
//                 </>
//               ) : row.payment_status === "VERIFIED" ? (
//                 <button className="verify-btn" onClick={() => verifyAttendance(row.id)}>
//                   Verify Attendance
//                 </button>
//               ) : (
//                 <span style={{ opacity: 0.5 }}>—</span>
//               )}
//             </div>

//             <div style={{ display: "flex", gap: "0.5rem" }}>
//               {row.payment_status === "PENDING_VERIFICATION" && (
//                 <button className="payverify-btn" onClick={() => verifyPayment(row.id)}>
//                   Verify Payment
//                 </button>
//               )}

//               {row.payment_status === "VERIFIED" && row.attendance_status !== "VERIFIED" && (
//                 <button className="undo-btn" onClick={() => undoPayment(row.id)}>
//                   Undo
//                 </button>
//               )}

//               <button
//                 className="verify-btn"
//                 onClick={() => {
//                   setActiveUserId(row.id);
//                   openAddEvent(row);
//                 }}
//               >
//                 + Add Event
//               </button>

//               <button className="delete-btn" onClick={() => deleteUser(row.id)}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ADD EVENT MODAL (UI SAME, LOGIC MULTI) */}
//       {showAddEvent && selectedUser && (
//         <div className="admin-modal">
//           <h3>Add Events for {selectedUser.name}</h3>

//           <div className="event-select-grid">
//             {eventsData.map((ev) => {
//               const selected = selectedEvents.find(
//                 (e) => e.id === ev.id
//               );

//               return (
//                 <div
//                   key={ev.id}
//                   className={`event-chip ${selected ? "selected" : ""}`}
//                   onClick={() => toggleEvent(ev)}
//                 >
//                   <div>{ev.title}</div>

//                   {/* 🔥 MODE RESTORED */}
//                   {selected && ev.modes.length > 1 && (
//                     <select
//                       value={selected.mode}
//                       onClick={(e) => e.stopPropagation()}
//                       onChange={(e) =>
//                         updateMode(
//                           ev.id,
//                           e.target.value,
//                           ev.fee?.[e.target.value]
//                         )
//                       }
//                     >
//                       {ev.modes.map((m) => (
//                         <option key={m} value={m}>
//                           {m} – ₹{ev.fee[m]}
//                         </option>
//                       ))}
//                     </select>
//                   )}

//                   {selected && ev.modes.length === 1 && (
//                     <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
//                       Mode: {ev.modes[0]} – ₹{ev.fee[ev.modes[0]]}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           <p style={{ marginTop: "1rem" }}>
//             Additional Amount: ₹{additionalAmount}
//           </p>

//           <button className="verify-btn" onClick={confirmAddEvent}>
//             Confirm Add Event
//           </button>

//           <button className="undo-btn" onClick={() => setShowAddEvent(false)}>
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;







import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { eventsData } from "../data/events";
import { API_BASE } from "../config/api";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [teamId, setTeamId] = useState("");
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
  const [activeTab, setActiveTab] = useState("registrations"); // "registrations" | "contacts"

  const [messageTemplate, setMessageTemplate] = useState(`Dear Participant,

We regret to inform you that SYNERIX 2026 has been postponed to the next semester due to unavoidable circumstances.

The revised dates and further details will be announced soon.

Thank you for your patience and continued support.

– Team SYNERIX`);


  /* ================= FETCH ================= */


  const fetchRegistrations = async () => {
    console.log("FETCHING WITH:", { search, teamId, event, college, utr });

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search.trim());
      if (teamId.trim()) params.append("teamId", teamId.trim());
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
  }, [search, teamId, event, college, utr]);

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

  /* ================= EXPORT ================= */
  const exportExcel = () => {
    // 1. Create a new Workbook
    const workbook = XLSX.utils.book_new();

    // 2. Extract Unique Events
    const allEventsSet = new Set();
    data.forEach((row) => {
      if (row.event) {
        // Split by comma and trim
        row.event.split(",").forEach((e) => allEventsSet.add(e.trim()));
      }
    });
    const uniqueEvents = Array.from(allEventsSet).sort();

    // 3. Create a Sheet for Each Event
    uniqueEvents.forEach((eventName) => {
      // Filter users who registered for this event
      const eventUsers = data.filter((row) =>
        row.event
          ?.split(",")
          .map((e) => e.trim())
          .includes(eventName)
      );

      const sheetData = [];
      const merges = [];
      let currentRow = 1; // Header is row 0

      eventUsers.forEach((user) => {
        const teamName = user.team_name || "N/A";

        // SOLO EXPORT: Always Single Row (Flat)
        sheetData.push({
          "Team Name": teamName,
          "Registration ID": user.id,
          "Name": user.name,
          "Email": user.email,
          "Phone": user.phone || "N/A",
          "College": user.college,
          "Department": user.dept || "N/A",
          "Year": user.year || "N/A",
          "Amount": user.amount,
          "Payment Status": user.payment_status,
        });
        currentRow++;
      });

      // Create Worksheet
      const worksheet = XLSX.utils.json_to_sheet(sheetData);

      // NO MERGES FOR SOLO EXPORT

      // Sanitize Sheet Name (Excel max 31 chars, no special chars)
      let sheetName = eventName.replace(/[\\/?*[\]]/g, "").substring(0, 31);

      // Ensure unique sheet names (conflict resolution)
      let uniqueSheetName = sheetName;
      let counter = 1;
      while (workbook.SheetNames.includes(uniqueSheetName)) {
        uniqueSheetName = `${sheetName.substring(0, 28)}(${counter})`;
        counter++;
      }

      // Append Sheet
      XLSX.utils.book_append_sheet(workbook, worksheet, uniqueSheetName);
    });

    // 4. Create "All Registrations" Sheet (Backup/Overview - Flat List)
    const allDataFlat = data.map(user => ({
      "Team Name": user.team_name || "N/A",
      "Registration ID": user.id,
      "Name": user.name,
      "Email": user.email,
      "Phone": user.phone,
      "College": user.college,
      "Department": user.dept,
      "Year": user.year,
      "Event": user.event,
      "Amount": user.amount,
      "Payment Status": user.payment_status,
    }));
    const allSheet = XLSX.utils.json_to_sheet(allDataFlat);
    XLSX.utils.book_append_sheet(workbook, allSheet, "All Registrations");

    // 5. Download
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "synerix_master_register.xlsx"
    );
  };

  const verifyPayment = async (id) => {
    // 1. Optimistic Update (Instant UI)
    const previousData = data.find(item => item.id == id);
    setData((prev) =>
      prev.map((item) =>
        item.id == id
          ? {
            ...item,
            payment_status: "VERIFIED",
            verified_at: new Date().toISOString(),
            verified_by: "ADMIN",
          }
          : item
      )
    );

    try {
      const res = await fetch(`${API_BASE}/api/admin/payment/verify/${id}`, {
        method: "PUT",
        headers: {
          "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET,
        },
      });
      const json = await res.json();
      console.log("PAYMENT VERIFY RESPONSE:", json);

      if (!json.success) {
        throw new Error(json.message || "Verification failed");
      }
    } catch (err) {
      console.error("VERIFY ERROR:", err);
      // 2. Revert if failed
      if (previousData) {
        setData((prev) =>
          prev.map((item) => (item.id == id ? previousData : item))
        );
      }
      alert("Verification Failed. Please check console.");
    }
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




  /* ================= TEAMS LOGIC ================= */
  const [teamsData, setTeamsData] = useState([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [teamEventFilter, setTeamEventFilter] = useState("");

  const fetchTeams = async () => {
    try {
      const params = new URLSearchParams();
      if (teamSearch.trim()) params.append("search", teamSearch.trim());
      if (teamEventFilter.trim()) params.append("event", teamEventFilter.trim());

      const res = await fetch(`${API_BASE}/api/admin/teams?${params.toString()}`, {
        headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
      });
      const json = await res.json();
      if (json.success) {
        setTeamsData(json.teams);
      }
    } catch (err) {
      console.error("FETCH TEAMS ERROR:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "teams") {
      fetchTeams();
    }
  }, [activeTab, teamSearch, teamEventFilter]);

  const exportTeamsExcel = () => {
    const workbook = XLSX.utils.book_new();

    // 1. Group by Event
    // Now 'teamsData' corresponds to creating a team for a specific event
    const teamsByEvent = {};

    teamsData.forEach(team => {
      const eventName = team.event; // Single event name
      if (!teamsByEvent[eventName]) teamsByEvent[eventName] = [];
      teamsByEvent[eventName].push(team);
    });

    // 2. Create Sheet per Event
    Object.entries(teamsByEvent).forEach(([eventName, teams]) => {
      const sheetData = [];
      const merges = [];
      let rowIndex = 1; // Header is 0

      // Header Row
      const headers = ["Team ID", "Team Name", "Role", "Name", "Email", "Phone", "College", "Dept"];
      sheetData.push(headers);

      teams.forEach(team => {
        // Collect all members (Leader + Joined Members)
        const allMembers = [
          {
            role: "Leader",
            name: team.name, // leader name flattened
            email: team.email,
            phone: team.phone,
            college: team.college,
            dept: team.dept
          },
          ...(team.members || []).map(m => ({
            role: "Member",
            name: m.name,
            email: "—",
            phone: "—",
            college: "—",
            dept: "—"
          }))
        ];

        const eventMeta = eventsData.find(e => e.title === eventName);
        const maxMembers = eventMeta ? (eventMeta.maxMembers || 1) : 1;

        // Ensure we fill up to maxMembers rows
        const rowsToGenerate = Math.max(maxMembers, allMembers.length);

        for (let i = 0; i < rowsToGenerate; i++) {
          const member = allMembers[i] || { role: "Empty", name: "", email: "", phone: "", college: "", dept: "" };

          sheetData.push([
            team.team_id,   // Team ID
            team.team_name, // Team Name
            member.role,
            member.name,
            member.email,
            member.phone,
            member.college,
            member.dept
          ]);
        }

        // Merge Team ID (Col 0) and Team Name (Col 1)
        if (rowsToGenerate > 1) {
          merges.push(
            { s: { r: rowIndex, c: 0 }, e: { r: rowIndex + rowsToGenerate - 1, c: 0 } },
            { s: { r: rowIndex, c: 1 }, e: { r: rowIndex + rowsToGenerate - 1, c: 1 } }
          );
        }

        rowIndex += rowsToGenerate;
      });

      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      ws["!merges"] = merges;

      // Layout: Columns Width
      ws["!cols"] = [
        { wch: 20 }, // Team ID
        { wch: 25 }, // Team Name
        { wch: 10 }, // Role
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 20 }, // College
        { wch: 10 }  // Dept
      ];

      // Add sheet
      const safeName = eventName.replace(/[\\/?*[\]]/g, "").substring(0, 31);
      // Handle duplicates just in case
      let uniqueSheetName = safeName;
      let counter = 1;
      while (workbook.SheetNames.includes(uniqueSheetName)) {
        uniqueSheetName = `${safeName.substring(0, 28)}(${counter})`;
        counter++;
      }

      XLSX.utils.book_append_sheet(workbook, ws, uniqueSheetName);
    });

    saveAs(new Blob([XLSX.write(workbook, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" }), "synerix_teams.xlsx");
  };

  const deleteTeam = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team? This will remove all joined members.")) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/team/${teamId}`, {
        method: "DELETE",
        headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET },
      });
      const json = await res.json();
      if (json.success) {
        setTeamsData(prev => prev.filter(t => t.team_id !== teamId));
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error("DELETE TEAM ERROR:", err);
    }
  };

  /* ================= UI (UNCHANGED STRUCTURE) ================= */
  return (
    <div className="admin-wrapper">
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Admin Dashboard
      </h2>

      {/* TABS */}
      <div className="admin-tabs" style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button
          className={`btn ${activeTab === "registrations" ? "" : "outline"}`}
          style={{ opacity: activeTab === "registrations" ? 1 : 0.6 }}
          onClick={() => setActiveTab("registrations")}
        >
          📝 Registrations
        </button>
        <button
          className={`btn ${activeTab === "teams" ? "" : "outline"}`}
          style={{ opacity: activeTab === "teams" ? 1 : 0.6 }}
          onClick={() => setActiveTab("teams")}
        >
          👥 Teams
        </button>
        <button
          className={`btn ${activeTab === "contacts" ? "" : "outline"}`}
          style={{ opacity: activeTab === "contacts" ? 1 : 0.6 }}
          onClick={() => setActiveTab("contacts")}
        >
          📞 Contact Details
        </button>
        <button
          className={`btn ${activeTab === "notifications" ? "" : "outline"}`}
          style={{ opacity: activeTab === "notifications" ? 1 : 0.6 }}
          onClick={() => setActiveTab("notifications")}
        >
          📢 Notifications
        </button>
      </div>

      {/* FILTER BAR - REGISTRATIONS */}
      {activeTab === "registrations" && (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <input placeholder="Search name/email" value={search} onChange={(e) => setSearch(e.target.value)} />
          <input placeholder="team id" value={teamId} onChange={(e) => setTeamId(e.target.value)}></input>
          <input placeholder="Event" value={event} onChange={(e) => setEvent(e.target.value)} />
          <input placeholder="College" value={college} onChange={(e) => setCollege(e.target.value)} />
          <input placeholder="UTR" value={utr} onChange={(e) => setutr(e.target.value)}></input>
          <button className="btnexcel" onClick={exportExcel}>Export Excel</button>
        </div>
      )}

      {/* FILTER BAR - TEAMS */}
      {activeTab === "teams" && (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <input
            placeholder="Search Team ID, Name, Leader..."
            value={teamSearch}
            onChange={(e) => setTeamSearch(e.target.value)}
            style={{ minWidth: "250px" }}
          />
          <input
            placeholder="Filter by Event"
            value={teamEventFilter}
            onChange={(e) => setTeamEventFilter(e.target.value)}
          />
          <button className="btnexcel" onClick={exportTeamsExcel}>Export Teams Excel</button>
        </div>
      )}

      {/* SUMMARY */}
      {activeTab === "registrations" && (
        <>
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
        </>
      )}

      {showEventCounts && activeTab === "registrations" && (
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



      {/* TABLE CONTENT */}
      {activeTab === "registrations" && (
        // ================= REGISTRATIONS TABLE =================
        <div className="admin-table">
          <div className="admin-row header admin-grid-row">
            <div>Name</div>
            <div>College</div>
            <div>Team ID</div>
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
              <div style={{ color: row.team_id ? "#00ff88" : "inherit" }}>{row.team_id || "-"}</div>
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
      )}

      {activeTab === "teams" && (
        // ================= TEAMS TABLE =================
        <div className="admin-table">
          <div className="admin-row header" style={{ gridTemplateColumns: "1fr 1fr 1.5fr 2fr 0.5fr" }}>
            <div>Team ID</div>
            <div>Team Name</div>
            <div>Event</div>
            <div>Members</div>
            <div>Action</div>
          </div>

          {teamsData.map((team) => (
            <div className="admin-row" key={team.team_id} style={{ gridTemplateColumns: "1fr 1fr 1.5fr 2fr 0.5fr", alignItems: "start" }}>
              <div style={{ color: "#00ff88", fontWeight: "bold" }}>{team.team_id}</div>
              <div>{team.team_name}</div>
              <div>{team.event}</div>
              <div>
                <div style={{ fontWeight: "bold", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.2rem", marginBottom: "0.2rem" }}>
                  👑 {team.name}
                </div>
                {(team.members || []).map(m => (
                  <div key={m.id} style={{ fontSize: "0.9rem", color: "#ccc" }}>
                    👤 {m.name}
                  </div>
                ))}
              </div>
              <div>
                <button className="delete-btn" onClick={() => deleteTeam(team.team_id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "contacts" && (
        // ================= CONTACT DETAILS TABLE =================
        <div className="admin-table">
          <div className="admin-row header" style={{ gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr 0.5fr 1.5fr" }}>
            <div>Name</div>
            <div>Phone</div>
            <div>Email</div>
            <div>Department</div>
            <div>Year</div>
            <div>College</div>
          </div>

          {data.map((row) => (
            <div className="admin-row" key={row.id} style={{ gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr 0.5fr 1.5fr", alignItems: "center" }}>
              <div style={{ fontWeight: "bold", color: "#fff" }}>{row.name}</div>
              <div style={{ fontFamily: "monospace", color: "#00ff88" }}>{row.phone || "—"}</div>
              <div style={{ fontSize: "0.9rem", color: "#aaa" }}>
                <a href={`mailto:${row.email}`} style={{ color: "inherit", textDecoration: "none" }}>{row.email}</a>
              </div>
              <div>{row.dept || "—"}</div>
              <div>{row.year || "—"}</div>
              <div style={{ fontSize: "0.9rem" }}>{row.college}</div>
            </div>
          ))}
        </div>
      )}


      {activeTab === "notifications" && (
        <div className="admin-table" style={{ background: "rgba(0,0,0,0.3)", padding: "2rem" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#00ff88" }}>
            📢 WhatsApp Postponement Notification
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {/* LEFT: TEMPLATE & ACTIONS */}
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "10px" }}>
              <h3 style={{ marginBottom: "1rem" }}>1. Message Template</h3>
              <textarea
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                style={{
                  background: "#000",
                  padding: "1rem",
                  borderRadius: "5px",
                  border: "1px solid #333",
                  color: "#e0e0e0",
                  fontSize: "0.9rem",
                  width: "100%",
                  minHeight: "200px",
                  marginBottom: "1.5rem",
                  fontFamily: "inherit"
                }}
              />

              <h3>2. Bulk Actions</h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "1rem" }}>
                Copy all numbers and paste them into a WhatsApp Broadcast List or Group.
              </p>
              <button
                className="verify-btn"
                style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
                onClick={async () => {
                  try {
                    const res = await fetch(`${API_BASE}/api/admin/phone-numbers`, {
                      headers: { "x-admin-secret": import.meta.env.VITE_ADMIN_SECRET }
                    });
                    const json = await res.json();
                    if (json.success) {
                      const numbers = json.participants.map(p => p.phone).join(",");
                      await navigator.clipboard.writeText(numbers);
                      alert(`Copied ${json.participants.length} numbers to clipboard!`);
                    } else {
                      alert("Failed to fetch numbers");
                    }
                  } catch (e) {
                    console.error(e);
                    alert("Error fetching numbers");
                  }
                }}
              >
                📋 Copy All Phone Numbers
              </button>

              <div style={{ marginTop: "1.5rem", borderTop: "1px solid #333", paddingTop: "1.5rem" }}>
                <h4 style={{ marginBottom: "0.5rem", color: "#ff4d4f" }}>⚠️ Experimental: Batch Send</h4>
                <p style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "1rem" }}>
                  This will open a new WhatsApp Web tab for EACH user one by one (every 3 seconds).
                  <b>Allow pop-ups</b> for this site.
                </p>
                <button
                  className="btn"
                  style={{ width: "100%", padding: "1rem", background: "#ff4d4f", border: "none" }}
                  onClick={async () => {
                    if (!window.confirm("This will open many tabs. Are you sure?")) return;

                    // Get all valid users
                    const validUsers = data.filter(u => {
                      let p = u.phone?.replace(/\D/g, "") || "";
                      return p.length >= 10;
                    });

                    alert(`Starting batch send for ${validUsers.length} users. Do not close this window.`);

                    let index = 0;
                    const interval = setInterval(() => {
                      if (index >= validUsers.length) {
                        clearInterval(interval);
                        alert("Batch send complete!");
                        return;
                      }

                      const user = validUsers[index];
                      let phone = user.phone.replace(/\D/g, "");
                      if (phone.length === 10) phone = "91" + phone;
                      else if (phone.length > 10 && phone.startsWith("0")) phone = "91" + phone.substring(1);

                      // Respect 12 digit format if exists
                      if (phone.length === 12 && phone.startsWith("91")) { }
                      else if (phone.length === 10) phone = "91" + phone;

                      let finalMsg = messageTemplate.replace("Dear Participant", `Dear ${user.name}`);
                      const encodedMsg = encodeURIComponent(finalMsg);

                      window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');

                      index++;
                    }, 3000); // 3 seconds delay to prevent browser crash/block
                  }}
                >
                  🚀 Send to All ({data.length})
                </button>
              </div>
            </div>

            {/* RIGHT: INDIVIDUAL */}
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "10px", maxHeight: "600px", overflowY: "auto" }}>
              <h3 style={{ marginBottom: "1rem" }}>3. Individual Send (Backup)</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "1rem" }}>
                Click to open WhatsApp Web with the customized message above.
              </p>

              {data.map(user => {
                let phone = user.phone ? user.phone.replace(/\D/g, "") : "";
                if (phone.length === 10) phone = "91" + phone;
                if (!phone || phone.length < 10) return null;

                // Personalized message: replace "Participant" with Name if present in template, 
                // or just prepend Dear Name if the template seems generic.
                // For simplicity, let's just use the template as is, 
                // but maybe replace "Participant" with the user's name if found?
                // Let's keep it simple: Use the template directly, but allow {{name}} placeholder?
                // User didn't ask for placeholders, but it's good UX.
                // Let's simple check: if "Dear Participant" exists, change to "Dear [Name]"

                let finalMsg = messageTemplate.replace("Dear Participant", `Dear ${user.name}`);

                const encodedMsg = encodeURIComponent(finalMsg);

                return (
                  <div key={user.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.8rem",
                    borderBottom: "1px solid rgba(255,255,255,0.1)"
                  }}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{user.name}</div>
                      <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>{phone}</div>
                    </div>
                    <a
                      href={`https://wa.me/${phone}?text=${encodedMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn outline"
                      style={{
                        padding: "0.4rem 1rem",
                        fontSize: "0.8rem",
                        borderColor: "#00ff88",
                        color: "#00ff88",
                        textDecoration: "none"
                      }}
                    >
                      Send ↗
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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

