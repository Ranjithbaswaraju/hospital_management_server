const sgMail = require("@sendgrid/mail");

// Set SendGrid API key from environment
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Send email using SendGrid
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error(
      "SendGrid API key is missing. Please set SENDGRID_API_KEY in .env",
    );
  }

  if (!process.env.SENDGRID_FROM_EMAIL) {
    throw new Error(
      "Sender email is missing. Please set SENDGRID_FROM_EMAIL in .env",
    );
  }

  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: "MediBook Hospital",
    },
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
  // Log full SendGrid error for debugging
    const details = error.response?.body?.errors?.[0]?.message || error.message;
    console.log("SendGrid Error:", details);
    throw new Error(details);
  }
};

// Booking confirmation email template
const sendBookingConfirmationEmail = async ({
  patientEmail,
  patientName,
  doctorName,
  date,
  time,
  bookingId,
}) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h1 style="color: #16a34a;">Appointment Confirmed ✅</h1>
      <p>Hello <strong>${patientName}</strong>,</p>
      <p>Your appointment has been booked successfully.</p>
      <h3>Appointment Details:</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>Booking ID</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${bookingId}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>Doctor Name</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${doctorName}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>Date</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${date}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>Time Slot</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${time}</td>
        </tr>
      </table>
      <br/>
      <p>Thank you for choosing MediBook Hospital.</p>
    </div>
  `;

  await sendEmail({
    to: patientEmail,
    subject: "Appointment Booked Successfully - MediBook",
    html,
  });
};

// Cancellation email template
const sendCancellationEmail = async ({ patientEmail, patientName }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #dc2626;">Appointment Cancelled ❌</h1>
      <p>Hello <strong>${patientName}</strong>,</p>
      <p>Your appointment has been cancelled successfully.</p>
      <p>If this was a mistake, please book a new slot from your dashboard.</p>
    </div>
  `;

  await sendEmail({
    to: patientEmail,
    subject: "Appointment Cancelled - MediBook",
    html,
  });
};

module.exports = {
  sendEmail,
  sendBookingConfirmationEmail,
  sendCancellationEmail,
};
