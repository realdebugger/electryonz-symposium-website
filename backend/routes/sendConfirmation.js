const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

/* ---------------- NODEMAILER TRANSPORT ---------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ---------------- SEND CONFIRMATION ---------------- */
router.post("/send-confirmation", async (req, res) => {
  try {
    const { name, email, college, phone, event, amount, utr } = req.body;

    // 🔒 Basic validation
    if (!name || !email || !event || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    /* ---------------- PARTICIPANT EMAIL ---------------- */
    const participantMail = {
      from: `"SYNERIX" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "SYNERIX Registration Successful 🎉",
      html: `
        <h2>Registration Successful 🎉</h2>
        <p>Dear <b>${name}</b>,</p>

        <p>Your registration for <b>SYNERIX</b> has been completed successfully.</p>

        <hr />

        <p><b>College:</b> ${college || "-"}</p>
        <p><b>Phone:</b> ${phone || "-"}</p>
        <p><b>Events:</b> ${event}</p>
        <p><b>Amount Paid:</b> ₹${amount}</p>
        ${utr ? `<p><b>Transaction ID:</b> ${utr}</p>` : ""}

        <hr />
        <p>Thank you for registering.<br/>We look forward to seeing you!</p>

        <p style="margin-top:1.5rem;">
          — <b>SYNERIX Team</b>
        </p>
      `,
    };

    await transporter.sendMail(participantMail);

    /* ---------------- ADMIN EMAIL (OPTIONAL BUT RECOMMENDED) ---------------- */
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: `"SYNERIX" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "New SYNERIX Registration 📥",
        html: `
          <h3>New Registration Received</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>College:</b> ${college || "-"}</p>
          <p><b>Phone:</b> ${phone || "-"}</p>
          <p><b>Events:</b> ${event}</p>
          <p><b>Amount:</b> ₹${amount}</p>
          ${utr ? `<p><b>UTR:</b> ${utr}</p>` : ""}
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Confirmation email sent successfully",
    });
  } catch (error) {
    console.error("❌ send-confirmation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send confirmation email",
    });
  }
});

module.exports = router;
