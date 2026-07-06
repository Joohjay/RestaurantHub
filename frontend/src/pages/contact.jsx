import { useState } from "react";
import { LuMail, LuPhone, LuMapPin, LuSend, LuLoader } from "react-icons/lu";
import { useToast } from "../context/ToastContext";
import { API_URL } from "../config";
import "../App.css";

function Contact() {
  const { success, error } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        error(data.message || "Failed to send message.");
        return;
      }

      success(data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      error("Unable to send message. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page contactPage">
      <div className="pageHero">
        <h1>Contact RestaurantHub</h1>
        <p>
          We’re here to help with orders, reservations, menu questions, or general feedback. Send us a message and our support team will reply within one business day.
        </p>
      </div>

      <div className="contactGrid">
        <section className="contactCard">
          <h2>Customer Support</h2>
          <p>Have a question about your order or reservation? Our team is ready to assist.</p>
          <p><LuMail size={16} style={{ verticalAlign: "middle" }} /> support@restauranthub.com</p>
          <p><LuPhone size={16} style={{ verticalAlign: "middle" }} /> +255 700 000 000</p>
          <p><strong>Hours:</strong> Mon - Fri, 8am - 8pm</p>
        </section>

        <section className="contactCard">
          <h2>Partner Restaurants</h2>
          <p>Interested in joining the RestaurantHub network? We support flexible onboarding, menu management, and delivery integration.</p>
          <p><LuMail size={16} style={{ verticalAlign: "middle" }} /> partners@restauranthub.com</p>
          <p><LuPhone size={16} style={{ verticalAlign: "middle" }} /> +255 700 111 222</p>
        </section>

        <section className="contactCard">
          <h2>Office Location</h2>
          <p><LuMapPin size={16} style={{ verticalAlign: "middle" }} /> 123 Food Market Road, Dar es Salaam, Tanzania</p>
        </section>
      </div>

      <div className="contactFormCard">
        <h2>Send us a message</h2>
        <form className="authForm" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </label>
          <label>
            Subject
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              required
            />
          </label>
          <label>
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us more about your request..."
              rows="5"
              required
              minLength={10}
            />
          </label>
          <button type="submit" className="authButton" disabled={loading}>
            {loading ? (
              <><LuLoader className="spin" size={18} /> Sending...</>
            ) : (
              <><LuSend size={18} style={{ verticalAlign: "middle", marginRight: 8 }} /> Send Message</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
