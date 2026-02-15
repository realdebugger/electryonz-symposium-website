// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { eventsData } from "../data/events";
// import PageWrapper from "../components/pageWrapper";
// import axios from "axios";
// import { API_BASE } from "../config/api";


// const Register = () => {
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const [emailError, setEmailError] = useState("");

//   const emailRef = useRef(null);


//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const paymentData = location.state || {};




//   /* ---------------- STATE ---------------- */
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     college: "",
//     dept: "",
//     year: "",
//     selectedEvents: [],
//     event: paymentData.eventName || "",
//     amount: paymentData.amount || "",
//     utr: paymentData.utr || "",
//   });

//   const [totalAmount, setTotalAmount] = useState(0);

//   /* ---------------- RESTORE FORM DRAFT ---------------- */
//   useEffect(() => {
//     const savedForm = sessionStorage.getItem("synerix_form_draft");
//     if (savedForm) {
//       setFormData(JSON.parse(savedForm));
//     }
//   }, []);

//   const filteredEvents = eventsData.filter((event) => {
//     const matchesSearch = event.title
//       .toLowerCase()
//       .includes(search.toLowerCase());

//     const matchesCategory =
//       filter === "All" || event.category === filter;

//     // Only show events that have registration modes defined
//     const hasRegistration = event.modes && event.modes.length > 0;

//     return matchesSearch && matchesCategory && hasRegistration;
//   });


