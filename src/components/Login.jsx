import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const DEMO_CREDENTIALS = {
  applicant: { email: "applicant@cosmos.com", password: "applicant123" },
  recruiter:  { email: "recruiter@cosmos.com",  password: "recruiter123" },
  vendor:     { email: "vendor@cosmos.com",     password: "vendor123"    },
  admin:      { email: "admin@cosmos.com",      password: "admin123"     },
};

const ROLES = {
  applicant: { label: "Applicant", icon: "👤", desc: "Job seekers & candidates",   accent: "#ff6b4a" },
  recruiter: { label: "Recruiter", icon: "🏢", desc: "Hiring managers & HR teams", accent: "#13b8c8" },
  vendor:    { label: "Vendor",    icon: "🤝", desc: "Staffing & consulting firms", accent: "#7ddfbb" },
  admin:     { label: "Admin",     icon: "🛡️", desc: "Platform administration",     accent: "#f7b733" },
};

export default function Login() {
  const { role } = useParams();
  const navigate  = useNavigate();
  const current   = ROLES[role] || ROLES.applicant;
  const activeRole = role || "applicant";

  const [form,    setForm]    = React.useState({ email: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  const [error,   setError]   = React.useState("");

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
    <div className="loginRoot">

      {/* ═══════════════════════════════════════
          LEFT — hero panel
      ═══════════════════════════════════════ */}
      <div className="heroPanel">

        {/* animated orbs */}
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        {/* dot grid */}
        <div className="dotGrid" />

        <div className="heroContent">

          {/* brand */}
          <div className="heroBrand">
            <img src="/images/cosmos-logo-transparent.webp" alt="" width="42" height="42" />
            <span className="heroBrandName">COSMOS</span>
            <span className="heroBrandTag">NextGen</span>
          </div>

          {/* headline */}
          <h1 className="heroHeadline">
            Find. Hire.<br />
            <span className="heroAccent">Grow Together.</span>
          </h1>
          <p className="heroSub">
            India's most trusted staffing &amp; consultancy platform — connecting talent with opportunity at scale.
          </p>

          {/* stats row */}
          <div className="heroStats">
            {[
              { n: "50K+",  l: "Candidates" },
              { n: "3.2K+", l: "Companies"  },
              { n: "98%",   l: "Placed"     },
            ].map((s) => (
              <div className="heroStat" key={s.l}>
                <span className="heroStatN">{s.n}</span>
                <span className="heroStatL">{s.l}</span>
              </div>
            ))}
          </div>

          {/* illustration — abstract SVG dashboard mockup */}
          <div className="mockupWrap">
            <svg viewBox="0 0 480 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="mockupSvg">
              {/* card background */}
              <rect x="0" y="0" width="480" height="260" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

              {/* top bar */}
              <rect x="0" y="0" width="480" height="40" rx="16" fill="rgba(255,255,255,0.05)"/>
              <circle cx="24" cy="20" r="5" fill="rgba(255,107,74,0.6)"/>
              <circle cx="40" cy="20" r="5" fill="rgba(247,183,51,0.6)"/>
              <circle cx="56" cy="20" r="5" fill="rgba(125,223,187,0.6)"/>
              <rect x="80" y="14" width="120" height="12" rx="6" fill="rgba(255,255,255,0.07)"/>
              <rect x="380" y="12" width="80" height="16" rx="8" fill="rgba(255,107,74,0.2)" stroke="rgba(255,107,74,0.4)" strokeWidth="1"/>

              {/* sidebar */}
              <rect x="0" y="40" width="80" height="220" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              {[60,88,116,144].map((y,i) => (
                <rect key={y} x="14" y={y} width="52" height="10" rx="5"
                  fill={i===0 ? "rgba(255,107,74,0.5)" : "rgba(255,255,255,0.1)"}/>
              ))}

              {/* main content area */}
              {/* bar chart */}
              {[
                { x:100, h:80, c:"rgba(255,107,74,0.7)"  },
                { x:135, h:120,c:"rgba(19,184,200,0.7)"  },
                { x:170, h:60, c:"rgba(125,223,187,0.7)" },
                { x:205, h:100,c:"rgba(247,183,51,0.7)"  },
                { x:240, h:140,c:"rgba(255,107,74,0.5)"  },
                { x:275, h:90, c:"rgba(19,184,200,0.5)"  },
              ].map((b,i) => (
                <rect key={i} x={b.x} y={220-b.h} width="24" height={b.h} rx="4" fill={b.c}/>
              ))}

              {/* line chart on right */}
              <polyline
                points="310,180 330,150 355,160 375,120 400,130 425,90 450,100"
                stroke="rgba(19,184,200,0.8)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <polyline
                points="310,180 330,150 355,160 375,120 400,130 425,90 450,100 450,220 310,220"
                fill="rgba(19,184,200,0.08)"/>

              {/* data points */}
              {[[330,150],[375,120],[425,90]].map(([cx,cy],i) => (
                <circle key={i} cx={cx} cy={cy} r="4" fill="#13b8c8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
              ))}

              {/* stat pills */}
              <rect x="100" y="52" width="90" height="32" rx="8" fill="rgba(255,107,74,0.12)" stroke="rgba(255,107,74,0.25)" strokeWidth="1"/>
              <text x="145" y="70" textAnchor="middle" fill="rgba(255,107,74,0.9)" fontSize="11" fontWeight="700">↑ 24% Hired</text>

              <rect x="205" y="52" width="90" height="32" rx="8" fill="rgba(19,184,200,0.12)" stroke="rgba(19,184,200,0.25)" strokeWidth="1"/>
              <text x="250" y="70" textAnchor="middle" fill="rgba(19,184,200,0.9)" fontSize="11" fontWeight="700">348 Active</text>

              <rect x="310" y="52" width="90" height="32" rx="8" fill="rgba(125,223,187,0.12)" stroke="rgba(125,223,187,0.25)" strokeWidth="1"/>
              <text x="355" y="70" textAnchor="middle" fill="rgba(125,223,187,0.9)" fontSize="11" fontWeight="700">98% Placed</text>
            </svg>
          </div>

          {/* trust row */}
          <div className="trustRow">
            <div className="trustAvatars">
              {["#ff6b4a","#13b8c8","#7ddfbb","#f7b733"].map((c,i) => (
                <div key={i} className="trustAvatar" style={{ background: c, marginLeft: i ? -10 : 0 }}/>
              ))}
            </div>
            <span className="trustText">Trusted by <strong>500+</strong> companies across India</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT — login form
      ═══════════════════════════════════════ */}
      <div className="formPanel">
        <div className="formCard">

          {/* mobile logo */}
          <a href="/" className="mobileLogo">
            <img src="/images/cosmos-logo-transparent.webp" alt="" width="36" height="36"/>
            <span className="mobileBrand">COSMOS</span>
          </a>

          <div className="formHeader">
            <h2 className="formTitle">Sign in</h2>
            <p className="formSub">Welcome back to COSMOS NextGen</p>
          </div>

          {/* role switcher */}
          <div className="roleTabs">
            {Object.entries(ROLES).filter(([k]) => k !== "admin").map(([key, r]) => (
              <button
                key={key}
                className={`roleTab ${activeRole === key ? "roleTabOn" : ""}`}
                style={activeRole === key ? { "--ac": r.accent } : {}}
                onClick={() => navigate(`/login/${key}`)}
              >
                <span>{r.icon}</span>{r.label}
              </button>
            ))}
          </div>

          {/* google — applicant only */}
          {activeRole === "applicant" && (
            <>
              <button className="googleBtn" onClick={() => alert("Google OAuth requires backend integration.")}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <div className="divider"><span/><em>or</em><span/></div>
            </>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="theForm">
            <div className="fGroup">
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required
                placeholder="you@company.com" value={form.email} onChange={handleChange}/>
            </div>
            <div className="fGroup">
              <div className="fLabelRow">
                <label htmlFor="password">Password</label>
                <a href="#">Forgot password?</a>
              </div>
              <input id="password" name="password" type="password" autoComplete="current-password" required
                placeholder="••••••••" value={form.password} onChange={handleChange}/>
            </div>

            {error && <div className="errBox">{error}</div>}

            <button type="submit" className="submitBtn" disabled={loading}
              style={{ "--ac": current.accent }}>
              {loading
                ? <><span className="spinner"/>Signing in…</>
                : `Sign in as ${current.label}`}
            </button>
          </form>

          {/* demo hint */}
          <div className="demoBox">
            <span className="demoTitle">Demo credentials</span>
            <div className="demoCreds">
              <code>{DEMO_CREDENTIALS[activeRole].email}</code>
              <code>{DEMO_CREDENTIALS[activeRole].password}</code>
            </div>
          </div>

          {/* footer link */}
          {activeRole === "applicant" && (
            <p className="formFooter">No account? <Link to="/register">Create one →</Link></p>
          )}
          {(activeRole === "recruiter" || activeRole === "vendor") && (
            <p className="formFooter">No credentials? <Link to={`/request-access/${activeRole}`}>Request Access →</Link></p>
          )}
        </div>
      </div>

      <style>{`
        /* ── Root ── */
        .loginRoot {
          min-height: calc(100vh - 76px);
          display: flex;
          font-family: inherit;
        }

        /* ══════════════
           HERO PANEL
        ══════════════ */
        .heroPanel {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 56px;
          background: #07091e;
        }

        /* photo background */
        .heroPanel::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url('/images/cosmos-talent-visual.webp');
          background-size: cover;
          background-position: center;
          opacity: 0.18;
          pointer-events: none;
        }

        /* dark overlay on top of photo */
        .heroPanel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(7,9,30,0.92) 0%, rgba(10,13,36,0.85) 60%, rgba(6,9,20,0.9) 100%),
            radial-gradient(ellipse 600px 500px at 80% 10%, rgba(255,107,74,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 500px 400px at 10% 90%, rgba(19,184,200,0.15) 0%, transparent 55%);
          z-index: 1;
          pointer-events: none;
        }

        /* dot grid */
        .dotGrid {
          position: absolute;
          inset: 0;
          z-index: 2;
          background-image: radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 80%);
          pointer-events: none;
        }

        /* remove old orbs — not needed with photo */
        .orb { display: none; }

        @keyframes floatOrb {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-30px) scale(1.05); }
        }

        .heroContent {
          position: relative;
          z-index: 3;
          max-width: 540px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* brand */
        .heroBrand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .heroBrandName {
          font-size: 20px;
          font-weight: 950;
          letter-spacing: 0.07em;
          color: #f5f5f5;
          text-transform: uppercase;
          position: relative;
        }
        .heroBrandName::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -4px;
          height: 2.5px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #0f766e);
        }
        .heroBrandTag {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f7b733;
          background: rgba(247,183,51,0.12);
          border: 1px solid rgba(247,183,51,0.25);
          padding: 2px 8px;
          border-radius: 999px;
        }

        /* headline */
        .heroHeadline {
          margin: 0;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 950;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #f5f5f5;
        }
        .heroAccent {
          background: linear-gradient(90deg, #ff6b4a, #f7b733);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .heroSub {
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(245,245,245,0.45);
          max-width: 400px;
        }

        /* stats */
        .heroStats {
          display: flex;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          width: fit-content;
        }
        .heroStat {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 16px 28px;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .heroStat:last-child { border-right: none; }
        .heroStatN {
          font-size: 22px;
          font-weight: 950;
          color: #f5f5f5;
          letter-spacing: -0.02em;
        }
        .heroStatL {
          font-size: 11.5px;
          color: rgba(245,245,245,0.4);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* mockup */
        .mockupWrap {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03);
          background: rgba(10,14,28,0.8);
        }
        .mockupSvg { display: block; width: 100%; }

        /* trust row */
        .trustRow {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .trustAvatars { display: flex; }
        .trustAvatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 2px solid #07091e;
          flex-shrink: 0;
        }
        .trustText {
          font-size: 13px;
          color: rgba(245,245,245,0.4);
        }
        .trustText strong { color: rgba(245,245,245,0.7); }

        /* ══════════════
           FORM PANEL
        ══════════════ */
        .formPanel {
          width: 460px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: #080b1c;
          border-left: 1px solid rgba(255,255,255,0.06);
          position: relative;
        }

        .formPanel::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #13b8c8);
        }

        .formCard {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* mobile logo */
        .mobileLogo {
          display: none;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          justify-content: center;
          margin-bottom: 4px;
        }
        .mobileBrand {
          font-size: 20px;
          font-weight: 950;
          letter-spacing: 0.07em;
          color: #f5f5f5;
          text-transform: uppercase;
        }

        .formHeader { text-align: center; }
        .formTitle {
          margin: 0 0 6px;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.025em;
          color: #f5f5f5;
        }
        .formSub {
          margin: 0;
          font-size: 13.5px;
          color: rgba(245,245,245,0.4);
        }

        /* role tabs */
        .roleTabs {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 4px;
          gap: 2px;
        }
        .roleTab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          height: 38px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: rgba(245,245,245,0.4);
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
        }
        .roleTab:hover { color: rgba(245,245,245,0.75); background: rgba(255,255,255,0.05); }
        .roleTabOn {
          background: rgba(255,255,255,0.1) !important;
          color: #f5f5f5 !important;
          border-bottom: 2px solid var(--ac, #ff6b4a);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }

        /* google */
        .googleBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          height: 46px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #f5f5f5;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .googleBtn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }

        /* divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .divider span {
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .divider em {
          font-style: normal;
          font-size: 11.5px;
          color: rgba(245,245,245,0.3);
          font-weight: 600;
        }

        /* form fields */
        .theForm { display: flex; flex-direction: column; gap: 16px; }
        .fGroup { display: flex; flex-direction: column; gap: 7px; }
        .fLabelRow { display: flex; justify-content: space-between; align-items: center; }

        .fGroup label {
          font-size: 12.5px;
          font-weight: 700;
          color: rgba(245,245,245,0.65);
        }
        .fLabelRow a {
          font-size: 12px;
          color: #f7b733;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.15s;
        }
        .fLabelRow a:hover { color: #ff6b4a; }

        .fGroup input {
          height: 46px;
          padding: 0 15px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.05);
          color: #f5f5f5;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
        }
        .fGroup input::placeholder { color: rgba(245,245,245,0.22); }
        .fGroup input:focus {
          border-color: rgba(255,107,74,0.5);
          box-shadow: 0 0 0 3px rgba(255,107,74,0.1);
          background: rgba(255,255,255,0.07);
        }

        .errBox {
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          font-size: 13px;
          font-weight: 600;
        }

        .submitBtn {
          height: 50px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, var(--ac, #ff6b4a) 0%, color-mix(in srgb, var(--ac,#ff6b4a) 60%, #f7b733) 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 8px 28px color-mix(in srgb, var(--ac,#ff6b4a) 40%, transparent);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
        }
        .submitBtn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px color-mix(in srgb, var(--ac,#ff6b4a) 50%, transparent);
        }
        .submitBtn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* spinner */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* demo box */
        .demoBox {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .demoTitle {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(245,245,245,0.3);
        }
        .demoCreds { display: flex; flex-direction: column; gap: 4px; }
        .demoCreds code {
          font-size: 12px;
          font-family: monospace;
          color: rgba(245,245,245,0.55);
          background: rgba(255,255,255,0.05);
          padding: 3px 8px;
          border-radius: 6px;
          width: fit-content;
        }

        .formFooter {
          margin: 0;
          text-align: center;
          font-size: 13px;
          color: rgba(245,245,245,0.4);
        }
        .formFooter a {
          color: #f7b733;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.15s;
        }
        .formFooter a:hover { color: #ff6b4a; }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .heroPanel { display: none; }
          .formPanel {
            width: 100%;
            border-left: none;
            padding: 48px 32px;
            background:
              radial-gradient(ellipse 700px 500px at 80% -10%, rgba(255,107,74,0.14) 0%, transparent 60%),
              radial-gradient(ellipse 600px 400px at -10% 90%, rgba(19,184,200,0.1) 0%, transparent 55%),
              #060914;
          }
          .formPanel::before { display: none; }
          .formCard { max-width: 440px; margin: 0 auto; }
          .mobileLogo { display: flex; }
        }

        @media (max-width: 600px) {
          .formPanel { padding: 36px 20px; }
          .roleTabs { gap: 2px; }
          .roleTab { font-size: 11px; gap: 3px; padding: 0 4px; }
          .formTitle { font-size: 24px; }
          .fGroup input { height: 50px; font-size: 16px; } /* prevent iOS zoom */
          .submitBtn { height: 52px; font-size: 15px; }
          .googleBtn { height: 50px; font-size: 15px; }
        }

        @media (max-width: 380px) {
          .formPanel { padding: 28px 16px; }
          .roleTabs { flex-wrap: wrap; }
          .roleTab { flex: 0 0 calc(50% - 2px); height: 36px; font-size: 11px; }
          .formTitle { font-size: 22px; }
          .demoBox { padding: 10px 12px; }
          .demoCreds code { font-size: 11px; }
        }
      `}</style>
    </div>
  );
}
