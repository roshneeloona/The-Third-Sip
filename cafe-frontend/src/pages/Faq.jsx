import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "Do I need an account to order?",
    answer: "You can browse the menu freely. When you add items to cart or place an order, we ask you to sign in so your order history and tracking stay secure.",
  },
  {
    question: "Can I customize drinks?",
    answer: "Yes. Hot and cold beverages open a customizer where you can choose size, temperature, milk, sweetness, espresso shots, and add-ons.",
  },
  {
    question: "Why do food items open details first?",
    answer: "Food items do not need customization, so we show a short details view before adding them to cart. This prevents accidental orders.",
  },
  {
    question: "How do I track my order?",
    answer: "After checkout, use Track Orders from the navigation or footer. You will see your latest order status and receipt details.",
  },
  {
    question: "Can I ask about allergens?",
    answer: "Yes. Use the Contact Us page before ordering if you have allergy or dietary questions. Our team can help you choose safely.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <main className="support-page">
      <section className="support-hero">
        <p className="section-eyebrow">FAQ</p>
        <h1>Answers before your next sip.</h1>
        <p>
          Quick guidance for ordering, customization, tracking, and cafe support.
        </p>
      </section>

      <section className="support-content support-content--narrow">
        <div className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <button
                key={item.question}
                className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                type="button"
              >
                <span className="faq-item__top">
                  <span>{item.question}</span>
                  <span className="faq-item__icon">{isOpen ? "-" : "+"}</span>
                </span>
                {isOpen && <span className="faq-item__answer">{item.answer}</span>}
              </button>
            );
          })}
        </div>

        <div className="faq-cta">
          <h2>Still need help?</h2>
          <p>Send us your question and we will help with your order or cafe visit.</p>
          <Link to="/contact" className="btn btn--primary">Contact Us</Link>
        </div>
      </section>
    </main>
  );
}

export default Faq;
