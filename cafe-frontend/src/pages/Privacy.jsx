import { Link } from "react-router-dom";

function Privacy() {
  return (
    <main className="support-page">
      <section className="support-hero support-hero--privacy">
        <p className="section-eyebrow">Privacy</p>
        <h1>Your details stay with care.</h1>
        <p>
          A simple view of how The Third Sip handles account details, orders, contact messages, and receipts.
        </p>
      </section>

      <section className="support-content support-content--narrow">
        <div className="privacy-stack">
          <article className="privacy-card">
            <span className="privacy-card__count">01</span>
            <h2>What we collect</h2>
            <p>
              We collect only the details needed to run your cafe experience: account sign-in details, cart items, order history, receipt records, and contact form messages.
            </p>
          </article>

          <article className="privacy-card">
            <span className="privacy-card__count">02</span>
            <h2>How we use it</h2>
            <p>
              Your information helps us place orders, track preparation status, keep receipts available, and respond to help requests from the Contact page.
            </p>
          </article>

          <article className="privacy-card">
            <span className="privacy-card__count">03</span>
            <h2>How it is stored</h2>
            <p>
              Order and support records are stored by the project backend. Admin access is protected so customer-facing pages do not expose staff tools.
            </p>
          </article>

          <article className="privacy-card">
            <span className="privacy-card__count">04</span>
            <h2>Need help?</h2>
            <p>
              For questions about your details or a message you sent, reach the cafe team through Help & Advice.
            </p>
            <Link to="/contact" className="btn btn--primary">Help & Advice</Link>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Privacy;
