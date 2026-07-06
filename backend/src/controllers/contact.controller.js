import { isValidEmail, missingFields } from "../utils/validation.js";

export async function submitContact(req, res) {
  const { name, email, subject, message } = req.body;

  const missing = missingFields(req.body, ["name", "email", "subject", "message"]);
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}.` });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "A valid email address is required." });
  }

  if (message.length < 10) {
    return res.status(400).json({ message: "Message must be at least 10 characters." });
  }

  try {
    // In production, send email via SendGrid/Resend/AWS SES.
    // For now, log the contact request so it can be reviewed.
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Message sent. We will get back to you soon." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
}
