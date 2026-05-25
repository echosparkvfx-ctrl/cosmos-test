import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const ROLES = {
  recruiter: { label: "Recruiter", icon: "🏢", color: "#13b8c8", desc: "Hiring managers & HR teams" },
  vendor:    { label: "Vendor",    icon: "🤝", color: "#7ddfbb", desc: "Staffing & consulting firms" },
};

export default function RequestAccess() {
  const { role } = useParams();
  const navigate = useNavigate();
  const current = ROLES[role] || ROLES.recruiter;

  const [form, setForm] = React.useState({
    name: "", company: "", email: "", phone: "", reason: "",
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <main className="authPage">
      <div className="authCard">

        {/* Logo */}
        <a href="/#home" className="authLogo">
          <img src="/images/cosmos-logo-transparent.webp" alt="COSMOS" width="44" height="44" />
          <span className="authBrand">COSMOS</span>
        </a>

        {submitted ? (
          /* ── Success state ── */
          <div className="successBlock">
            <div className="successIcon">✅</div>
            <h2 className="successTitle">Request Submitted!</h2>
            <p className="successDesc">
              Your access request has been sent to the COSMOS admin team. You'll receive an email with your login credentials once approved — usually within 1–2 business days.
            </p>
            <Link to={`/login/${role}`} className="authSubmit" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            {/* Role badge */}
            <div className="reqBadge" style={{ "--rc": current.color }}>
              <span>{current.icon}</span>
              <span className="reqBadgeText">Request {current.label} Access</span>
            </div>

            {/* Heading */}
            <div className="authHeading">
              <h1 className="authTitle">Get Access</h1>
              <p className="authSub">Fill in your details — our team will review and send your credentials within 1–2 business days.</p>
            </div>

            {/* Form */}
            <form className="authForm" onSubmit={handleSubmit}>
              <div className="formRow">
                <div className="fieldGroup">
                  <label className="fieldLabel">Full Name</label>
                  <input name="name" required className="fieldInput" placeholder="Jane Smith" value={form.name} onChange={handleChange} />
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel">Company Name</label>
                  <input name="company" required className="fieldInput" placeholder="Acme Staffing Ltd." value={form.company} onChange={handleChange} />
                </div>
              </div>

              <div className="formRow">
                <div className="fieldGroup">
                  <label className="fieldLabel">Work Email</label>
                  <input name="email" type="email" required className="fieldInput" placeholder="jane@company.com" value={form.email} onChange={handleChange} />
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel">Phone</label>
                  <input name="phone" className="fieldInput" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="fieldGroup">
                <label className="fieldLabel">Why do you need access?</label>
                <textarea name="reason" required className="fieldTextarea" rows={3} placeholder={`Briefly describe your role and how you plan to use COSMOS as a ${current.label}...`} value={form.reason} onChange={handleChange} />
              </div>

              {error && <div className="authError">{error}</div>}

              <button type="submit" className="authSubmit" disabled={loading} style={{ "--btn-color": current.color }}>
                {loading ? "Submitting…" : "Submit Request"}
              </button>
            </form>

            <p className="authSwitch">
              Already have credentials?{" "}
              <Link to={`/login/${role}`} className="authSwitchLink">Sign in</Link>
            </p>
          </>
        )}
      </div>

      <style>{`
        .authPage {
          min-height: calc(100vh - 76px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          background: #060914;
          position: relative;
          overflow: hidden;
        }

        .authPage::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 900px 600px at 50% -5%, rgba(19,184,200,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 600px 500px at 10% 90%, rgba(125,223,187,0.1) 0%, transparent 55%),
            radial-gradient(ellipse 500px 400px at 90% 80%, rgba(247,183,51,0.07) 0%, transparent 60%);
          pointer-events: none;
        }

        .authPage::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
          pointer-events: none;
        }

        .authCard {
          width: 100%;
          max-width: 480px;
          padding: 40px 36px 36px;
          border-radius: 22px;
          background: rgba(10,14,28,0.85);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .authLogo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-decoration: none;
          padding-bottom: 4px;
        }

        .authBrand {
          position: relative;
          font-size: 26px;
          font-weight: 950;
          letter-spacing: 0.055em;
          line-height: 1;
          color: #f5f5f5;
          text-transform: uppercase;
        }

        .authBrand::after {
          content: "";
          position: absolute;
          left: 2px; right: 2px; bottom: -7px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #0f766e);
        }

        /* Badge */
        .reqBadge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 12px;
          background: color-mix(in srgb, var(--rc) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--rc) 25%, transparent);
        }

        .reqBadgeText {
          font-size: 14px;
          font-weight: 800;
          color: var(--rc);
        }

        .authHeading { text-align: center; }

        .authTitle {
          margin: 0 0 8px;
          font-size: 24px;
          font-weight: 900;
          color: #f5f5f5;
          letter-spacing: -0.02em;
        }

        .authSub {
          margin: 0;
          font-size: 13px;
          color: rgba(245,245,245,0.45);
          line-height: 1.6;
        }

        /* Form */
        .authForm {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .formRow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .fieldGroup {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .fieldLabel {
          font-size: 12.5px;
          font-weight: 700;
          color: rgba(245,245,245,0.65);
        }

        .fieldInput, .fieldTextarea {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.04);
          color: #f5f5f5;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }

        .fieldTextarea {
          height: auto;
          padding: 11px 14px;
          resize: vertical;
        }

        .fieldInput::placeholder, .fieldTextarea::placeholder {
          color: rgba(245,245,245,0.22);
        }

        .fieldInput:focus, .fieldTextarea:focus {
          border-color: color-mix(in srgb, var(--btn-color, #13b8c8) 50%, transparent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--btn-color, #13b8c8) 10%, transparent);
        }

        .authSubmit {
          height: 50px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, var(--btn-color, #13b8c8), #f7b733);
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 14px 32px rgba(19,184,200,0.22);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          font-family: inherit;
          margin-top: 4px;
        }

        .authSubmit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 42px rgba(19,184,200,0.3);
        }

        .authSubmit:disabled { opacity: 0.6; cursor: not-allowed; }

        .authError {
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
          font-size: 13px;
          font-weight: 600;
        }

        .authSwitch {
          margin: 0;
          text-align: center;
          font-size: 13px;
          color: rgba(245,245,245,0.45);
        }

        .authSwitchLink {
          color: #f7b733;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.18s;
        }

        .authSwitchLink:hover { color: #ff6b4a; }

        /* Success */
        .successBlock {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
          padding: 12px 0;
        }

        .successIcon { font-size: 48px; }

        .successTitle {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
          color: #f5f5f5;
        }

        .successDesc {
          margin: 0;
          font-size: 13.5px;
          color: rgba(245,245,245,0.5);
          line-height: 1.65;
        }

        @media (max-width: 480px) {
          .authCard { padding: 30px 20px 28px; }
          .formRow { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
