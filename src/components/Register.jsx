import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    setError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard/applicant");
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

        {/* ── Applicant-only badge ── */}
        <div className="regBadge">
          <span className="regBadgeIcon">👤</span>
          <span className="regBadgeText">Applicant Registration</span>
        </div>

        {/* ── Heading ── */}
        <div className="authHeading">
          <h1 className="authTitle">Create account</h1>
          <p className="authSub">Join COSMOS NextGen today</p>
        </div>

        {/* ── Google login ── */}
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
          <span className="dividerText">or register with email</span>
          <span className="dividerLine" />
        </div>

        {/* ── Form ── */}
        <form className="authForm" onSubmit={handleSubmit}>
          <div className="fieldGroup">
            <label className="fieldLabel" htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="John Doe"
              className="fieldInput"
              value={form.name}
              onChange={handleChange}
            />
          </div>

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
            <label className="fieldLabel" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Min. 8 characters"
              className="fieldInput"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="fieldGroup">
            <label className="fieldLabel" htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Re-enter password"
              className="fieldInput"
              value={form.confirm}
              onChange={handleChange}
            />
          </div>

          {error && <div className="authError">{error}</div>}

          <button type="submit" className="authSubmit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        {/* ── Sign in link ── */}
        <p className="authSwitch">
          Already have an account?{" "}
          <Link to="/login/applicant" className="authSwitchLink">Sign in</Link>
        </p>
      </div>

      <style>{`
        .authPage {
          min-height: calc(100vh - 76px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          background:
            radial-gradient(ellipse 800px 500px at 30% 10%, rgba(247,183,51,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 600px 400px at 80% 80%, rgba(255,107,74,0.05) 0%, transparent 60%),
            #0a0e1a;
        }

        .authCard {
          width: 100%;
          max-width: 420px;
          padding: 40px 36px 36px;
          border-radius: 22px;
          background: rgba(15, 19, 32, 0.97);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03);
          display: flex;
          flex-direction: column;
          gap: 24px;
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

        /* ── Applicant badge ── */
        .regBadge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 10px;
          background: rgba(255, 107, 74, 0.08);
          border: 1px solid rgba(255, 107, 74, 0.2);
        }

        .regBadgeIcon { font-size: 17px; }

        .regBadgeText {
          font-size: 13px;
          font-weight: 800;
          color: #ff6b4a;
          letter-spacing: 0.02em;
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
          gap: 16px;
        }

        .fieldGroup {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .fieldLabel {
          font-size: 13px;
          font-weight: 700;
          color: rgba(245,245,245,0.72);
        }

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
          border-color: rgba(247,183,51,0.45);
          box-shadow: 0 0 0 3px rgba(247,183,51,0.09);
        }

        .authSubmit {
          height: 50px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #f7b733, #ffb86b, #ff6b4a);
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

        /* ── Sign in link ── */
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
        }
      `}</style>
    </main>
  );
}
