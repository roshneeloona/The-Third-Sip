import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

function Contact() {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await apiRequest("/api/contact", {
        method: "POST",
        body: payload,
      });
      form.reset();
      setStatus({
        type: "success",
        message: "Thanks for reaching out. We'll reply as soon as possible.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Could not send your message right now.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="support-page">
      <section className="support-hero support-hero--contact">
        <p className="section-eyebrow">Help & Advice</p>
        <h1>Contact The Third Sip</h1>
        <p>
          Need help with an order, an ingredient question, or a cafe visit? Send us a note and we will guide you.
        </p>
      </section>

      <section className="support-content">
        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__row">
              <label>
                Name
                <input name="name" type="text" placeholder="Your name" required />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="you@example.com" required />
              </label>
            </div>

            <label>
              Topic
              <select name="topic" defaultValue="Order help">
                <option>Order help</option>
                <option>Ingredients</option>
                <option>Cafe visit</option>
                <option>General feedback</option>
              </select>
            </label>

            <label>
              Message
              <textarea name="message" rows="6" placeholder="Tell us how we can help..." required />
            </label>

            {status.message && (
              <p className={`contact-form__status contact-form__status--${status.type}`}>
                {status.message}
              </p>
            )}

            <button className="btn btn--primary" type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          <aside className="contact-panel">
            <div>
              <span className="contact-panel__label">Email</span>
              <a href="mailto:hello@thethirdsip.com">hello@thethirdsip.com</a>
            </div>
            <div>
              <span className="contact-panel__label">Phone</span>
              <a href="tel:+910000000000">+91 00000 00000</a>
            </div>
            <div>
              <span className="contact-panel__label">Hours</span>
              <p>Open daily from 8:00 AM to 10:00 PM</p>
            </div>
            <Link to="/faq" className="contact-panel__link">Read FAQ</Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Contact;
