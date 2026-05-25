import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const DEMO_CREDENTIALS = {
  applicant: { email: "applicant@cosmos.com", password: "applicant123" },
  recruiter:  { email: "recruiter@cosmos.com",  password: "recruiter123"  },
  vendor:     { email: "vendor@cosmos.com",     password: "vendor123"     },
  admin:      { email: "admin@cosmos.com",      password: "admin123"      },
};

const ROLES = {
  applicant: { label: "Applicant", icon: "👤", desc: "Job seekers & candidates",      accent: "#ff6b4a" },
  recruiter:  { label: "Recruiter", icon: "🏢", desc: "Hiring managers & HR teams",    accent: "#13b8c8" },
  vendor:     { label: "Vendor",    icon: "🤝", desc: "Staffing & consulting firms",   accent: "#7ddfbb" },
  admin:      { label: "Admin",     icon: "🛡️", desc: "Platform administration",        accent: "#f7b733" },
};

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const current = ROLES[role] || ROLES.applicant;
  const activeRole = role || "applicant";

  const [form, setForm] = React.useState({ email: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    setError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const creds = DEMO_CREDENTIALS[activeRole];
    if (form.email !== creds.email || form.password !== creds.password) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (activeRole === "admin")          navigate("/dashboard/admin");
      else if (activeRole === "recruiter") navigate("/dashboard/recruiter");
      else if (activeRole === "vendor")    navigate("/dashboard/vendor");
      else                                 navigate("/dashboard/applicant");
    }, 800);
  };

  return (
    <main className="authPage">
      <div className="authCard">

        {/* ── Logo ── */}
        <a href="/#home" className="authLogo">
          <img src="/images/cosmos-logo-transparent.webp" alt="COSMOS" width="44" height="44" />
          <span className="authBrand">COSMOS</span>
        </a>

        {/* ── Role tabs ── */}
        <div className="roleTabs">
          {Object.entries(ROLES).filter(([key]) => key !== "admin").map(([key, r]) => (
            <button
              key={key}
              className={`roleTab ${activeRole === key ? "roleTabActive" : ""}`}
              style={activeRole === key ? { "--tab-color": r.accent } : {}}
              onClick={() => navigate(`/login/${key}`)}
            >
              <span className="roleTabIcon">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        {/* ── Heading ── */}
        <div className="authHeading">
          <h1 className="authTitle">Welcome back</h1>
          <p className="authSub">{current.desc}</p>
        </div>

        {/* ── Google login — Applicant only ── */}
        {activeRole === "applicant" && (
          <>
            <button type="button" className="googleBtn" onClick={() => alert("Google OAuth requires backend integration.")}>
              <svg className="googleIcon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">
              <span className="dividerLine" />
              <span className="dividerText">or sign in with email</span>
              <span className="dividerLine" />
            </div>
          </>
        )}

        {/* ── Form ── */}
        <form className="authForm" onSubmit={handleSubmit}>
          <div className="fieldGroup">
            <label className="fieldLabel" htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="fieldInput"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="fieldGroup">
            <div className="fieldLabelRow">
              <label className="fieldLabel" htmlFor="password">Password</label>
              <a href="#" className="fieldLink">Forgot password?</a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="fieldInput"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className="authError">{error}</div>}

          <button
            type="submit"
            className="authSubmit"
            disabled={loading}
            style={{ "--btn-color": current.accent }}
          >
            {loading ? "Signing in…" : `Sign in as ${current.label}`}
          </button>
        </form>

        {/* ── Demo hint ── */}
        <div className="demoHint">
          <span className="demoLabel">Demo credentials</span>
          <code className="demoCode">{DEMO_CREDENTIALS[activeRole].email}</code>
          <code className="demoCode">{DEMO_CREDENTIALS[activeRole].password}</code>
        </div>

        {/* ── Bottom link ── */}
        {activeRole === "applicant" && (
          <p className="authSwitch">
            Don't have an account?{" "}
            <Link to="/register" className="authSwitchLink">Create one</Link>
          </p>
        )}
        {(activeRole === "recruiter" || activeRole === "vendor") && (
          <p className="authSwitch">
            Don't have credentials?{" "}
            <Link to={`/request-access/${activeRole}`} className="authSwitchLink">Request Access →</Link>
          </p>
        )}
      </div>

      <style>{`
        .authPage {
          min-height: calc(100vh - 76px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          position: relative;
          overflow: hidden;
          background: #060914;
        }

        .authPage::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 900px 600px at 80% -10%, rgba(255,107,74,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 700px 500px at -10% 90%, rgba(19,184,200,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 500px 400px at 50% 50%, rgba(247,183,51,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .authPage::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
          pointer-events: none;
        }

        .authCard {
          width: 100%;
          max-width: 420px;
          padding: 40px 36px 36px;
          border-radius: 22px;
          background: rgba(10, 14, 28, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow:
            0 32px 80px rgba(0,0,0,0.6),
            0 0 0 1px rgba(255,255,255,0.04),
            inset 0 1px 0 rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          gap: 28px;
          position: relative;
          z-index: 1;
        }

        /* ── Logo ── */
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
          left: 2px;
          right: 2px;
          bottom: -7px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #0f766e);
        }

        /* ── Role tabs ── */
        .roleTabs {
          display: flex;
          gap: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 4px;
        }

        .roleTab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 38px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: rgba(245,245,245,0.45);
          font-size: 12.5px;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .roleTab:hover {
          color: rgba(245,245,245,0.8);
          background: rgba(255,255,255,0.05);
        }

        .roleTabActive {
          background: rgba(255,255,255,0.09);
          color: #f5f5f5;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
          border-bottom: 2px solid var(--tab-color, #ff6b4a);
        }

        .roleTabIcon {
          font-size: 15px;
        }

        /* ── Heading ── */
        .authHeading {
          text-align: center;
        }

        .authTitle {
          margin: 0 0 6px;
          font-size: 26px;
          font-weight: 900;
          color: #f5f5f5;
          letter-spacing: -0.02em;
        }

        .authSub {
          margin: 0;
          font-size: 13.5px;
          color: rgba(245,245,245,0.45);
        }

        /* ── Google button ── */
        .googleBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          height: 46px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: #f5f5f5;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          font-family: inherit;
        }

        .googleBtn:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-1px);
        }

        .googleIcon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        /* ── Divider ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dividerLine {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .dividerText {
          font-size: 11.5px;
          color: rgba(245,245,245,0.35);
          font-weight: 600;
          white-space: nowrap;
        }

        /* ── Form ── */
        .authForm {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .fieldGroup {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .fieldLabelRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fieldLabel {
          font-size: 13px;
          font-weight: 700;
          color: rgba(245,245,245,0.72);
        }

        .fieldLink {
          font-size: 12px;
          color: #f7b733;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.18s;
        }

        .fieldLink:hover { color: #ff6b4a; }

        .fieldInput {
          width: 100%;
          height: 46px;
          padding: 0 15px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.04);
          color: #f5f5f5;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .fieldInput::placeholder { color: rgba(245,245,245,0.25); }

        .fieldInput:focus {
          border-color: rgba(255,107,74,0.45);
          box-shadow: 0 0 0 3px rgba(255,107,74,0.09);
        }

        .authSubmit {
          height: 50px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, var(--btn-color, #ff6b4a), #f7b733);
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 14px 32px rgba(255,107,74,0.22);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 4px;
        }

        .authSubmit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 42px rgba(255,107,74,0.3);
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

        .demoHint {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(255,255,255,0.12);
        }

        .demoLabel {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(245,245,245,0.35);
        }

        .demoCode {
          font-size: 12.5px;
          font-family: monospace;
          color: rgba(245,245,245,0.6);
          background: rgba(255,255,255,0.05);
          padding: 3px 8px;
          border-radius: 6px;
          width: fit-content;
        }

        /* ── Register link ── */
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

        @media (max-width: 480px) {
          .authCard { padding: 30px 20px 28px; }
          .roleTab { font-size: 11.5px; gap: 4px; }
        }
      `}</style>
    </main>
  );
}
