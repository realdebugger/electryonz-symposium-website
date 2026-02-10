console.log("Starting Backend Process...");
require("dotenv").config();
console.log("Environment loaded");

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { sendMail } = require("./utils/mail");

/* ===============================
   APP INIT
================================ */
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      /^https:\/\/.*\.vercel\.app$/,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-admin-secret"],
  })
);

app.use(express.json());

/* ===============================
   HEALTH CHECK (RENDER)
================================ */
app.get("/healthz", (_, res) => {
  res.status(200).send("OK");
});

/* ===============================
   CONTACT FORM (EMAIL)
================================ */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false });
    }

    await sendMail({
      to: "synerix26@gmail.com",
      subject: "New Contact Message – SYNERIX 2026",
      html: `
        <h2>New Contact Message 📩</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${message}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("CONTACT MAIL ERROR:", err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN AUTH
================================ */
const adminAuth = (req, res, next) => {
  if (req.headers["x-admin-secret"] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ success: false });
  }
  next();
};

/* ===============================
   CHECK EMAIL (BEFORE PAYMENT)
================================ */
app.post("/api/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const [rows] = await pool.execute(
      "SELECT id FROM registrations WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already registered. Please contact the organizers to add more events.",
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("CHECK EMAIL ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


/* ===============================
   REGISTER (NO EMAIL)
================================ */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, college, event, amount, utr } = req.body;

    if (!name || !email || !event || !amount || !utr) {
      return res.status(400).json({ success: false });
    }

    const [existing] = await pool.execute(
      "SELECT id FROM registrations WHERE utr = ? LIMIT 1",
      [utr]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This UTR has already been used",
      });
    }

    const [result] = await pool.execute(
      `
      INSERT INTO registrations
      (name, email, phone, college, event, amount, utr,
       payment_status, attendance_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING_VERIFICATION', 'NOT_VERIFIED')
      `,
      [name, email, phone || "", college || "", event, amount, utr]
    );

    res.json({
      success: true,
      message: "Payment submitted for verification",
      registrationId: result.insertId,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN: VIEW REGISTRATIONS
================================ */
app.get("/api/admin/registrations", adminAuth, async (req, res) => {
  try {
    const { search, event, college, utr } = req.query;

    let query = `SELECT * FROM registrations WHERE 1=1`;
    const params = [];

    if (search) {
      query += `
        AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR college LIKE ?)
      `;
      params.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      );
    }

    if (event) {
      query += " AND event LIKE ?";
      params.push(`%${event}%`);
    }

    if (college) {
      query += " AND college LIKE ?";
      params.push(`%${college}%`);
    }

    if (utr) {
      query += " AND utr LIKE ?";
      params.push(`%${utr}%`);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await pool.execute(query, params);

    const [[count]] = await pool.execute(
      `SELECT COUNT(*) AS total FROM (${query}) AS t`,
      params
    );

    res.json({
      success: true,
      totalRegistrations: count.total,
      registrations: rows,
    });
  } catch (err) {
    console.error("ADMIN FILTER ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN: EVENT-WISE COUNT
================================ */
app.get("/api/admin/event-count", adminAuth, async (_, res) => {
  try {
    const [rows] = await pool.query("SELECT event FROM registrations");

    const map = {};
    rows.forEach(r => {
      if (!r.event) return;
      r.event.split(",").map(e => e.trim()).forEach(ev => {
        map[ev] = (map[ev] || 0) + 1;
      });
    });

    res.json({ success: true, eventCounts: map });
  } catch {
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN: ADD EVENT
================================ */
app.put("/api/admin/add-event/:id", adminAuth, async (req, res) => {
  try {
    const { eventIds } = req.body;
    const { id } = req.params;

    const [[user]] = await pool.execute(
      "SELECT event, amount, attendance_status FROM registrations WHERE id=?",
      [id]
    );

    if (!user) return res.status(404).json({ success: false });

    if (user.attendance_status === "VERIFIED") {
      return res.status(400).json({ success: false });
    }

    const existing = user.event
      ? user.event.split(",").map(e => e.trim())
      : [];

    let added = [];
    let extra = 0;

    eventIds.forEach(ev => {
      if (!existing.includes(ev.title)) {
        existing.push(ev.title);
        extra += Number(ev.fee) || 0;
        added.push(ev.title);
      }
    });

    if (!added.length) {
      return res.status(400).json({ success: false });
    }

    await pool.execute(
      `
      UPDATE registrations
      SET event=?, amount=?, payment_status='PENDING_VERIFICATION', utr=NULL
      WHERE id=?
      `,
      [existing.join(", "), user.amount + extra, id]
    );

    res.json({ success: true, added, extra });
  } catch (err) {
    console.error("ADD EVENT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN: VERIFY PAYMENT (EMAIL)
================================ */
app.put("/api/admin/payment/verify/:id", adminAuth, async (req, res) => {
  try {
    const [[reg]] = await pool.execute(
      "SELECT * FROM registrations WHERE id=?",
      [req.params.id]
    );

    if (!reg) return res.status(404).json({ success: false });

    await pool.execute(
      `
      UPDATE registrations
      SET payment_status='VERIFIED', verified_at=NOW(), verified_by='ADMIN'
      WHERE id=?
      `,
      [req.params.id]
    );

    await sendMail({
      to: reg.email,
      subject: "SYNERIX Registration Confirmed 🎉",
      html: `
        <h2>Registration Confirmed</h2>
        <p><b>Name:</b> ${reg.name}</p>
        <p><b>Events:</b> ${reg.event}</p>
        <p><b>Amount:</b> ₹${reg.amount}</p>
        <p><b>UTR:</b> ${reg.utr}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN: UNDO PAYMENT
================================ */
app.put("/api/admin/payment/undo/:id", adminAuth, async (req, res) => {
  try {
    const [[row]] = await pool.execute(
      "SELECT attendance_status FROM registrations WHERE id=?",
      [req.params.id]
    );

    if (row.attendance_status === "VERIFIED") {
      return res.status(400).json({ success: false });
    }

    await pool.execute(
      `
      UPDATE registrations
      SET payment_status='PENDING_VERIFICATION', verified_at=NULL, verified_by=NULL
      WHERE id=?
      `,
      [req.params.id]
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN: ATTENDANCE
================================ */
app.put("/api/admin/attendance/verify/:id", adminAuth, async (req, res) => {
  try {
    await pool.execute(
      "UPDATE registrations SET attendance_status='VERIFIED' WHERE id=?",
      [req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

app.put("/api/admin/attendance/undo/:id", adminAuth, async (req, res) => {
  try {
    await pool.execute(
      "UPDATE registrations SET attendance_status='NOT_VERIFIED' WHERE id=?",
      [req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ADMIN: DELETE
================================ */
app.delete("/api/admin/registration/:id", adminAuth, async (req, res) => {
  try {
    await pool.execute("DELETE FROM registrations WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

/* ===============================
   ROOT
================================ */
app.get("/", (_, res) => {
  res.send("SYNERIX backend is live 🚀");
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
