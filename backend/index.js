




console.log("Starting Backend Process...");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { sendMail } = require("./utils/mail");

const app = express();

/* ===============================
   INIT DB
   ================================ */
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        team_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (team_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        team_id VARCHAR(255) NOT NULL UNIQUE,
        event_name VARCHAR(255) NOT NULL,
        team_name VARCHAR(255) NOT NULL,
        leader_id BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (team_id),
        FOREIGN KEY (leader_id) REFERENCES registrations(id) ON DELETE CASCADE
      )
    `);
    console.log("DB Initialized");
  } catch (err) {
    console.error("DB INIT ERROR:", err);
  }
};
initDB();

/* ===============================
   MIDDLEWARE
================================ */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://electryonz-symposium-website.vercel.app",
      // "https://synerix26.site",
      // "https://www.synerix26.site",
      /^https:\/\/.*\.vercel\.app$/,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-admin-secret"],
  })
);
app.use(express.json());

/* ===============================
   HEALTH CHECK (Render)
================================ */
app.get("/healthz", (_, res) => {
  res.status(200).send("OK");
});

/* ===============================
   TEMP: FIX DB SCHEMA
================================ */
app.get("/api/fix-db-schema", async (req, res) => {
  try {
    // 1. INSPECT REGISTRATIONS TABLE
    const [columns] = await pool.query("DESCRIBE registrations");
    const idColumn = columns.find(c => c.Field === 'id');

    let schemaInfo = `<h3>Table 'registrations' ID Column:</h3><pre>${JSON.stringify(idColumn, null, 2)}</pre>`;

    // 2. ATTEMPT TO CREATE TABLE WITH COMPATIBLE TYPE
    // We'll try to guess based on 'Type' from description, or just Print it for now to be safe.
    // If we want to auto-fix:
    const idType = idColumn ? idColumn.Type : "INT"; // e.g., "int(11)" or "int unsigned"
    const isUnsigned = idType.includes("unsigned");
    const isBigInt = idType.toLowerCase().includes("bigint");

    let leaderIdType = "INT";
    if (isBigInt) leaderIdType = "BIGINT";
    if (isUnsigned) leaderIdType += " UNSIGNED";

    schemaInfo += `<h3>Proposed 'teams.leader_id' Type:</h3><pre>${leaderIdType}</pre>`;

    // Now try creating with this specific type
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        team_id VARCHAR(255) NOT NULL UNIQUE,
        event_name VARCHAR(255) NOT NULL,
        team_name VARCHAR(255) NOT NULL,
        leader_id ${leaderIdType} NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (team_id),
        FOREIGN KEY (leader_id) REFERENCES registrations(id) ON DELETE CASCADE
      )
    `);

    res.send(schemaInfo + "<br/><b>Attempted to create 'teams' table with matching type. If you see this, it might have worked!</b>");

  } catch (err) {
    console.error("FIX DB API ERROR:", err);
    res.status(500).send("Error fixing DB: " + err.message + "<br/><br/>" + JSON.stringify(err));
  }
});

/* ===============================
   ADMIN AUTH
================================ */
const adminAuth = (req, res, next) => {
  if (req.headers["x-admin-secret"] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }
  next();
};

/* ===============================
   CONTACT FORM
================================ */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false });
    }

    await sendMail({
      to: "altranz2026@gmail.com",
      subject: "New Contact Message – ALTRANZ 2026",
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${message}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("CONTACT MAIL ERROR:", err.message);
    res.status(500).json({ success: false });
  }
});


