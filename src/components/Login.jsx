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

      {/* ── Left panel — illustration ── */}
      <div className="authIllustration">
        <div className="illusInner">

          {/* Logo */}
          <a href="/" className="illusLogo">
            <img src="/images/cosmos-logo-transparent.webp" alt="COSMOS" width="48" height="48" />
            <span className="illusLogoText">COSMOS</span>
          </a>

          {/* Headline */}
          <div className="illusHeadline">
            <h2 className="illusTitle">Your career universe<br/>starts here.</h2>
            <p className="illusDesc">Connecting top talent with world-class companies through intelligent staffing solutions.</p>
          </div>

          {/* Floating stat cards */}
          <div className="illusCards">
            <div className="illusCard illusCard1">
              <span className="illusCardNum">12,400+</span>
              <span className="illusCardLbl">Active Jobs</span>
            </div>
            <div className="illusCard illusCard2">
              <span className="illusCardNum">3,200+</span>
              <span className="illusCardLbl">Companies</span>
            </div>
            <div className="illusCard illusCard3">
              <span className="illusCardNum">98%</span>
              <span className="illusCardLbl">Placement Rate</span>
            </div>
          </div>

          {/* SVG illustration — abstract people & network */}
          <svg className="illusSvg" viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Connection lines */}
            <line x1="100" y1="160" x2="250" y2="80"  stroke="rgba(255,107,74,0.3)"  strokeWidth="1.5" strokeDasharray="6 4"/>
            <line x1="250" y1="80"  x2="400" y2="140" stroke="rgba(19,184,200,0.3)"  strokeWidth="1.5" strokeDasharray="6 4"/>
            <line x1="100" y1="160" x2="220" y2="240" stroke="rgba(125,223,187,0.3)" strokeWidth="1.5" strokeDasharray="6 4"/>
            <line x1="220" y1="240" x2="380" y2="220" stroke="rgba(247,183,51,0.3)"  strokeWidth="1.5" strokeDasharray="6 4"/>
            <line x1="400" y1="140" x2="380" y2="220" stroke="rgba(19,184,200,0.2)"  strokeWidth="1.5" strokeDasharray="6 4"/>
            <line x1="250" y1="80"  x2="220" y2="240" stroke="rgba(255,107,74,0.15)" strokeWidth="1"   strokeDasharray="4 6"/>

            {/* Person nodes */}
            {/* Center top */}
            <circle cx="250" cy="80" r="28" fill="rgba(255,107,74,0.12)" stroke="rgba(255,107,74,0.5)" strokeWidth="1.5"/>
            <circle cx="250" cy="70" r="10" fill="rgba(255,107,74,0.6)"/>
            <path d="M232 98 Q250 88 268 98 L268 104 Q250 96 232 104Z" fill="rgba(255,107,74,0.5)"/>

            {/* Left */}
            <circle cx="100" cy="160" r="24" fill="rgba(19,184,200,0.12)" stroke="rgba(19,184,200,0.5)" strokeWidth="1.5"/>
            <circle cx="100" cy="151" r="9"  fill="rgba(19,184,200,0.6)"/>
            <path d="M84 176 Q100 167 116 176 L116 181 Q100 174 84 181Z" fill="rgba(19,184,200,0.5)"/>

            {/* Right top */}
            <circle cx="400" cy="140" r="24" fill="rgba(125,223,187,0.12)" stroke="rgba(125,223,187,0.5)" strokeWidth="1.5"/>
            <circle cx="400" cy="131" r="9"  fill="rgba(125,223,187,0.6)"/>
            <path d="M384 156 Q400 147 416 156 L416 161 Q400 154 384 161Z" fill="rgba(125,223,187,0.5)"/>

            {/* Bottom left */}
            <circle cx="220" cy="240" r="22" fill="rgba(247,183,51,0.12)" stroke="rgba(247,183,51,0.5)" strokeWidth="1.5"/>
            <circle cx="220" cy="231" r="8"  fill="rgba(247,183,51,0.6)"/>
            <path d="M205 254 Q220 246 235 254 L235 259 Q220 252 205 259Z" fill="rgba(247,183,51,0.5)"/>

            {/* Bottom right */}
            <circle cx="380" cy="220" r="22" fill="rgba(255,107,74,0.12)" stroke="rgba(255,107,74,0.4)" strokeWidth="1.5"/>
            <circle cx="380" cy="211" r="8"  fill="rgba(255,107,74,0.5)"/>
            <path d="M365 234 Q380 226 395 234 L395 239 Q380 232 365 239Z" fill="rgba(255,107,74,0.45)"/>

            {/* Decorative rings */}
            <circle cx="250" cy="80"  r="40" stroke="rgba(255,107,74,0.1)"  strokeWidth="1" fill="none"/>
            <circle cx="100" cy="160" r="36" stroke="rgba(19,184,200,0.1)"  strokeWidth="1" fill="none"/>
            <circle cx="400" cy="140" r="36" stroke="rgba(125,223,187,0.1)" strokeWidth="1" fill="none"/>

            {/* Floating dots */}
            <circle cx="170" cy="110" r="3" fill="rgba(255,107,74,0.4)"/>
            <circle cx="320" cy="100" r="3" fill="rgba(19,184,200,0.4)"/>
            <circle cx="150" cy="200" r="2" fill="rgba(247,183,51,0.4)"/>
            <circle cx="310" cy="200" r="2" fill="rgba(125,223,187,0.4)"/>
            <circle cx="450" cy="180" r="2" fill="rgba(255,107,74,0.3)"/>
            <circle cx="60"  cy="120" r="2" fill="rgba(19,184,200,0.3)"/>
          </svg>

          {/* Bottom tagline */}
          <p className="illusFooter">Trusted by 500+ companies across India & beyond</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="authFormPanel">
        <div className="authCard">

          {/* ── Logo (mobile only) ── */}
          <a href="/#home" className="authLogoMobile">
            <img src="/images/cosmos-logo-transparent.webp" alt="COSMOS" width="36" height="36" />
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
                id="email" name="email" type="email" autoComplete="email" required
                placeholder="you@example.com" className="fieldInput"
                value={form.email} onChange={handleChange}
              />
            </div>

            <div className="fieldGroup">
              <div className="fieldLabelRow">
                <label className="fieldLabel" htmlFor="password">Password</label>
                <a href="#" className="fieldLink">Forgot password?</a>
              </div>
              <input
                id="password" name="password" type="password" autoComplete="current-password" required
                placeholder="••••••••" className="fieldInput"
                value={form.password} onChange={handleChange}
              />
            </div>

            {error && <div className="authError">{error}</div>}

            <button type="submit" className="authSubmit" disabled={loading} style={{ "--btn-color": current.accent }}>
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
      </div>

      <style>{`
        .authPage {
          min-height: calc(100vh - 76px);
          display: flex;
          align-items: stretch;
          background: #060914;
          overflow: hidden;
        }

        /* ══════════════════════════════
           LEFT ILLUSTRATION PANEL
        ══════════════════════════════ */
        .authIllustration {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 48px;
          background:
            radial-gradient(ellipse 700px 500px at 60% 20%, rgba(255,107,74,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 500px 600px at 10% 80%, rgba(19,184,200,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 400px 300px at 90% 90%, rgba(247,183,51,0.08) 0%, transparent 60%),
            linear-gradient(160deg, #080c1a 0%, #060914 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }

        .authIllustration::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 80%);
        }

        .illusInner {
          position: relative;
          z-index: 1;
          max-width: 520px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .illusLogo {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
        }

        .illusLogoText {
          font-size: 22px;
          font-weight: 950;
          letter-spacing: 0.06em;
          color: #f5f5f5;
          text-transform: uppercase;
          position: relative;
        }

        .illusLogoText::after {
          content: "";
          position: absolute;
          left: 2px; right: 2px; bottom: -5px;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #0f766e);
        }

        .illusHeadline {}

        .illusTitle {
          margin: 0 0 14px;
          font-size: 36px;
          font-weight: 950;
          line-height: 1.2;
          letter-spacing: -0.03em;
          color: #f5f5f5;
          background: linear-gradient(135deg, #ffffff 0%, rgba(245,245,245,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .illusDesc {
          margin: 0;
          font-size: 15px;
          color: rgba(245,245,245,0.45);
          line-height: 1.7;
          max-width: 380px;
        }

        /* Stat cards */
        .illusCards {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .illusCard {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 14px 20px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          transition: transform 0.2s, border-color 0.2s;
        }

        .illusCard:hover { transform: translateY(-2px); }

        .illusCard1 { border-top: 2px solid rgba(255,107,74,0.5); }
        .illusCard2 { border-top: 2px solid rgba(19,184,200,0.5); }
        .illusCard3 { border-top: 2px solid rgba(125,223,187,0.5); }

        .illusCardNum {
          font-size: 20px;
          font-weight: 950;
          color: #f5f5f5;
          letter-spacing: -0.02em;
        }

        .illusCardLbl {
          font-size: 11.5px;
          color: rgba(245,245,245,0.45);
          font-weight: 600;
        }

        /* SVG illustration */
        .illusSvg {
          width: 100%;
          max-width: 500px;
          height: auto;
          filter: drop-shadow(0 0 30px rgba(255,107,74,0.08));
        }

        .illusFooter {
          margin: 0;
          font-size: 12.5px;
          color: rgba(245,245,245,0.3);
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* ══════════════════════════════
           RIGHT FORM PANEL
        ══════════════════════════════ */
        .authFormPanel {
          width: 480px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background:
            radial-gradient(ellipse 400px 300px at 80% 10%, rgba(255,107,74,0.06) 0%, transparent 60%),
            #07091499;
        }

        .authCard {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Mobile logo — hidden on desktop */
        .authLogoMobile {
          display: none;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          justify-content: center;
        }

        /* ── Role tabs ── */
        .roleTabs {
          display: flex;
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
          font-family: inherit;
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

        .roleTabIcon { font-size: 15px; }

        /* ── Heading ── */
        .authHeading { text-align: center; }

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

        .googleIcon { width: 20px; height: 20px; flex-shrink: 0; }

        /* ── Divider ── */
        .divider { display: flex; align-items: center; gap: 12px; }
        .dividerLine { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .dividerText { font-size: 11.5px; color: rgba(245,245,245,0.35); font-weight: 600; white-space: nowrap; }

        /* ── Form ── */
        .authForm { display: flex; flex-direction: column; gap: 18px; }
        .fieldGroup { display: flex; flex-direction: column; gap: 7px; }
        .fieldLabelRow { display: flex; align-items: center; justify-content: space-between; }

        .fieldLabel { font-size: 13px; font-weight: 700; color: rgba(245,245,245,0.72); }

        .fieldLink { font-size: 12px; color: #f7b733; text-decoration: none; font-weight: 600; transition: color 0.18s; }
        .fieldLink:hover { color: #ff6b4a; }

        .fieldInput {
          width: 100%;
          height: 46px;
          padding: 0 15px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.05);
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
          font-family: inherit;
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

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .authIllustration { display: none; }
          .authFormPanel {
            width: 100%;
            padding: 48px 20px;
            background: #060914;
          }
          .authLogoMobile { display: flex; }
          .authCard { max-width: 420px; margin: 0 auto; }
        }

        @media (max-width: 480px) {
          .authFormPanel { padding: 32px 16px; }
          .roleTab { font-size: 11.5px; gap: 4px; }
        }
      `}</style>
    </main>
  );
}