//   /* ---------------- INPUT HANDLER ---------------- */
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "phone") {
//       let cleaned = value.replace(/\D/g, "");
//       if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
//       cleaned = cleaned.slice(0, 10);
//       setFormData((prev) => ({ ...prev, phone: cleaned }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };


//   /* ---------------- EVENT SELECT / DESELECT ---------------- */
//   const toggleEvent = (event) => {
//     setFormData((prev) => {
//       const exists = prev.selectedEvents.find(
//         (e) => e.eventId === event.id
//       );

//       let updatedEvents;
//       if (exists) {
//         updatedEvents = prev.selectedEvents.filter(
//           (e) => e.eventId !== event.id
//         );
//       } else {
//         updatedEvents = [
//           ...prev.selectedEvents,
//           { eventId: event.id, mode: event.modes[0] },
//         ];
//       }

//       return { ...prev, selectedEvents: updatedEvents };
//     });
//   };


//   /* ---------------- MODE CHANGE ---------------- */
//   const changeMode = (eventId, mode) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedEvents: prev.selectedEvents.map((e) =>
//         e.eventId === eventId ? { ...e, mode } : e
//       ),
//     }));
//   };

//   /* ---------------- TOTAL CALCULATION ---------------- */
//   useEffect(() => {
//     let total = 0;
//     const isEarlyBird = new Date() < new Date("2026-02-22");

//     for (const sel of formData.selectedEvents) {
//       const event = eventsData.find((e) => e.id === sel.eventId);
//       if (!event) continue;

//       let price = event.fee?.[sel.mode];

//       // Special Early Bird Logic
//       if (isEarlyBird && (event.id === "paper-presentation" || event.id === "project-expo")) {
//         price = 300;
//         console.log(`Applying Early Bird to ${event.title}: ₹300`);
//       }

//       if (typeof price === "number") total += price;
//     }

//     if (emailError && emailRef.current) {
//       emailRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//       emailRef.current.focus();
//     }
//     setTotalAmount(total);
//   }, [formData.selectedEvents, emailError]);

//   const isFormValid =
//     formData.name.trim() &&
//     formData.email.trim() &&
//     formData.phone.length === 10 &&
//     formData.college.trim() &&
//     formData.dept.trim() &&
//     formData.selectedEvents.length > 0;

//   /* ---------------- PAY & REGISTER ---------------- */
//   const handlePayAndRegister = async () => {
//     if (!isFormValid || totalAmount <= 0) {
//       alert("Please complete the form and select events");
//       return;
//     }

//     try {
//       await axios.post(`${API_BASE}/api/check-email`, {
//         email: formData.email,
//       });

//       // save draft
//       sessionStorage.setItem(
//         "synerix_form_draft",
//         JSON.stringify(formData)
//       );
//       const selectedEventNames = formData.selectedEvents
//         .map((sel) => {
//           const event = eventsData.find((e) => e.id === sel.eventId);
//           return event?.title;
//         })
//         .filter(Boolean)
//         .join(", ");


//       navigate("/payment", {
//         state: {
//           amount: totalAmount,
//           event: selectedEventNames,
//         },
//       });

//     } catch (err) {
//       if (err.response) {
//         const { status, message } = err.response.data;

//         // EMAIL EXISTS
//         if (err.response.status === 409) {
//           setEmailError(message);
//           return;
//         }

//         // MISSING FIELDS / BAD REQUEST
//         if (err.response.status === 400) {
//           alert(message);
//           return;
//         }

//         // ANY OTHER BACKEND ERROR
//         alert(message || "Server error");
//       } else {
//         alert("Network error. Please try again.");
//       }
//     }

//   };



//   /* ---------------- STYLES ---------------- */
//   const inputStyle = {
//     width: "100%",
//     padding: "1rem",
//     background: "rgba(255,255,255,0.05)",
//     border: "1px solid var(--color-border)",
//     color: "#fff",
//     marginBottom: "1rem",
//     fontFamily: "var(--font-tech)",
//     fontSize: "1.1rem",
//     letterSpacing: "1px",
//   };

//   const technicalEvents = filteredEvents.filter(
//     e => e.category === "Technical"
//   );

//   const nonTechnicalEvents = filteredEvents.filter(
//     e => e.category === "Non-Technical"
//   );

//   const workshopEvents = filteredEvents.filter(
//     e => e.category === "Workshop"
//   );


//   const renderEventCard = (event) => {
//     const selected = formData.selectedEvents.find(
//       (e) => e.eventId === event.id
//     );

//     return (
//       <div
//         key={event.id}
//         onClick={() => toggleEvent(event)}
//         style={{
//           padding: "1rem",
//           cursor: "pointer",
//           border: selected
//             ? "2px solid var(--color-secondary)"
//             : "1px solid var(--color-border)",
//           background: selected
//             ? "rgba(0,240,255,0.08)"
//             : "rgba(255,255,255,0.03)",
//         }}
//       >
//         <h4>{event.title}</h4>
//         <p style={{ fontSize: "0.85rem", opacity: 0.75 }}>
//           Fee:&nbsp;
//           {event.modes.length === 1 ? (
//             (() => {
//               const isEarlyBird = new Date() < new Date("2026-02-22") && (event.id === "paper-presentation" || event.id === "project-expo");
//               const price = event.fee?.[event.modes[0]] ?? 0;
//               return isEarlyBird ? (
//                 <b style={{ color: "var(--color-primary)" }}>₹300 (Early Bird)</b>
//               ) : (
//                 <b>₹{price}</b>
//               );
//             })()
//           ) : (
//             event.modes.map((mode, i) => {
//               const isEarlyBird = new Date() < new Date("2026-02-22") && (event.id === "paper-presentation" || event.id === "project-expo");
//               const price = event.fee?.[mode] ?? 0;
//               return (
//                 <span key={mode}>
//                   {mode}: {isEarlyBird ? (
//                     <b style={{ color: "var(--color-primary)" }}>₹300</b>
//                   ) : (
//                     `₹${price}`
//                   )}
//                   {i < event.modes.length - 1 && " | "}
//                 </span>
//               );
//             })
//           )}
//         </p>

//         {selected && event.modes.length > 1 && (
//           <select
//             value={selected.mode}
//             onClick={(e) => e.stopPropagation()}
//             onChange={(e) =>
//               changeMode(event.id, e.target.value)
//             }
//             style={{ ...inputStyle, marginTop: "0.5rem" }}
//           >
//             {event.modes.map((mode) => {
//               const isEarlyBird = new Date() < new Date("2026-02-22") && (event.id === "paper-presentation" || event.id === "project-expo");
//               const displayPrice = isEarlyBird ? 300 : event.fee[mode];
//               return (
//                 <option key={mode} value={mode} style={{ color: "black" }}>
//                   {mode} – ₹{displayPrice}
//                 </option>
//               );
//             })}
//           </select>
//         )}
//       </div>
//     );
//   };



//   const handlePayAndRegister = async () => {
//     if (!isFormValid) {
//       alert("Please complete the form and select events");
//       return;
//     }
//     if (loading) return; // Prevent double submission if button somehow stays enabled

//     setLoading(true);

//     try {
//       await axios.post(${ API_BASE } / api / check - email, {
//         email: formData.email,
//       });

//       // save draft
//       sessionStorage.setItem(
//         "synerix_form_draft",
//         JSON.stringify(formData)
//       );
//       const selectedEventNames = formData.selectedEvents
//         .map((sel) => {
//           const event = eventsData.find((e) => e.id === sel.eventId);
//           return event?.title;
//         })
//         .filter(Boolean)
//         .join(", ");


//       const eventsDetail = formData.selectedEvents.map((sel) => {
//         const event = eventsData.find((e) => e.id === sel.eventId);
//         return {
//           title: event?.title,
//           mode: sel.mode
//         };
//       });


//       /* ---------------- UI ---------------- */
//       return (
//         <PageWrapper>
//           <div className="container section">
//             <h1 className="Registertitle">
//               Register
//             </h1>

//             <div className="Formcontainer">
//               <form onSubmit={(e) => e.preventDefault()}>
//                 {/* BASIC DETAILS */}
//                 <input
//                   name="name"
//                   placeholder="Full Name"
//                   required
//                   style={inputStyle}
//                   value={formData.name}
//                   onChange={handleChange}
//                 />

//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
//                   <input
//                     ref={emailRef}
//                     name="email"
//                     type="email"
//                     placeholder="Email"
//                     required
//                     style={{
//                       ...inputStyle,
//                       border: emailError ? "1px solid #ff4d4f" : inputStyle.border,
//                     }}
//                     value={formData.email}
//                     onChange={(e) => {
//                       handleChange(e);
//                       setEmailError("");
//                     }}
//                   />

//                   {emailError && (
//                     <small style={{ color: "#ff4d4f", marginTop: "4px", display: "block" }}>
//                       {emailError}
//                     </small>
//                   )}


//                   <input
//                     name="phone"
//                     placeholder="10-digit number"
//                     required
//                     style={inputStyle}
//                     value={formData.phone}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <input
//                   name="college"
//                   placeholder="College Name"
//                   required
//                   style={inputStyle}
//                   value={formData.college}
//                   onChange={handleChange}
//                 />

//                 <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
//                   <input
//                     name="dept"
//                     placeholder="Department"
//                     required
//                     style={inputStyle}
//                     value={formData.dept}
//                     onChange={handleChange}
//                   />

//                   <select
//                     name="year"
//                     style={inputStyle}
//                     value={formData.year}
//                     onChange={handleChange}
//                   >
//                     <option value="" style={{ color: "black" }}>Year</option>
//                     <option value="1" style={{ color: "black" }}>I</option>
//                     <option value="2" style={{ color: "black" }}>II</option>
//                     <option value="3" style={{ color: "black" }}>III</option>
//                     <option value="4" style={{ color: "black" }}>IV</option>
//                   </select>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search events..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "0.8rem",
//                     marginBottom: "1rem",
//                     background: "rgba(255,255,255,0.05)",
//                     border: "1px solid var(--color-border)",
//                     color: "#fff",
//                   }}
//                 />

//                 <div className="event-tabs-wrapper">
//                   <div style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     gap: "1rem",
//                     marginBottom: "1.5rem",
//                     flexWrap: "wrap"
//                   }}>
//                     {["All", "Technical", "Non-Technical", "Workshop"].map(cat => (
//                       <button
//                         type="button"
//                         key={cat}
//                         onClick={() => setFilter(cat)}
//                         style={{
//                           padding: "0.6rem 1.5rem",
//                           background: filter === cat
//                             ? "var(--color-primary)"
//                             : "transparent",
//                           border: "1px solid var(--color-primary)",
//                           color: filter === cat ? "#000" : "var(--color-primary)",
//                           cursor: "pointer",
//                           fontWeight: "bold",
//                           transition: "all 0.3s"
//                         }}
//                       >
//                         {cat}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* EVENTS */}
//                 <h3 style={{ margin: "1.5rem 0" }}>Select Events</h3>

//                 {/* TECHNICAL */}
//                 {technicalEvents.length > 0 && (
//                   <>
//                     <h3 className="register-category-title">Technical Events</h3>
//                     <div className="Registercards">
//                       {technicalEvents.map(event => renderEventCard(event))}

//                     </div>
//                   </>
//                 )}


//                 {nonTechnicalEvents.length > 0 && (
//                   <>
//                     <h3 className="register-category-title">Non-Technical Events</h3>

//                     <div className="Registercardsnon">
//                       {nonTechnicalEvents.map(event => renderEventCard(event))}</div>
//                   </>
//                 )}


//                 {workshopEvents.length > 0 && (
//                   <>
//                     <h3 className="register-category-title">Workshops</h3>
//                     <div className="Registercards">
//                       {workshopEvents.map(event => renderEventCard(event))}
//                     </div>
//                   </>
//                 )}


//                 {/* PAY & REGISTER */}
//                 <p style={{
//                   padding: "2rem"
//                 }}>
//                   ℹ️ Want to participate in more events later?
//                   You can add events by contacting the event coordinators.

//                 </p>

//                 <div style={{ marginTop: "2rem", textAlign: "center" }}>
//                   <h3>Total Amount: ₹{totalAmount}</h3>

//                   <button
//                     type="button"
//                     className="btn"
//                     onClick={handlePayAndRegister}
//                     disabled={!isFormValid || totalAmount === 0}
//                     style={{
//                       width: "100%",
//                       opacity: isFormValid ? 1 : 0.5,
//                     }}
//                   >
//                     Pay & Register ₹{totalAmount}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </PageWrapper>
//       );
//     };

//     export default Register;







import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { eventsData } from "../data/events";
import PageWrapper from "../components/pageWrapper";
import axios from "axios";
import { API_BASE } from "../config/api";


const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [emailError, setEmailError] = useState("");

  const emailRef = useRef(null);


  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state || {};




  /* ---------------- STATE ---------------- */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    dept: "",
    year: "",
    selectedEvents: [],
    event: paymentData.eventName || "",
    amount: paymentData.amount || "",
    utr: paymentData.utr || "",
  });

  const [totalAmount, setTotalAmount] = useState(0);

  /* ---------------- RESTORE FORM DRAFT ---------------- */
  useEffect(() => {
    const savedForm = sessionStorage.getItem("synerix_form_draft");
    if (savedForm) {
      setFormData(JSON.parse(savedForm));
    }
  }, []);

  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filter === "All" || event.category === filter;

    // Only show events that have registration modes defined
    const hasRegistration = event.modes && event.modes.length > 0;

    return matchesSearch && matchesCategory && hasRegistration;
  });


  /* ---------------- INPUT HANDLER ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      let cleaned = value.replace(/\D/g, "");
      if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
      cleaned = cleaned.slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: cleaned }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  /* ---------------- EVENT SELECT / DESELECT ---------------- */
  const toggleEvent = (event) => {
    setFormData((prev) => {
      const exists = prev.selectedEvents.find(
        (e) => e.eventId === event.id
      );

      let updatedEvents;
      if (exists) {
        updatedEvents = prev.selectedEvents.filter(
          (e) => e.eventId !== event.id
        );
      } else {
        updatedEvents = [
          ...prev.selectedEvents,
          { eventId: event.id, mode: event.modes[0] },
        ];
      }

      return { ...prev, selectedEvents: updatedEvents };
    });
  };


  /* ---------------- MODE CHANGE ---------------- */
  const changeMode = (eventId, mode) => {
    setFormData((prev) => ({
      ...prev,
      selectedEvents: prev.selectedEvents.map((e) =>
        e.eventId === eventId ? { ...e, mode } : e
      ),
    }));
  };

  /* ---------------- TOTAL CALCULATION ---------------- */
  useEffect(() => {
    let total = 0;
    const isEarlyBird = new Date() < new Date("2026-02-22");

    for (const sel of formData.selectedEvents) {
      const event = eventsData.find((e) => e.id === sel.eventId);
      if (!event) continue;

      let price = event.fee?.[sel.mode];

      // Special Early Bird Logic
      if (isEarlyBird && (event.id === "paper-presentation" || event.id === "project-expo")) {
        price = 300;
        console.log(`Applying Early Bird to ${event.title}: ₹300`);
      }

      if (typeof price === "number") total += price;
    }

    if (emailError && emailRef.current) {
      emailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      emailRef.current.focus();
    }
    setTotalAmount(total);
  }, [formData.selectedEvents, emailError]);

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.phone.length === 10 &&
    formData.college.trim() &&
    formData.dept.trim() &&
    formData.selectedEvents.length > 0;

  /* ---------------- PAY & REGISTER ---------------- */
  const handlePayAndRegister = async () => {
    if (!isFormValid) {
      alert("Please complete the form and select events");
      return;
    }
    if (loading) return; // Prevent double submission if button somehow stays enabled

    setLoading(true);

    try {
      await axios.post(`${API_BASE}/api/check-email`, {
        email: formData.email,
      });

      // save draft
      sessionStorage.setItem(
        "synerix_form_draft",
        JSON.stringify(formData)
      );
      const selectedEventNames = formData.selectedEvents
        .map((sel) => {
          const event = eventsData.find((e) => e.id === sel.eventId);
          return event?.title;
        })
        .filter(Boolean)
        .join(", ");


      const eventsDetail = formData.selectedEvents.map((sel) => {
        const event = eventsData.find((e) => e.id === sel.eventId);
        return {
          title: event?.title,
          mode: sel.mode
        };
      });




      // ---------------- IF PAID ---------------- //
      navigate("/payment", {
        state: {
          amount: totalAmount,
          event: selectedEventNames,
          eventsDetail,
          formData // Pass full form data to easy restore or use
        },
      });

    } catch (err) {
      if (err.response) {
        const { status, message } = err.response.data;

        // EMAIL EXISTS
        if (err.response.status === 409) {
          setEmailError(message);
          setLoading(false);
          return;
        }

        // MISSING FIELDS / BAD REQUEST
        if (err.response.status === 400) {
          alert(message);
          setLoading(false);
          return;
        }

        // ANY OTHER BACKEND ERROR
        alert(message || "Server error");
      } else {
        alert("Network error. Please try again.");
      }
    } finally {
      if (emailError) setLoading(false);
      setLoading(false);
    }
  };

  /* ---------------- STYLES ---------------- */
  const inputStyle = {
    width: "100%",
    padding: "1rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--color-border)",
    color: "#fff",
    marginBottom: "1rem",
    fontFamily: "var(--font-tech)",
    fontSize: "1.1rem",
    letterSpacing: "1px",
  };

  const technicalEvents = filteredEvents.filter(
    e => e.category === "Technical"
  );

  const nonTechnicalEvents = filteredEvents.filter(
    e => e.category === "Non-Technical"
  );

  const workshopEvents = filteredEvents.filter(
    e => e.category === "Workshop"
  );



  const renderEventCard = (event) => {
    const selected = formData.selectedEvents.find(
      (e) => e.eventId === event.id
    );

    return (
      <div
        key={event.id}
        onClick={() => toggleEvent(event)}
        style={{
          padding: "1rem",
          cursor: "pointer",
          border: selected
            ? "2px solid var(--color-secondary)"
            : "1px solid var(--color-border)",
          background: selected
            ? "rgba(0,240,255,0.08)"
            : "rgba(255,255,255,0.03)",
        }}
      >
        <h4>{event.title}</h4>
        <p style={{ fontSize: "0.85rem", opacity: 0.75 }}>
          Fee:&nbsp;
          {event.modes.length === 1 ? (
            (() => {
              const isEarlyBird = new Date() < new Date("2026-02-22") && (event.id === "paper-presentation" || event.id === "project-expo");
              const price = event.fee?.[event.modes[0]] ?? 0;
              return isEarlyBird ? (
                <b style={{ color: "var(--color-primary)" }}>₹300 (Early Bird)</b>
              ) : (
                <b>₹{price}</b>
              );
            })()
          ) : (
            event.modes.map((mode, i) => {
              const isEarlyBird = new Date() < new Date("2026-02-22") && (event.id === "paper-presentation" || event.id === "project-expo");
              const price = event.fee?.[mode] ?? 0;
              return (
                <span key={mode}>
                  {mode}: {isEarlyBird ? (
                    <b style={{ color: "var(--color-primary)" }}>₹300</b>
                  ) : (
                    `₹${price}`
                  )}
                  {i < event.modes.length - 1 && " | "}
                </span>
              );
            })
          )}
        </p>

        {selected && event.modes.length > 1 && (
          <select
            value={selected.mode}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              changeMode(event.id, e.target.value)
            }
            style={{ ...inputStyle, marginTop: "0.5rem" }}
          >
            {event.modes.map((mode) => {
              const isEarlyBird = new Date() < new Date("2026-02-22") && (event.id === "paper-presentation" || event.id === "project-expo");
              const displayPrice = isEarlyBird ? 300 : event.fee[mode];
              return (
                <option key={mode} value={mode} style={{ color: "black" }}>
                  {mode} – ₹{displayPrice}
                </option>
              );
            })}
          </select>
        )}
      </div>
    );
  };


  /* ---------------- UI ---------------- */
  return (
    <PageWrapper>
      <div className="container section">
        <h1 className="Registertitle">
          Register
        </h1>

        <div className="Formcontainer">
          <form onSubmit={(e) => e.preventDefault()}>
            {/* BASIC DETAILS */}
            <input
              name="name"
              placeholder="Full Name"
              required
              style={inputStyle}
              value={formData.name}
              onChange={handleChange}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input
                ref={emailRef}
                name="email"
                type="email"
                placeholder="Email"
                required
                style={{
                  ...inputStyle,
                  border: emailError ? "1px solid #ff4d4f" : inputStyle.border,
                }}
                value={formData.email}
                onChange={(e) => {
                  handleChange(e);
                  setEmailError("");
                }}
              />

              {emailError && (
                <small style={{ color: "#ff4d4f", marginTop: "4px", display: "block" }}>
                  {emailError}
                </small>
              )}


              <input
                name="phone"
                placeholder="10-digit number"
                required
                style={inputStyle}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <input
              name="college"
              placeholder="College Name"
              required
              style={inputStyle}
              value={formData.college}
              onChange={handleChange}
            />

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
              <input
                name="dept"
                placeholder="Department"
                required
                style={inputStyle}
                value={formData.dept}
                onChange={handleChange}
              />

              <select
                name="year"
                style={inputStyle}
                value={formData.year}
                onChange={handleChange}
              >
                <option value="" style={{ color: "black" }}>Year</option>
                <option value="1" style={{ color: "black" }}>I</option>
                <option value="2" style={{ color: "black" }}>II</option>
                <option value="3" style={{ color: "black" }}>III</option>
                <option value="4" style={{ color: "black" }}>IV</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.8rem",
                marginBottom: "1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--color-border)",
                color: "#fff",
              }}
            />

            <div className="event-tabs-wrapper">
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap"
              }}>
                {["All", "Technical", "Non-Technical", "Workshop"].map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setFilter(cat)}
                    style={{
                      padding: "0.6rem 1.5rem",
                      background: filter === cat
                        ? "var(--color-primary)"
                        : "transparent",
                      border: "1px solid var(--color-primary)",
                      color: filter === cat ? "#000" : "var(--color-primary)",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "all 0.3s"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* EVENTS */}
            <h3 style={{ margin: "1.5rem 0" }}>Select Events</h3>

            {/* TECHNICAL */}
            {technicalEvents.length > 0 && (
              <>
                <h3 className="register-category-title">Technical Events</h3>
                <div className="Registercards">
                  {technicalEvents.map(event => renderEventCard(event))}

                </div>
              </>
            )}


            {nonTechnicalEvents.length > 0 && (
              <>
                <h3 className="register-category-title">Non-Technical Events</h3>

                <div className="Registercardsnon">
                  {nonTechnicalEvents.map(event => renderEventCard(event))}</div>
              </>
            )}


            {workshopEvents.length > 0 && (
              <>
                <h3 className="register-category-title">Workshops</h3>
                <div className="Registercards">
                  {workshopEvents.map(event => renderEventCard(event))}
                </div>
              </>
            )}


            {/* PAY & REGISTER */}
            <p style={{
              padding: "2rem"
            }}>
              ℹ️ Want to participate in more events later?
              You can add events by contacting the event coordinators.

            </p>

            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <h3>Total Amount: ₹{totalAmount}</h3>

              <button
                type="button"
                className="btn"
                onClick={handlePayAndRegister}
                disabled={!isFormValid || totalAmount === 0}
                style={{
                  width: "100%",
                  opacity: isFormValid ? 1 : 0.5,
                }}
              >
                Pay & Register ₹{totalAmount}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
