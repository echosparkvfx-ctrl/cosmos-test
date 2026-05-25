import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AppNavbar({ role, userName = "User" }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleLabel = role === "recruiter" ? "Recruiter" : role === "vendor" ? "Vendor" : "Applicant";
  const roleColor = role === "recruiter" ? "#13b8c8" : role === "vendor" ? "#7ddfbb" : "#ff6b4a";

  return (
    <header className="appNav">
      <div className="appNavInner">
        {/* Logo */}
        <a href="/" className="appNavLogo">
          <img
            src="/images/cosmos-logo-transparent.webp"
            alt="COSMOS"
            width="38"
            height="38"
          />
          <span className="appNavBrand">COSMOS</span>
        </a>

        {/* Nav links */}
        <nav className="appNavLinks">
          <Link
            to={`/dashboard/${role}`}
            className="appNavLink"
          >
            Dashboard
          </Link>
            {role === "applicant" && (
            <>
              <a href="#" className="appNavLink">Browse Jobs</a>
              <a href="#" className="appNavLink">My Applications</a>
              <Link to="/profile/applicant" className="appNavLink">Profile</Link>
            </>
          )}
          {role === "recruiter" && (
            <>
              <a href="#" className="appNavLink">Job Posts</a>
              <a href="#" className="appNavLink">Applicants</a>
            </>
          )}
          {role === "vendor" && (
            <>
              <a href="#" className="appNavLink">Contracts</a>
              <a href="#" className="appNavLink">Candidates</a>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="appNavRight" ref={menuRef}>
          <div className="appNavRoleBadge" style={{ "--rc": roleColor }}>
            {roleLabel}
          </div>

          <button
            className="appNavAvatar"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="User menu"
          >
            <span className="avatarInitial">
              {userName.charAt(0).toUpperCase()}
            </span>
          </button>

          {menuOpen && (
            <div className="appNavDropdown">
              <div className="dropUser">
                <span className="dropUserName">{userName}</span>
                <span className="dropUserRole" style={{ color: roleColor }}>{roleLabel}</span>
              </div>
              <div className="dropDivider" />
              <a href="#" className="dropItem">Profile</a>
              <a href="#" className="dropItem">Settings</a>
              <div className="dropDivider" />
              <button
                className="dropItem dropSignOut"
                onClick={() => navigate(`/login/${role}`)}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .appNav {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 64px;
          background: rgba(10, 14, 26, 0.95);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        }

        .appNavInner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .appNavLogo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .appNavBrand {
          font-size: 18px;
          font-weight: 950;
          letter-spacing: 0.055em;
          color: #f5f5f5;
          text-transform: uppercase;
        }

        .appNavLinks {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }

        .appNavLink {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(245,245,245,0.6);
          text-decoration: none;
          transition: color 0.18s, background 0.18s;
        }

        .appNavLink:hover {
          color: #f5f5f5;
          background: rgba(255,255,255,0.06);
        }

        .appNavRight {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          margin-left: auto;
        }

        .appNavRoleBadge {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 800;
          color: var(--rc);
          background: color-mix(in srgb, var(--rc) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--rc) 25%, transparent);
        }

        .appNavAvatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.12);
          background: linear-gradient(135deg, #f7b733, #ff6b4a);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.18s, transform 0.18s;
        }

        .appNavAvatar:hover {
          border-color: rgba(247,183,51,0.5);
          transform: scale(1.05);
        }

        .avatarInitial {
          font-size: 14px;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .appNavDropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 190px;
          background: rgba(15,19,32,0.98);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          overflow: hidden;
          animation: fadeDown 0.16s ease;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dropUser {
          padding: 14px 16px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dropUserName {
          font-size: 13px;
          font-weight: 800;
          color: #f5f5f5;
        }

        .dropUserRole {
          font-size: 11px;
          font-weight: 700;
        }

        .dropDivider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 4px 0;
        }

        .dropItem {
          display: block;
          width: 100%;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(245,245,245,0.7);
          text-decoration: none;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }

        .dropItem:hover {
          background: rgba(255,255,255,0.05);
          color: #f5f5f5;
        }

        .dropSignOut {
          color: #f87171;
        }

        .dropSignOut:hover {
          background: rgba(239,68,68,0.08);
          color: #fca5a5;
        }

        @media (max-width: 640px) {
          .appNavLinks { display: none; }
          .appNavRoleBadge { display: none; }
        }
      `}</style>
    </header>
  );
}
