import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import NotificationBell from "./NotificationBell.jsx";

export default function AppNavbar({ role, userName = "User", userId = null, onTabChange }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate(`/login/${role}`);
  };

  const roleLabel = role === "recruiter" ? "Recruiter" : role === "vendor" ? "Vendor" : role === "admin" ? "Admin" : "Applicant";
  const roleColor = role === "recruiter" ? "#13b8c8" : role === "vendor" ? "#7ddfbb" : role === "admin" ? "#ff6b4a" : "#a78bfa";

  const navLinks = {
    applicant: [
      { label: "Dashboard",       tab: "overview" },
      { label: "Browse Jobs",     tab: "browse" },
      { label: "My Applications", tab: "applications" },
      { label: "Profile",         tab: "profile" },
    ],
    recruiter: [
      { label: "Dashboard",  tab: "overview" },
      { label: "My Jobs",    tab: "jobs" },
      { label: "Pipeline",   tab: "pipeline" },
      { label: "Post Job",   tab: "post-job" },
    ],
    vendor: [
      { label: "Dashboard",    tab: "overview" },
      { label: "Jobs",         tab: "jobs" },
      { label: "Submissions",  tab: "submissions" },
    ],
  };

  return (
    <header className="appNav">
      <div className="appNavInner">
        <a href="/" className="appNavLogo">
          <img src="/images/cosmos-logo-transparent.webp" alt="COSMOS" width="38" height="38" />
          <span className="appNavBrand">COSMOS</span>
        </a>

        <nav className="appNavLinks">
          {(navLinks[role] || []).map(l => (
            <button key={l.tab} className="appNavLink"
              onClick={() => onTabChange ? onTabChange(l.tab) : navigate(`/dashboard/${role}`)}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="appNavRight" ref={menuRef}>
          <div className="appNavRoleBadge" style={{ "--rc": roleColor }}>{roleLabel}</div>

          {userId && <NotificationBell userId={userId} />}

          <button className="appNavAvatar" onClick={() => setMenuOpen(v => !v)} style={{"--rc":roleColor}}>
            <span className="avatarInitial">{userName.charAt(0).toUpperCase()}</span>
          </button>

          {menuOpen && (
            <div className="appNavDropdown">
              <div className="dropUser">
                <span className="dropUserName">{userName}</span>
                <span className="dropUserRole" style={{ color: roleColor }}>{roleLabel}</span>
              </div>
              <div className="dropDivider" />
              {onTabChange && <button className="dropItem" onClick={() => { setMenuOpen(false); onTabChange("profile"); }}>My Profile</button>}
              <div className="dropDivider" />
              <button className="dropItem dropSignOut" onClick={signOut}>Sign out</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .appNav{position:sticky;top:0;z-index:50;height:64px;background:rgba(10,14,26,0.97);border-bottom:1px solid rgba(255,255,255,0.07);box-shadow:0 8px 32px rgba(0,0,0,0.35);backdrop-filter:blur(12px);}
        .appNavInner{max-width:1280px;margin:0 auto;padding:0 24px;height:100%;display:flex;align-items:center;gap:28px;}
        .appNavLogo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;}
        .appNavBrand{font-size:18px;font-weight:950;letter-spacing:0.055em;color:#f5f5f5;text-transform:uppercase;}
        .appNavLinks{display:flex;align-items:center;gap:2px;flex:1;}
        .appNavLink{padding:6px 12px;border-radius:8px;font-size:13px;font-weight:700;color:rgba(245,245,245,0.55);text-decoration:none;background:none;border:none;cursor:pointer;font-family:inherit;transition:color 0.18s,background 0.18s;}
        .appNavLink:hover{color:#f5f5f5;background:rgba(255,255,255,0.06);}
        .appNavRight{display:flex;align-items:center;gap:10px;position:relative;margin-left:auto;}
        .appNavRoleBadge{padding:4px 12px;border-radius:999px;font-size:11.5px;font-weight:800;color:var(--rc);background:color-mix(in srgb,var(--rc) 12%,transparent);border:1px solid color-mix(in srgb,var(--rc) 25%,transparent);}
        .appNavAvatar{width:36px;height:36px;border-radius:50%;border:2px solid color-mix(in srgb,var(--rc) 40%,transparent);background:linear-gradient(135deg,var(--rc),color-mix(in srgb,var(--rc) 60%,#fff));cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.18s;}
        .appNavAvatar:hover{transform:scale(1.06);}
        .avatarInitial{font-size:14px;font-weight:900;color:#fff;line-height:1;}
        .appNavDropdown{position:absolute;top:calc(100% + 10px);right:0;min-width:190px;background:rgba(12,16,28,0.99);border:1px solid rgba(255,255,255,0.1);border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,0.5);overflow:hidden;animation:fadeDown 0.16s ease;z-index:100;}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .dropUser{padding:14px 16px 10px;display:flex;flex-direction:column;gap:2px;}
        .dropUserName{font-size:13px;font-weight:800;color:#f5f5f5;}
        .dropUserRole{font-size:11px;font-weight:700;}
        .dropDivider{height:1px;background:rgba(255,255,255,0.07);margin:4px 0;}
        .dropItem{display:block;width:100%;padding:10px 16px;font-size:13px;font-weight:600;color:rgba(245,245,245,0.7);text-decoration:none;background:none;border:none;text-align:left;cursor:pointer;transition:background 0.15s,color 0.15s;font-family:inherit;}
        .dropItem:hover{background:rgba(255,255,255,0.05);color:#f5f5f5;}
        .dropSignOut{color:#f87171;}
        .dropSignOut:hover{background:rgba(239,68,68,0.08);color:#fca5a5;}
        @media(max-width:640px){.appNavLinks{display:none;}.appNavRoleBadge{display:none;}}
      `}</style>
    </header>
  );
}
