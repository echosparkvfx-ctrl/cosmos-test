import React from "react";

export default function Contact() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "", // honeypot — must stay empty
  });

  const [loading, setLoading] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState("");

  // Captured once on mount; sent to the server so it can reject too-fast (bot) submissions.
  const startedAtRef = React.useRef(Date.now());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startedAt: startedAtRef.current,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        // non-JSON response (unlikely with our server)
      }

      if (res.ok) {
        setStatusMsg("✅ Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "", website: "" });
        startedAtRef.current = Date.now();
      } else if (res.status === 429) {
        setStatusMsg("⚠️ Too many requests. Please try again in a few minutes.");
      } else {
        // Show server's validation message if present; otherwise a generic line.
        setStatusMsg(data.error || "❌ Couldn't send right now. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <section id="contact" className="contact">
        <style>{`
        .contact {
          position: relative;
          overflow: hidden;
          padding: 96px 0;
          background:
            radial-gradient(ellipse at 10% 14%, rgba(247, 183, 51, 0.18), transparent 34%),
            radial-gradient(ellipse at 90% 12%, rgba(247, 183, 51, 0.16), transparent 34%),
            linear-gradient(135deg, #0f1320 0%, #0a0e1a 42%, #0a0e1a 100%);
        }

        .contact::before {
          content: "";
          position: absolute;
          inset: 42px 0 auto;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 107, 74, 0.32), rgba(247, 183, 51, 0.3), transparent);
        }

        .contactHeader {
          max-width: 780px;
          margin-bottom: 14px;
        }

        .contact h2 {
          margin: 0 0 14px;
          color: #f5f5f5;
          font-size: clamp(32px, 4.4vw, 46px);
          line-height: 1.04;
          font-weight: 950;
          letter-spacing: 0;
        }

        .contact-subtitle {
          max-width: 680px;
          color: rgba(245, 245, 245, 0.7);
          margin: 0 0 40px;
          font-size: 16px;
          line-height: 1.74;
        }

        .contactWrapper {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.72fr);
          gap: 24px;
          align-items: stretch;
        }

        .contactForm {
          position: relative;
          padding: 30px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
          box-shadow: 0 18px 52px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Honeypot — visually hidden but submitted in form data.
           Bots fill all inputs; humans never see it. */
        .honeypot {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
          pointer-events: none;
        }

        .contactForm input,
        .contactForm textarea {
          width: 100%;
          padding: 15px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f5f5f5;
          background: #0f1320;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .contactForm input:focus,
        .contactForm textarea:focus {
          border-color: rgba(255, 107, 74, 0.52);
          box-shadow: 0 0 0 4px rgba(255, 107, 74, 0.1);
        }

        .contactForm textarea {
          min-height: 150px;
          resize: vertical;
        }

        .contactForm button {
          min-height: 50px;
          margin-top: 4px;
          background: linear-gradient(135deg, #ff6b4a, #f7b733);
          border: none;
          color: #f5f5f5;
          padding: 0 18px;
          border-radius: 10px;
          font-weight: 850;
          cursor: pointer;
          box-shadow: 0 16px 34px rgba(247, 183, 51, 0.24);
          transition: transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease;
        }

        .contactForm button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 22px 42px rgba(255, 107, 53, 0.22);
        }

        .contactForm button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .statusMsg {
          padding: 12px 14px;
          border-radius: var(--radius);
          color: #f5f5f5;
          font-weight: 800;
          border: 1px solid transparent;
        }

        .statusMsgOk {
          background: rgba(34, 197, 94, 0.16);
          border-color: rgba(34, 197, 94, 0.32);
        }

        .statusMsgWarn {
          background: rgba(247, 183, 51, 0.18);
          border-color: rgba(247, 183, 51, 0.34);
        }

        .statusMsgErr {
          background: rgba(239, 68, 68, 0.16);
          border-color: rgba(239, 68, 68, 0.34);
        }

        .contactDetails {
          padding: 30px;
          border-radius: var(--radius-lg);
          color: #f5f5f5;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 18px 52px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .contactDetails::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(10, 14, 26, 0.85), rgba(10, 14, 26, 0.95)),
            url("/images/cosmos-talent-visual.webp") center / cover;
          opacity: 0.5;
        }

        .contactDetails > * {
          position: relative;
          z-index: 1;
        }

        .detailItem {
          display: flex;
          gap: 14px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(245, 245, 245, 0.7);
          line-height: 1.7;
        }

        .detailItem:last-child {
          border-bottom: 0;
        }

        .detailIcon {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 241, 118, 0.42), rgba(247, 183, 51, 0.32));
          line-height: 1;
          font-size: 18px;
        }

        .contactDetails address {
          font-style: normal;
        }

        .detailLabel {
          color: #f5f5f5;
          font-weight: 900;
          margin-bottom: 4px;
        }

        .contactDetails a {
          color: #ff6b4a;
          font-weight: 850;
        }

        @media(max-width: 800px) {
          .contact {
            padding: 72px 0;
          }

          .contactWrapper {
            grid-template-columns: 1fr;
          }

          .contactForm,
          .contactDetails {
            padding: 24px;
          }
        }
      `}</style>

        <div className="container">
          <div className="contactHeader">
            <h2>Get in Touch</h2>
            <p className="contact-subtitle">
              Have a project in mind? Let's build something powerful.
            </p>
          </div>

          <div className="contactWrapper">
            <form onSubmit={handleSubmit} className="contactForm" noValidate>
              {/* Honeypot: hidden from humans, bots fill it. If non-empty, server silently drops the submission. */}
              <div className="honeypot" aria-hidden="true">
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  autoComplete="name"
                  disabled={loading}
              />

              <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  autoComplete="email"
                  disabled={loading}
              />

              <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  autoComplete="tel"
                  disabled={loading}
              />

              <textarea
                  name="message"
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={5000}
                  disabled={loading}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>

              {statusMsg && (
                <div
                  className={`statusMsg ${statusMsg.startsWith("✅") ? "statusMsgOk" : statusMsg.startsWith("⚠️") ? "statusMsgWarn" : "statusMsgErr"}`}
                  role="status"
                  aria-live="polite"
                >
                  {statusMsg}
                </div>
              )}
            </form>

            <div className="contactDetails">
              <div className="detailItem">
                <div className="detailIcon" aria-hidden="true">📍</div>
                <address>
                  <div className="detailLabel">Address</div>
                  COSMOS NextGen IT LLC<br />
                  5900 Balcones Drive, Suite 100<br />
                  Austin, TX 78731
                </address>
              </div>

              <div className="detailItem">
                <div className="detailIcon" aria-hidden="true">📞</div>
                <div>
                  <div className="detailLabel">Phone</div>
                  <a href="tel:+12103909950">210.390.9950</a>
                </div>
              </div>

              <div className="detailItem">
                <div className="detailIcon" aria-hidden="true">✉️</div>
                <div>
                  <div className="detailLabel">Email</div>
                  <a href="mailto:hr@cosmosnextgen.com">hr@cosmosnextgen.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
