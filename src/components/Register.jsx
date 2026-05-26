import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ROLES = {
  applicant: { label: "Applicant", icon: "👤", color: "#ff6b4a", desc: "Job seeker & candidate" },
  recruiter: { label: "Recruiter", icon: "🏢", color: "#13b8c8", desc: "Hiring manager & HR"   },
  vendor:    { label: "Vendor",    icon: "🤝", color: "#7ddfbb", desc: "Staffing & consulting"  },
};

export default function Register() {
  const navigate = useNavigate();
  const [form,         setForm]        = React.useState({ name: "", email: "", password: "", confirm: "" });
  const [selectedRole, setSelectedRole] = React.useState("applicant");
  const [loading,      setLoading]     = React.useState(false);
  const [error,        setError]       = React.useState("");
  const [submitted,    setSubmitted]   = React.useState(false);

  const handleChange = (e) => {
    setError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name, role: selectedRole },
        },
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const current = ROLES[selectedRole];

  return (
    <div className="regRoot">

      {/* ═══════════ LEFT HERO ═══════════ */}
      <div className="regHero">
        <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
        <div className="dotGrid"/>

        <div className="heroContent">
          {/* brand */}
          <a href="/" className="heroBrand">
            <img src="/images/cosmos-logo-transparent.webp" alt="" width="42" height="42"/>
            <span className="heroBrandName">COSMOS</span>
            <span className="heroBrandTag">NextGen</span>
          </a>

          <h1 className="heroTitle">Start your journey<br/><span className="heroAccent">with COSMOS.</span></h1>
          <p className="heroSub">Create your free applicant account and get matched with top opportunities across India.</p>

          {/* benefit list */}
          <ul className="benefitList">
            {[
              { icon: "🎯", t: "Smart Job Matching",    d: "AI-powered recommendations based on your skills" },
              { icon: "📄", t: "One-Click Apply",        d: "Apply to multiple jobs with your saved profile" },
              { icon: "📊", t: "Track Applications",     d: "Real-time status updates on every application"  },
              { icon: "🤝", t: "Direct Recruiter Access",d: "Connect directly with hiring managers"          },
            ].map((b) => (
              <li key={b.t} className="benefitItem">
                <span className="benefitIcon">{b.icon}</span>
                <div>
                  <p className="benefitTitle">{b.t}</p>
                  <p className="benefitDesc">{b.d}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* profile completion preview */}
          <div className="profileCard">
            <div className="profileCardTop">
              <div className="profileAvatar">A</div>
              <div>
                <p className="profileName">Your Profile</p>
                <p className="profileRole">Applicant · COSMOS NextGen</p>
              </div>
              <span className="profileBadge">Free</span>
            </div>
            <div className="profileBar">
              <div className="profileBarFill" style={{ width: "72%" }}/>
            </div>
            <p className="profileBarLabel">72% profile strength — complete after signup</p>
          </div>
        </div>
      </div>

      {/* ═══════════ RIGHT FORM ═══════════ */}
      <div className="regFormPanel">
        <div className="regFormCard">

          {/* ── Success state ── */}
          {submitted ? (
            <div className="successBlock">
              <div className="successIcon">✅</div>
              <h2 className="successTitle">Account Created!</h2>
              <p className="successDesc">
                Registered as <strong>{current.label}</strong> with <strong>{form.email}</strong>.
                {" "}Click the confirmation link sent to your email, then sign in.
              </p>
              <Link to={`/login/${selectedRole}`} className="submitBtn" style={{ display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none" }}>
                Go to Login →
              </Link>
            </div>
          ) : (<>

          {/* mobile logo */}
          <a href="/" className="mobileLogo">
            <img src="/images/cosmos-logo-transparent.webp" alt="" width="36" height="36"/>
            <span className="mobileBrand">COSMOS</span>
          </a>

          <div className="formHeader">
            <div className="formBadge" style={{ color: current.color, background: `${current.color}18`, border: `1px solid ${current.color}40` }}>
              {current.icon} {current.label} Registration
            </div>
            <h2 className="formTitle">Create your account</h2>
            <p className="formSub">Join COSMOS NextGen as {current.label.toLowerCase()}</p>
          </div>

          {/* role selector */}
          <div className="roleTabs">
            {Object.entries(ROLES).map(([key, r]) => (
              <button
                key={key}
                type="button"
                className={`roleTab ${selectedRole === key ? "roleTabOn" : ""}`}
                style={selectedRole === key ? { "--rc": r.color } : {}}
                onClick={() => { setSelectedRole(key); setError(""); }}
              >
                <span>{r.icon}</span>{r.label}
              </button>
            ))}
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="theForm">
            <div className="fRow">
              <div className="fGroup">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" autoComplete="name" required
                  placeholder="John Doe" value={form.name} onChange={handleChange}/>
              </div>
              <div className="fGroup">
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" required
                  placeholder="you@example.com" value={form.email} onChange={handleChange}/>
              </div>
            </div>

            <div className="fRow">
              <div className="fGroup">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required
                  placeholder="Min. 8 characters" value={form.password} onChange={handleChange}/>
              </div>
              <div className="fGroup">
                <label htmlFor="confirm">Confirm password</label>
                <input id="confirm" name="confirm" type="password" autoComplete="new-password" required
                  placeholder="Re-enter password" value={form.confirm} onChange={handleChange}/>
              </div>
            </div>

            {error && <div className="errBox">{error}</div>}

            <button type="submit" className="submitBtn" disabled={loading}
              style={{ background: `linear-gradient(135deg, ${current.color}, #f7b733)` }}>
              {loading ? <><span className="spinner"/>Creating account…</> : `Create ${current.label} Account →`}
            </button>
          </form>

          <p className="formFooter">
            Already have an account? <Link to="/login/applicant">Sign in →</Link>
          </p>

          <p className="termsNote">
            By creating an account you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
          </>)}
        </div>
      </div>

      <style>{`
        .regRoot {
          min-height: calc(100vh - 76px);
          display: flex;
          font-family: inherit;
        }

        /* ══ HERO ══ */
        .regHero {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 56px;
          background: #07091e;
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        /* photo background */
        .regHero::after {
          content: "";
          position: absolute; inset: 0;
          background-image: url('/images/cosmos-hero-visual.webp');
          background-size: cover;
          background-position: center;
          opacity: 0.15;
          pointer-events: none;
        }

        /* dark gradient overlay */
        .regHero::before {
          content: "";
          position: absolute; inset: 0;
          background:
            linear-gradient(140deg, rgba(7,9,30,0.93) 0%, rgba(10,13,36,0.86) 60%, rgba(6,9,20,0.91) 100%),
            radial-gradient(ellipse 600px 500px at 20% 10%, rgba(247,183,51,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 500px 400px at 90% 90%, rgba(255,107,74,0.14) 0%, transparent 55%);
          z-index: 1;
          pointer-events: none;
        }

        .orb { display: none; }

        @keyframes floatOrb {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-28px); }
        }

        .dotGrid {
          position: absolute; inset: 0; z-index: 2;
          background-image: radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 80%);
          pointer-events: none;
        }

        .heroContent {
          position: relative; z-index: 1;
          max-width: 520px; width: 100%;
          display: flex; flex-direction: column; gap: 28px;
        }

        .heroBrand {
          display: flex; align-items: center; gap: 12px; text-decoration: none;
        }
        .heroBrandName {
          font-size: 20px; font-weight: 950; letter-spacing: 0.07em;
          color: #f5f5f5; text-transform: uppercase; position: relative;
        }
        .heroBrandName::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -4px;
          height: 2.5px; border-radius: 999px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #0f766e);
        }
        .heroBrandTag {
          font-size: 10px; font-weight: 800; letter-spacing: 0.1em;
          text-transform: uppercase; color: #f7b733;
          background: rgba(247,183,51,0.12); border: 1px solid rgba(247,183,51,0.25);
          padding: 2px 8px; border-radius: 999px;
        }

        .heroTitle {
          margin: 0; font-size: clamp(30px,3.5vw,44px); font-weight: 950;
          line-height: 1.2; letter-spacing: -0.03em; color: #f5f5f5;
        }
        .heroAccent {
          background: linear-gradient(90deg, #f7b733, #ff6b4a);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .heroSub {
          margin: 0; font-size: 15px; line-height: 1.7;
          color: rgba(245,245,245,0.45); max-width: 400px;
        }

        /* benefits */
        .benefitList { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
        .benefitItem { display: flex; align-items: flex-start; gap: 14px; }
        .benefitIcon {
          font-size: 20px; width: 40px; height: 40px; flex-shrink: 0;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
        }
        .benefitTitle { margin: 0 0 2px; font-size: 13.5px; font-weight: 800; color: #f5f5f5; }
        .benefitDesc  { margin: 0; font-size: 12px; color: rgba(245,245,245,0.4); line-height: 1.5; }

        /* profile card */
        .profileCard {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 16px 18px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .profileCardTop { display: flex; align-items: center; gap: 12px; }
        .profileAvatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #ff6b4a, #f7b733);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 900; color: #fff; flex-shrink: 0;
        }
        .profileName { margin: 0 0 2px; font-size: 13px; font-weight: 800; color: #f5f5f5; }
        .profileRole { margin: 0; font-size: 11.5px; color: rgba(245,245,245,0.4); }
        .profileBadge {
          margin-left: auto; font-size: 10px; font-weight: 800;
          color: #7ddfbb; background: rgba(125,223,187,0.1);
          border: 1px solid rgba(125,223,187,0.25); padding: 3px 10px; border-radius: 999px;
        }
        .profileBar {
          height: 6px; border-radius: 999px; background: rgba(255,255,255,0.07); overflow: hidden;
        }
        .profileBarFill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733);
        }
        .profileBarLabel { margin: 0; font-size: 11px; color: rgba(245,245,245,0.35); }

        /* ══ FORM PANEL ══ */
        .regFormPanel {
          width: 500px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 40px;
          background: #080b1c;
          position: relative;
        }
        .regFormPanel::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #f7b733, #ff6b4a, #13b8c8);
        }

        .regFormCard { width: 100%; display: flex; flex-direction: column; gap: 20px; }

        .mobileLogo {
          display: none; align-items: center; gap: 10px;
          text-decoration: none; justify-content: center;
        }
        .mobileBrand {
          font-size: 20px; font-weight: 950; letter-spacing: 0.07em;
          color: #f5f5f5; text-transform: uppercase;
        }

        .formHeader { text-align: center; display: flex; flex-direction: column; gap: 8px; }
        .formBadge {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px;
          font-size: 12px; font-weight: 800;
          margin: 0 auto; transition: all 0.2s;
        }

        /* role tabs */
        .roleTabs {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 4px; gap: 2px;
        }
        .roleTab {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 5px; height: 38px; border-radius: 8px; border: none;
          background: transparent; color: rgba(245,245,245,0.4);
          font-size: 12px; font-weight: 750; cursor: pointer;
          transition: all 0.18s; font-family: inherit;
        }
        .roleTab:hover { color: rgba(245,245,245,0.75); background: rgba(255,255,255,0.05); }
        .roleTabOn {
          background: rgba(255,255,255,0.1) !important;
          color: #f5f5f5 !important;
          border-bottom: 2px solid var(--rc, #ff6b4a);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }
        .formTitle {
          margin: 0; font-size: 26px; font-weight: 900;
          letter-spacing: -0.025em; color: #f5f5f5;
        }
        .formSub { margin: 0; font-size: 13px; color: rgba(245,245,245,0.4); }

        /* google */
        .googleBtn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; height: 46px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04);
          color: #f5f5f5; font-size: 14px; font-weight: 700; cursor: pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .googleBtn:hover {
          background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }

        .divider { display: flex; align-items: center; gap: 12px; }
        .divider span { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider em { font-style: normal; font-size: 11.5px; color: rgba(245,245,245,0.3); font-weight: 600; white-space: nowrap; }

        /* form */
        .theForm { display: flex; flex-direction: column; gap: 14px; }
        .fRow { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .fGroup { display: flex; flex-direction: column; gap: 7px; }
        .fGroup label { font-size: 12.5px; font-weight: 700; color: rgba(245,245,245,0.65); }
        .fGroup input {
          height: 46px; padding: 0 14px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.09); background: rgba(255,255,255,0.05);
          color: #f5f5f5; font-size: 13.5px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit;
          width: 100%; box-sizing: border-box;
        }
        .fGroup input::placeholder { color: rgba(245,245,245,0.22); }
        .fGroup input:focus {
          border-color: rgba(247,183,51,0.5);
          box-shadow: 0 0 0 3px rgba(247,183,51,0.1);
          background: rgba(255,255,255,0.07);
        }

        .errBox {
          padding: 10px 14px; border-radius: 10px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
          color: #f87171; font-size: 13px; font-weight: 600;
        }

        .submitBtn {
          height: 50px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #f7b733, #ff6b4a);
          color: #fff; font-size: 15px; font-weight: 900; letter-spacing: 0.02em;
          cursor: pointer; box-shadow: 0 8px 28px rgba(255,107,74,0.3);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          font-family: inherit; display: flex; align-items: center;
          justify-content: center; gap: 8px; margin-top: 4px;
        }
        .submitBtn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(255,107,74,0.4);
        }
        .submitBtn:disabled { opacity: 0.55; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .formFooter {
          margin: 0; text-align: center; font-size: 13px; color: rgba(245,245,245,0.4);
        }
        .formFooter a { color: #f7b733; font-weight: 700; text-decoration: none; transition: color 0.15s; }
        .formFooter a:hover { color: #ff6b4a; }

        .termsNote {
          margin: 0; text-align: center; font-size: 11.5px;
          color: rgba(245,245,245,0.25); line-height: 1.6;
        }
        .termsNote a { color: rgba(245,245,245,0.4); text-decoration: underline; }

        /* success block */
        .successBlock {
          display: flex; flex-direction: column;
          align-items: center; gap: 16px;
          text-align: center; padding: 24px 0;
        }
        .successIcon { font-size: 52px; }
        .successTitle {
          margin: 0; font-size: 22px; font-weight: 900; color: #f5f5f5;
        }
        .successDesc {
          margin: 0; font-size: 14px; color: rgba(245,245,245,0.5);
          line-height: 1.65;
        }
        .successDesc strong { color: rgba(245,245,245,0.8); }

        /* responsive */
        @media (max-width: 960px) {
          .regRoot { flex-direction: column; }

          .regHero {
            display: flex;
            flex: none;
            width: 100%;
            padding: 48px 24px 40px;
            min-height: auto;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            align-items: flex-start;
          }
          .heroContent {
            max-width: 600px;
            margin: 0 auto;
            gap: 20px;
          }
          /* hide logo and profile card on mobile */
          .heroBrand { display: none; }
          .profileCard { display: none; }
          .benefitList { gap: 12px; }

          .regFormPanel {
            width: 100%; flex: none;
            border-left: none;
            padding: 40px 24px 48px;
            background: #080b1c;
            align-items: flex-start;
          }
          .regFormPanel::before { display: none; }
          .regFormCard { max-width: 520px; margin: 0 auto; }
          .mobileLogo { display: none; }
        }

        @media (max-width: 600px) {
          .regHero { padding: 36px 20px 32px; }
          .heroTitle { font-size: 26px; }
          .heroSub { font-size: 13.5px; }
          .benefitItem { gap: 10px; }
          .benefitIcon { width: 34px; height: 34px; font-size: 16px; }

          .regFormPanel { padding: 32px 20px 40px; }
          .fRow { grid-template-columns: 1fr; }
          .formTitle { font-size: 22px; }
          .fGroup input { height: 50px; font-size: 16px; }
          .submitBtn { height: 52px; font-size: 15px; }
          .googleBtn { height: 50px; font-size: 15px; }
        }

        @media (max-width: 380px) {
          .regHero { padding: 28px 16px 24px; }
          .regFormPanel { padding: 28px 16px 36px; }
          .formTitle { font-size: 20px; }
          .formBadge { font-size: 11px; }
          .termsNote { font-size: 10.5px; }
        }
      `}</style>
    </div>
  );
}
