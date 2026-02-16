// const axios = require("axios");

// async function sendMail({ to, subject, html }) {
//   return axios.post(
//     "https://api.brevo.com/v3/smtp/email",
//     {
//       sender: {
//         name: "ALTRANZ Team",
//         email: "altranz2026@gmail.com", // or no-reply@yourdomain.com
//       },
//       to: [{ email: to }],
//       subject,
//       htmlContent: html,
//     },
//     {
//       headers: {
//         "api-key": process.env.BREVO_API_KEY,
//         "Content-Type": "application/json",
//         accept: "application/json",
//       },
//       timeout: 15000,
//     }
//   );
// }

// module.exports = { sendMail };


const axios = require("axios");

async function sendMail({ to, subject, html }) {

  return axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "ALTRANZ TEAM",
        email: "altranz2026@gmail.com", // or no-reply@yourdomain.com
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      timeout: 15000,
    }
  );

}
module.exports = { sendMail };