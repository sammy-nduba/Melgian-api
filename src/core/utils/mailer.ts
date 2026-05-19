import { env } from "../config/env.js";

interface BookingEmailData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  travelDate: Date;
  adults: number;
  children: number;
  message?: string | null;
  estimatedAmount?: number | null;
}

interface TourEmailData {
  title: string;
  priceFrom: number;
  currency: string;
}

/**
 * Generates the luxury-themed HTML template for the traveler.
 */
function getTravelerHTML(booking: BookingEmailData, tour: TourEmailData | null): string {
  const tourTitle = tour?.title || "Bespoke Custom Journey";
  const estimatedCost = booking.estimatedAmount 
    ? `$${Number(booking.estimatedAmount).toLocaleString()}` 
    : "Bespoke Quote Pending";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #FAFAF9; color: #1C1C1C; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .header { background-color: #1B3B2B; padding: 40px; text-align: center; }
        .logo { font-size: 20px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; color: #E5C583; margin: 0; }
        .content { padding: 40px; line-height: 1.6; }
        h1 { font-size: 24px; font-weight: 700; color: #1B3B2B; margin-top: 0; margin-bottom: 20px; }
        p { font-size: 15px; color: #4A4A4A; margin-bottom: 24px; }
        .summary-card { background-color: #F5F5F4; border-radius: 12px; border: 1px solid #EAEAE9; padding: 24px; margin-bottom: 28px; }
        .summary-title { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #8A8A85; margin: 0 0 16px 0; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; border-bottom: 1px dashed #E5E5E4; padding-bottom: 8px; }
        .detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .detail-label { color: #6E6E6A; font-weight: 500; }
        .detail-val { color: #1C1C1C; font-weight: 600; }
        .footer-note { font-size: 14px; font-style: italic; color: #6E6E6A; margin-top: 32px; border-top: 1px solid #EAEAE9; padding-top: 20px; }
        .brand { text-align: center; padding: 30px; font-size: 11px; color: #8A8A85; background-color: #FDFDFD; border-top: 1px solid #F5F5F4; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="logo">Melgian Expeditions</div>
        </div>
        <div class="content">
          <h1>Your Safari Awaits</h1>
          <p>Dear ${booking.fullName},</p>
          <p>Thank you for initiating your bespoke journey with Melgian Expeditions. Our luxury safari specialists are currently reviewing your preferences to handcraft a custom itinerary tailored exactly to your dream escape.</p>
          
          <div class="summary-card">
            <div class="summary-title">Inquiry Details</div>
            
            <div class="detail-row">
              <span class="detail-label">Tour Package</span>
              <span class="detail-val">${tourTitle}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Date</span>
              <span class="detail-val">${new Date(booking.travelDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Party Size</span>
              <span class="detail-val">${booking.adults} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Estimated Value</span>
              <span class="detail-val" style="color: #1B3B2B;">${estimatedCost}</span>
            </div>
          </div>
          
          <p><strong>What Happens Next?</strong><br>A dedicated private travel designer has been assigned to your reservation. Within the next 24 hours, we will reach out to schedule a planning consultation or present a custom day-by-day itinerary proposal.</p>
          
          <div class="footer-note">
            Warm regards,<br>
            <strong>The Melgian Expeditions Concierge Team</strong>
          </div>
        </div>
        <div class="brand">
          © 2026 Melgian Expeditions. All Rights Reserved. Luxury Wilderness Safaris.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates the admin HTML template notifying about the new booking.
 */
function getAdminHTML(booking: BookingEmailData, tour: TourEmailData | null): string {
  const tourTitle = tour?.title || "Bespoke Custom Journey";
  const estimatedCost = booking.estimatedAmount 
    ? `$${Number(booking.estimatedAmount).toLocaleString()}` 
    : "Bespoke Quote Pending";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #F4F4F5; color: #18181B; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 12px; overflow: hidden; }
        .header { background-color: #18181B; padding: 24px; text-align: center; }
        .badge { font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #F59E0B; background-color: rgba(245,158,11,0.15); padding: 6px 12px; border-radius: 9999px; display: inline-block; }
        .content { padding: 40px; }
        h1 { font-size: 20px; font-weight: 700; color: #18181B; margin-top: 0; margin-bottom: 24px; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .data-table th, .data-table td { padding: 12px 16px; text-align: left; font-size: 14px; border-bottom: 1px solid #F4F4F5; }
        .data-table th { background-color: #FAF9F6; font-weight: 600; color: #71717A; width: 35%; }
        .data-table td { font-weight: 500; color: #18181B; }
        .msg-box { background-color: #FAF9F6; border-left: 4px solid #D4A373; padding: 16px; border-radius: 0 8px 8px 0; font-size: 13px; font-style: italic; color: #3F3F46; line-height: 1.5; margin-bottom: 24px; }
        .action-btn { display: inline-block; background-color: #1B3B2B; color: #FAFAF9 !important; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-size: 12px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <span class="badge">New Reservation Inquiry</span>
        </div>
        <div class="content">
          <h1>Lead Details Received</h1>
          
          <table class="data-table">
            <tr>
              <th>Lead Traveler</th>
              <td>${booking.fullName}</td>
            </tr>
            <tr>
              <th>Email Address</th>
              <td>${booking.email}</td>
            </tr>
            <tr>
              <th>Phone Number</th>
              <td>${booking.phone}</td>
            </tr>
            <tr>
              <th>Selected Tour</th>
              <td>${tourTitle}</td>
            </tr>
            <tr>
              <th>Travel Date</th>
              <td>${new Date(booking.travelDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Party Size</th>
              <td>${booking.adults} Adults, ${booking.children} Children</td>
            </tr>
            <tr>
              <th>Estimated Revenue</th>
              <td style="color: #1B3B2B; font-weight: 700;">${estimatedCost}</td>
            </tr>
          </table>

          ${booking.message ? `
            <div style="font-size: 12px; font-weight: 700; color: #71717A; text-transform: uppercase; margin-bottom: 8px;">Special Requests</div>
            <div class="msg-box">
              &ldquo;${booking.message}&rdquo;
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 32px;">
            <a href="${env.FRONTEND_URL}/admin" class="action-btn">Launch Administration Console</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Core utility that dispatches booking confirmation emails to the traveler and the administrator.
 */
export async function sendBookingEmails(
  booking: BookingEmailData,
  tour: TourEmailData | null
): Promise<void> {
  const adminRecipient = env.BOOKING_NOTIFICATION_EMAIL || "bookings@melgianexpeditions.com";
  const travelerRecipient = booking.email;
  const senderEmail = env.SENDER_EMAIL;

  const travelerHTML = getTravelerHTML(booking, tour);
  const adminHTML = getAdminHTML(booking, tour);

  // If no Resend API Key is configured, execute fully styled Console Fallback
  if (!env.RESEND_API_KEY) {
    console.log("\n========================================================");
    console.log("📨 [MOCK EMAIL DISPATCHER] (No RESEND_API_KEY Configured)");
    console.log("========================================================");
    console.log(`FROM:    Melgian Expeditions Concierge <${senderEmail}>`);
    console.log(`TO:      Lead Traveler <${travelerRecipient}>`);
    console.log("SUBJECT: Your Luxury Wilderness Safari Awaits — Confirmation");
    console.log("------------------ TRAVELER HTML BODY ------------------");
    console.log(travelerHTML.trim().substring(0, 300) + "\n... [Truncated for readability] ...");
    console.log("========================================================");
    console.log(`FROM:    Administrative Alerts <${senderEmail}>`);
    console.log(`TO:      Sales Team <${adminRecipient}>`);
    console.log(`SUBJECT: ALERT: New Booking Received from ${booking.fullName}`);
    console.log("-------------------- ADMIN HTML BODY -------------------");
    console.log(adminHTML.trim().substring(0, 300) + "\n... [Truncated for readability] ...");
    console.log("========================================================\n");
    return;
  }

  // Helper function to query Resend JSON REST API
  async function dispatchResend(to: string, subject: string, html: string) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Melgian Expeditions <${senderEmail}>`,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Resend API dispatch failed with status ${res.status}: ${errBody}`);
    }
  }

  // Dispatch both emails in parallel
  try {
    await Promise.all([
      dispatchResend(travelerRecipient, "Your Luxury Wilderness Safari Awaits — Confirmation", travelerHTML),
      dispatchResend(adminRecipient, `ALERT: New Booking Received from ${booking.fullName}`, adminHTML),
    ]);
    console.log(`[MAILER] Emails successfully dispatched to traveler (${travelerRecipient}) and admin (${adminRecipient}).`);
  } catch (error) {
    console.error("[MAILER] Failed to dispatch real emails via Resend:", error);
    throw error;
  }
}
