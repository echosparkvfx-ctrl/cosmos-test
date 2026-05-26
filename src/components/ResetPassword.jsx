import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

async function getRoleDashboard() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "/login";
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role || user.user_metadata?.role || "applicant";
  if (role === "admin")     return "/dashboard/admin";
  if (role === "recruiter") return "/dashboard/recruiter";
  if (role === "vendor")    return "/dashboard/vendor";
  return "/dashboard/applicant";
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword]   = React.useState("");
  const [confirm,  setConfirm]    = React.useState("");
  const [loading,  setLoading]    = React.useState(false);
  const [error,    setError]      = React.useState("");
  const [done,     setDone]       = React.useState(false);
  const [ready,    setReady]      = React.useState(false);

  // Wait for Supabase to parse the hash and establish a session
  React.useEffect(() => {
    // Check if session already exists (e.g. page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setReady(true); return; }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ready) { setError("Auth session missing! Please click the link in your email again."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      const { error: upErr } = await supabase.auth.updateUser({ password });
      if (upErr) { setError(upErr.message); setLoading(false); return; }
      setDone(true);
      const destination = await getRoleDashboard();
      setTimeout(() => navigate(destination), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="rpPage">
      <div className="rpCard">
        {/* Logo */}
        <a href="/" className="rpLogo">
          <img src="/images/cosmos-logo-transparent.webp" alt="COSMOS" width="44" height="44" />
          <span className="rpBrand">COSMOS</span>
        </a>

        {done ? (
          <div className="rpSuccess">
            <div style={{ fontSize: 48 }}>✅</div>
            <h2 className="rpTitle">Password Updated!</h2>
            <p className="rpSub">Redirecting to your dashboard…</p>
          </div>
        ) : (
          <>
            <div className="rpHeading">
              <h1 className="rpTitle">Set New Password</h1>
              <p className="rpSub">Choose a strong password for your COSMOS account.</p>
            </div>

            <form className="rpForm" onSubmit={handleSubmit}>
              <div className="rpField">
                <label className="rpLabel">New Password</label>
                <input
                  type="password"
                  required
                  className="rpInput"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => { setError(""); setPassword(e.target.value); }}
                />
              </div>
              <div className="rpField">
                <label className="rpLabel">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="rpInput"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => { setError(""); setConfirm(e.target.value); }}
                />
              </div>

              {error && <div className="rpError">{error}</div>}

              {!ready && (
                <div className="rpWaiting">⏳ Verifying your link…</div>
              )}
              <button type="submit" className="rpSubmit" disabled={loading || !ready}>
                {loading ? "Saving…" : "Set Password & Login"}
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        .rpPage {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          background: #060914;
          position: relative;
          overflow: hidden;
        }

        .rpPage::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 900px 600px at 50% -5%, rgba(19,184,200,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 600px 500px at 10% 90%, rgba(125,223,187,0.1) 0%, transparent 55%);
          pointer-events: none;
        }

        .rpPage::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
          pointer-events: none;
        }

        .rpCard {
          width: 100%;
          max-width: 420px;
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

        .rpLogo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-decoration: none;
        }

        .rpBrand {
          position: relative;
          font-size: 26px;
          font-weight: 950;
          letter-spacing: 0.055em;
          color: #f5f5f5;
          text-transform: uppercase;
        }

        .rpBrand::after {
          content: "";
          position: absolute;
          left: 2px; right: 2px; bottom: -7px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff6b4a, #f7b733, #0f766e);
        }

        .rpHeading { text-align: center; }

        .rpTitle {
          margin: 0 0 8px;
          font-size: 22px;
          font-weight: 900;
          color: #f5f5f5;
        }

        .rpSub {
          margin: 0;
          font-size: 13px;
          color: rgba(245,245,245,0.45);
          line-height: 1.6;
        }

        .rpForm {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rpField {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .rpLabel {
          font-size: 12.5px;
          font-weight: 700;
          color: rgba(245,245,245,0.65);
        }

        .rpInput {
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

        .rpInput::placeholder { color: rgba(245,245,245,0.22); }

        .rpInput:focus {
          border-color: rgba(19,184,200,0.5);
          box-shadow: 0 0 0 3px rgba(19,184,200,0.1);
        }

        .rpError {
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
          font-size: 13px;
          font-weight: 600;
        }

        .rpSubmit {
          height: 50px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #13b8c8, #f7b733);
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          font-family: inherit;
          margin-top: 4px;
        }

        .rpSubmit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 42px rgba(19,184,200,0.3);
        }

        .rpSubmit:disabled { opacity: 0.6; cursor: not-allowed; }

        .rpWaiting {
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(19,184,200,0.08);
          border: 1px solid rgba(19,184,200,0.2);
          color: rgba(19,184,200,0.9);
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }

        .rpSuccess {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
          padding: 12px 0;
        }
      `}</style>
    </main>
  );
}