/* ===============================
   CHECK EMAIL DUPLICATE
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
/* ===============================
   REGISTER (UPDATED FOR MULTI-TEAM)
================================ */
app.post("/api/register", async (req, res) => {
  try {
    const {
      name, email, phone, college, dept, year,
      event, amount, utr, teamName,
      eventsDetail // Expecting: [{ title: "Event A", mode: "TEAM" }, ...]
    } = req.body;

    if (!name || !email || !event || !utr || amount === undefined || amount === null) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const isFree = Number(amount) === 0;

    // 1. DUPLICATE CHECKS
    const [existingUTR] = await pool.execute(
      "SELECT id FROM registrations WHERE utr = ? LIMIT 1",
      [utr]
    );
    if (existingUTR.length > 0) {
      return res.status(400).json({ success: false, message: "This UTR has already been used" });
    }

    const [existingEmail] = await pool.execute(
      "SELECT id FROM registrations WHERE email = ? LIMIT 1",
      [email]
    );
    if (existingEmail.length > 0) {
      return res.status(409).json({ success: false, message: "This email is already registered" });
    }

    // 2. INSERT REGISTRATION (Master Record)
    // Note: team_name and team_id columns in 'registrations' are now LEGACY/Fallback. 
    // We will still populate them with the "first" team info just in case, but primary source is 'teams' table.

    // Determine Legacy Single Team ID (Optional, just for backward compat or easy view)
    // We won't generate it here if we are doing multi-team. Let's keep it NULL or simple.
    // Actually, to avoid breaking GET /api/admin/registrations which shows team_id, let's put "MULTIPLE" or the first one.
    // For now, let's leave legacy team_id NULL or "SEE_TEAMS_TAB".

    const [result] = await pool.execute(
      `
      INSERT INTO registrations
      (name, email, phone, college, dept, year, event, amount, utr,
       payment_status, verified_at, verified_by, attendance_status, team_name, team_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NOT_VERIFIED', ?, ?)
      `,
      [
        name,
        email,
        phone || "",
        college || "",
        dept || "",
        year || "",
        event,
        amount,
        utr,
        isFree ? "VERIFIED" : "PENDING_VERIFICATION",
        isFree ? new Date() : null,
        isFree ? "SYSTEM" : null,
        teamName || null,
        null // We don't use single team_id anymore
      ]
    );

    const leaderId = result.insertId;
    const generatedTeams = []; // To track created teams

    // 3. GENERATE TEAMS FOR TEAM EVENTS
    if (Array.isArray(eventsDetail)) {
      for (const ev of eventsDetail) {
        if (ev.mode === "TEAM") {
          // Generate Unique ID per event
          const suffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
          const uniqueTeamId = `SYX-T${leaderId}${suffix}`; // Make it robust: SYX-T<LeaderID><Random>

          await pool.execute(
            "INSERT INTO teams (team_id, event_name, team_name, leader_id) VALUES (?, ?, ?, ?)",
            [uniqueTeamId, ev.title, teamName, leaderId]
          );

          generatedTeams.push({ event: ev.title, teamId: uniqueTeamId });
        }
      }
    }

    // Update legacy team_id column if exactly one team (for convenience)
    if (generatedTeams.length === 1) {
      await pool.execute("UPDATE registrations SET team_id=? WHERE id=?", [generatedTeams[0].teamId, leaderId]);
    } else if (generatedTeams.length > 1) {
      await pool.execute("UPDATE registrations SET team_id='MULTI' WHERE id=?", [leaderId]);
    }


    // ---------------- NOTIFY ADMIN ---------------- //
    try {
      const teamListHtml = generatedTeams.map(t => `<li><b>${t.event}:</b> ${t.teamId}</li>`).join("");

      await sendMail({
        to: "phantasm.mech@gmail.com",
        subject: `New Registration: ${name}`,
        html: `
          <h3>New Registration Received</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Events:</b> ${event}</p>
          <p><b>Amount:</b> ₹${amount}</p>
          ${teamName ? `<p><b>Team Name:</b> ${teamName}</p>` : ""}
          ${generatedTeams.length > 0 ? `<p><b>Teams Created:</b><ul>${teamListHtml}</ul></p>` : ""}
        `,
      });
    } catch (e) { console.error("ADMIN MAIL ERROR", e.message); }

    // ---------------- NOTIFY USER (ALL) ---------------- //
    // Send email to EVERY user. 
    // If Free -> Confirmed. 
    // If Paid -> Received (Payment Pending), but show Team IDs.

    const teamListHtml = generatedTeams.map(t => `<li><b>${t.event}:</b> ${t.teamId}</li>`).join("");

    let subject = "";
    let htmlContent = "";

    if (isFree) {
      subject = "SYNERIX Registration Confirmed 🎉";
      htmlContent = `
        <h2>Registration Confirmed</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Events:</b> ${event}</p>
        <p><b>Registration ID:</b> ${leaderId}</p>
        ${teamName ? `<h3 style="color:#007bff">Team Name: ${teamName}</h3>` : ""}
        ${generatedTeams.length > 0 ? `<div style="background:#e6fffa; padding:15px; border-radius:10px; border:1px solid #00ff88;">
           <h3 style="margin-top:0; color:#00a152;">Your Team IDs</h3>
           <p>Use these IDs to invite your team members:</p>
           <ul>${teamListHtml}</ul>
        </div>` : ""}
      `;
    } else {
      // PAID EVENT
      subject = "SYNERIX Registration Received - Payment Verification Pending ⏳";
      htmlContent = `
        <h2>Registration Received</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>We have received your registration for <b>${event}</b>.</p>
        <p><b>Amount Paid:</b> ₹${amount}</p>
        <p><b>UTR:</b> ${utr}</p>
        <br/>
        <p>Your payment is currently being <b>verified</b>. You will receive a final confirmation email once verified.</p>
        
        ${generatedTeams.length > 0 ? `<div style="background:#e6fffa; padding:15px; border-radius:10px; border:1px solid #00ff88;">
           <h3 style="margin-top:0; color:#00a152;">Your Team IDs</h3>
           <p>You can start forming your teams immediately!</p>
           <p>Use these IDs to invite your team members:</p>
           <ul>${teamListHtml}</ul>
        </div>` : ""}
        
        <p><b>Reference ID:</b> ${leaderId}</p>
      `;
    }

    try {
      await sendMail({
        to: email,
        subject: subject,
        html: htmlContent,
      });
    } catch (e) { console.error("USER MAIL ERROR", e.message); }

    res.json({
      success: true,
      message: isFree ? "Registration successful!" : "Payment submitted for verification",
      registrationId: leaderId,
      teams: generatedTeams
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===============================
   ADMIN: VIEW REGISTRATIONS (⚠️ THIS IS CRITICAL)
================================ */
app.get("/api/admin/registrations", adminAuth, async (req, res) => {
  try {
    const { search, event, college, utr, teamId } = req.query;

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

    if (teamId) {
      query += " AND team_id LIKE ?";
      params.push(`%${teamId}%`);
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
   ADMIN: VERIFY PAYMENT + EMAIL
================================ */
app.put("/api/admin/payment/verify/:id", adminAuth, async (req, res) => {
  try {
    const { utr } = req.body; // Accept updated UTR
    const { id } = req.params;

    // 1. Get current registration
    const [[reg]] = await pool.execute(
      "SELECT * FROM registrations WHERE id=?",
      [id]
    );

    if (!reg) return res.status(404).json({ success: false });

    // 2. Determine UTR to use (New or Old)
    const finalUTR = utr ? utr.trim() : reg.utr;

    // 3. Update DB
    await pool.execute(
      `
      UPDATE registrations
      SET payment_status='VERIFIED',
          verified_at=NOW(),
          verified_by='ADMIN',
          utr=? 
      WHERE id=?
      `,
      [finalUTR, id]
    );

    // 4. Send Email
    try {
      await sendMail({
        to: reg.email,
        subject: "SYNERIX Registration Confirmed 🎉",
        html: `
          <h2>Registration Confirmed</h2>
          <p><b>Name:</b> ${reg.name}</p>
          <p><b>Events:</b> ${reg.event}</p>
          ${reg.team_name ? `<h3 style="color:#007bff">Team Name: ${reg.team_name}</h3>` : ""}
          ${reg.team_id ? `<h3 style="color:#28a745">Team ID: ${reg.team_id}</h3>` : ""}
          <p><b>Amount:</b> ₹${reg.amount}</p>
          <p><b>Overview:</b> Payment Verified via UTR: ${finalUTR}</p>
        `,
      });
    } catch (mailErr) {
      console.error("MAIL FAILED:", mailErr.message);
    }

    res.json({ success: true, updatedUTR: finalUTR });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({ success: false });
  }
});


/* ===============================
   ADMIN: ADD EVENT TO REGISTRATION
   ================================ */
app.put("/api/admin/add-event/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { eventIds } = req.body; // Expects array of { title, fee }

    if (!eventIds || !Array.isArray(eventIds)) {
      return res.status(400).json({ success: false, message: "Invalid payload" });
    }

    // 1. Get current data
    const [[current]] = await pool.execute(
      "SELECT event, amount FROM registrations WHERE id=?",
      [id]
    );

    if (!current) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Calculate new values
    const newEvents = eventIds.map(e => e.title).join(", ");
    const addedAmount = eventIds.reduce((sum, e) => sum + Number(e.fee || 0), 0);

    const updatedEventString = current.event
      ? `${current.event}, ${newEvents}`
      : newEvents;

    const updatedAmount = Number(current.amount) + addedAmount;

    // 3. Update DB
    await pool.execute(
      "UPDATE registrations SET event=?, amount=? WHERE id=?",
      [updatedEventString, updatedAmount, id]
    );

    res.json({
      success: true,
      message: "Events added successfully",
      updatedEvent: updatedEventString,
      updatedAmount: updatedAmount
    });

  } catch (err) {
    console.error("ADD EVENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===============================
 BREVO QUICK TEST
================================ */
app.post("/test-brevo", async (req, res) => {
  try {
    await sendMail({
      to: "altranz2026@gmail.com", // change to your email
      subject: "Brevo Test ✅",
      html: "<h2>Brevo SMTP is working perfectly 🚀</h2>",
    });

    res.send("Brevo email sent successfully ✅");
  } catch (err) {
    console.error("BREVO TEST ERROR:", err.message);
    res.status(500).send("Brevo email failed ❌");
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
      SET payment_status='PENDING_VERIFICATION',
          verified_at=NULL,
          verified_by=NULL
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
   ROOT
================================ */
/* ===============================
   ADMIN: GET PHONE NUMBERS (WHATSAPP)
   ================================ */
app.get("/api/admin/phone-numbers", adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT name, phone FROM registrations WHERE phone IS NOT NULL AND phone != ''");

    // Filter and format
    const participants = rows.map(r => {
      let rawPhone = r.phone.replace(/\D/g, ""); // Remove non-digits
      let phone = rawPhone;

      // Basic Indian format handling
      if (phone.length === 10) {
        phone = "91" + phone;
      } else if (phone.length > 10 && phone.startsWith("0")) {
        phone = "91" + phone.substring(1);
      } else if (phone.length === 12 && phone.startsWith("91")) {
        // Already formatted correctly
        phone = phone;
      }

      return {
        name: r.name,
        phone: phone
      };
    }).filter(p => p.phone.length >= 10); // Basic validation

    res.json({ success: true, participants });
  } catch (err) {
    console.error("PHONE FETCH ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===============================
   ADMIN: DELETE REGISTRATION
   ================================ */
app.delete("/api/admin/registration/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      "DELETE FROM registrations WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   JOIN TEAM
   ================================ */
/* ===============================
   JOIN TEAM
   ================================ */
/* ===============================
   JOIN TEAM (UPDATED)
================================ */
app.post("/api/join-team", async (req, res) => {
  try {
    const { teamId, teamName, name } = req.body;
    console.log("JOIN TEAM REQUEST:", { teamId, teamName, name });

    if (!teamId || !teamName || !name) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    // 1. Find by Team ID in TEAMS table
    const [rows] = await pool.execute(
      "SELECT id, team_name, event_name FROM teams WHERE team_id = ?",
      [teamId.trim()]
    );

    if (rows.length === 0) {
      console.log("JOIN TEAM: ID not found", teamId);
      return res.status(404).json({ success: false, message: "Invalid Team ID" });
    }

    const team = rows[0];

    // 2. Validate Team Name (Case Indifferent)
    if (team.team_name.trim().toLowerCase() !== teamName.trim().toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: `Team Name mismatch. This ID belongs to Team: ${team.team_name}`
      });
    }

    // 3. VALIDATE MAX MEMBERS
    let eventsData = [];
    try {
      // Try requiring the data file
      const dataModule = require("./data/events");
      eventsData = dataModule.eventsData || [];
    } catch (e) {
      console.error("WARNING: Could not load events data for validation:", e.message);
      // We don't block joining if validation config is missing, or we could strict block.
      // Let's strict block to be safe? Or allow?
      // User wants validation. If validation fails due to technical error, maybe safe to fail?
      // Let's log it and proceed with CAUTION or return 500 with clear message?
      // Better to proceed if it's just a missing file, but here we expect it.
    }

    // Find event metadata
    const eventMeta = eventsData.find(e => e.title === team.event_name);

    if (eventMeta && eventMeta.maxMembers) {
      // Count current members (Leader + Joined)
      // Leader is 1. Joined are in team_members.
      const [[{ count }]] = await pool.execute(
        "SELECT COUNT(*) as count FROM team_members WHERE team_id = ?",
        [teamId.trim()]
      );

      const currentTotal = 1 + count; // 1 for Leader

      if (currentTotal >= eventMeta.maxMembers) {
        return res.status(400).json({
          success: false,
          message: `Team '${team.team_name}' is full (Max ${eventMeta.maxMembers} members for ${team.event_name})`
        });
      }
    }

    // 4. Add Member
    await pool.execute(
      "INSERT INTO team_members (team_id, name) VALUES (?, ?)",
      [teamId.trim(), name.trim()]
    );

    console.log("JOIN TEAM: Success", { name, teamId, event: team.event_name });
    res.json({ success: true, message: `Joined team successfully for ${team.event_name}` });

  } catch (err) {
    console.error("JOIN TEAM ERROR:", err);
    res.status(500).json({ success: false, message: `Server error: ${err.message}` });
  }
});

/* ===============================
   ADMIN: GET TEAMS
   ================================ */
/* ===============================
   ADMIN: GET TEAMS (UPDATED)
================================ */
app.get("/api/admin/teams", adminAuth, async (req, res) => {
  try {
    // 1. Get Filters
    const { search, event } = req.query;

    let query = `
      SELECT 
        t.team_id, t.team_name, t.event_name AS event,
        r.name AS leader_name, r.email AS leader_email, r.phone AS leader_phone, 
        r.college AS leader_college, r.dept AS leader_dept
      FROM teams t
      JOIN registrations r ON t.leader_id = r.id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += `
        AND (t.team_id LIKE ? OR t.team_name LIKE ? OR r.name LIKE ?)
      `;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (event) {
      query += " AND t.event_name LIKE ?";
      params.push(`%${event}%`);
    }

    query += " ORDER BY t.created_at DESC";

    const [teamsList] = await pool.execute(query, params);

    // 2. Get Members (Optimization: We could filter this too, but for now fetch all is okay or fetching only for checks)
    // Actually, let's fetch ALL members for simplicity as the count isn't huge yet. 
    // Or better: Fetch members only for the teams we found? 
    // `SELECT * FROM team_members WHERE team_id IN (...)`

    // For now, sticking to simple All fetch to avoid complex IN clause generation, 
    // assuming <1000 teams. If scaling, this needs refactor.
    const [allMembers] = await pool.execute("SELECT * FROM team_members");

    // 3. Combine
    const teams = teamsList.map(t => {
      // Find members for this specific team ID
      const teamMembers = allMembers.filter(m => m.team_id === t.team_id);

      return {
        team_id: t.team_id,
        team_name: t.team_name,
        event: t.event,
        name: t.leader_name,      // Leader Name (Mapped to 'name' for frontend compat)
        email: t.leader_email,    // Leader Email
        phone: t.leader_phone,
        college: t.leader_college,
        dept: t.leader_dept,
        members: teamMembers
      };
    });

    res.json({ success: true, teams });

  } catch (err) {
    console.error("GET TEAMS ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ===============================
   DELETE TEAM
================================ */
app.delete("/api/admin/team/:teamId", adminAuth, async (req, res) => {
  const { teamId } = req.params;
  try {
    // 1. Delete Members first (Manual Cascade)
    await pool.execute("DELETE FROM team_members WHERE team_id = ?", [teamId]);

    // 2. Delete Team
    const [result] = await pool.execute("DELETE FROM teams WHERE team_id = ?", [teamId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    res.json({ success: true, message: "Team deleted successfully" });
  } catch (err) {
    console.error("DELETE TEAM ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

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
