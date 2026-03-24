import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { VIDEO_REJECT_TEMPLATE } from "../constants/VideoRejectTemplate.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail(to, subject, html) {
  try {
    let info = await transporter.sendMail({
      from: '"contact marsAi" <contact@marsai.com>',
      to,
      subject,
      html,
    });
    return info.response;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildVideoRejectHtml({ firstName, movieTitle, juryComment }) {
  const safeFirstName = escapeHtml(firstName || "Producer");
  const safeMovieTitle = escapeHtml(movieTitle || "your video");
  const safeJuryComment = juryComment ? escapeHtml(juryComment) : "";

  let html = VIDEO_REJECT_TEMPLATE;

  // Replace the greeting
  html = html.replace(/<p>Dear Producer,/g, `<p>Dear ${safeFirstName},`);
  
  // Replace video title in the content
  html = html.replace(
    /your video cannot be accepted,/g,
    `your video "${safeMovieTitle}" cannot be accepted,`
  );

  // Add jury comment section if provided
  if (safeJuryComment) {
    const commentSection = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
      <tr>
        <td class="wrapper" style="background: #f4f5f6; border-radius: 8px;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #666; font-weight: bold;">Jury Comment:</p>
          <p style="margin: 0; font-size: 14px; color: #333;">${safeJuryComment}</p>
        </td>
      </tr>
    </table>`;
    
    html = html.replace(
      /(\s*<p>\s*Best regards,)/,
      `${commentSection}$1`
    );
  }

  return html;
}

async function sendVideoRejectedEmail({ to, firstName, movieTitle, juryComment }) {
  return sendMail(
    to,
    `MarsAI Festival - Video Submission Update`,
    buildVideoRejectHtml({ firstName, movieTitle, juryComment })
  );
}

export default { sendMail, sendVideoRejectedEmail };
