import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const roleColor   = { recruiter: "#13b8c8", vendor: "#7ddfbb" };
const statusColor = { pending: "#f7b733", approved: "#7ddfbb", rejected: "#ef4444" };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [requests,  setRequests]  = React.useState([]);
  const [users,     setUsers]     = React.useState([]);
  const [tab,       setTab]       = React.useState("stats");
  const [menuOpen,  setMenuOpen]  = React.useState(false);
  const [actionMsg, setActionMsg] = React.useState("");

  // Load requests and users from Supabase
  React.useEffect(() => {
    fetchRequests();
    fetchUsers();
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("access_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRequests(data);
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .in("role", ["recruiter", "vendor"])
      .order("created_at", { ascending: false });
    if (data) setUsers(data);
  };

  const pending  = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");
  const rejected = requests.filter((r) => r.status === "rejected");

  const approve = async (req) => {
    setActionMsg("Sending invite...");
    try {
      // Call edge function to invite user via email
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ email: req.email, role: req.role, request_id: req.id }),
        }
      );
      const result = await res.json();
      if (result.error) { setActionMsg(`Error: ${result.error}`); return; }
      setActionMsg(`✅ Invite sent to ${req.email}`);
      setRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: "approved" } : r));
    } catch (err) {
      setActionMsg("Failed to send invite. Try again.");
    }
    setTimeout(() => setActionMsg(""), 4000);
  };

  const reject = async (id) => {
    await supabase.from("access_requests").update({ status: "rejected" }).eq("id", id);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r));
  };

  return (
    <main className="adminPage">
      {/* ── App navbar ── */}
      <header className="adminNav">
        <div className="adminNavInner">
          <a href="/" className="adminNavLogo">
            <img src="/images/cosmos-logo-transparent.webp" alt="COSMOS" width="36" height="36" />
            <span className="adminNavBrand">COSMOS</span>
          </a>
          <span className="adminNavTitle">Admin Panel</span>
          <div className="adminNavRight" style={{ position: "relative" }}>
            {pending.length > 0 && (
              <button className="notifBadge" title="Pending requests" onClick={() => setTab("requests")}>
                🔔 <span className="notifCount">{pending.length}</span>
              </button>
            )}
            <button className="adminAvatar" onClick={() => setMenuOpen((v) => !v)}>A</button>
            {menuOpen && (
              <div className="adminDropdown">
                <div className="dropUser"><span className="dropUserName">Admin</span><span className="dropUserRole">Super Admin</span></div>
                <div className="dropDivider" />
                <button className="dropItem dropSignOut" onClick={() => navigate("/login/admin")}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Action toast */}
      {actionMsg && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"#1a2035", border:"1px solid rgba(255,255,255,0.12)", color:"#f5f5f5", padding:"12px 20px", borderRadius:12, zIndex:9999, fontSize:14, fontWeight:600, boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
          {actionMsg}
        </div>
      )}

<div className="adminBody">
        {/* ── Sidebar ── */}
        <aside className="adminSidebar">
          <nav className="sideNav">
            <button className={`sideLink ${tab === "stats" ? "sideLinkActive" : ""}`} onClick={() => setTab("stats")}>
              <span>📊</span> Overview
            </button>
            <button className={`sideLink ${tab === "requests" ? "sideLinkActive" : ""}`} onClick={() => setTab("requests")}>
              <span>📥</span> Access Requests
              {pending.length > 0 && <span className="sideBadge">{pending.length}</span>}
            </button>
            <button className={`sideLink ${tab === "users" ? "sideLinkActive" : ""}`} onClick={() => setTab("users")}>
              <span>👥</span> Manage Users
            </button>
          </nav>
        </aside>

        {/* ── Content ── */}
        <div className="adminContent">

          {/* ── Overview tab ── */}
          {tab === "stats" && (
            <div className="tabPanel">
              {/* Header row */}
              <div className="tabTitleRow">
                <h2 className="tabTitle">Overview</h2>
                <div className="tabCtas">
                  <button className="ctaBtn ctaBtnPrimary" onClick={() => setTab("requests")}>
                    📥 Review Requests {pending.length > 0 && <span className="ctaBadge">{pending.length}</span>}
                  </button>
                  <button className="ctaBtn ctaBtnSecondary" onClick={() => setTab("users")}>
                    👥 Manage Users
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="statsGrid">
                {[
                  { label: "Pending Requests",  value: pending.length,  icon: "⏳", color: "#f7b733", action: () => setTab("requests") },
                  { label: "Active Users",      value: users.length,    icon: "✅", color: "#7ddfbb", action: () => setTab("users") },
                  { label: "Total Recruiters",  value: users.filter(u => u.role === "recruiter").length, icon: "🏢", color: "#13b8c8", action: () => setTab("users") },
                  { label: "Total Vendors",     value: users.filter(u => u.role === "vendor").length,    icon: "🤝", color: "#ff6b4a", action: () => setTab("users") },
                ].map((s) => (
                  <button className="statCard" key={s.label} style={{ "--cc": s.color }} onClick={s.action}>
                    <span className="statIcon">{s.icon}</span>
                    <span className="statValue">{s.value}</span>
                    <span className="statLabel">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Recent activity */}
              <div className="activityPanel">
                <div className="panelHead">
                  <h3 className="panelTitle">Recent Activity</h3>
                  <button className="panelLink" onClick={() => setTab("requests")}>View all →</button>
                </div>
                <div className="activityList">
                  {requests.slice(0, 5).map((r) => (
                    <div className="activityItem" key={r.id}>
                      <div className="activityAvatar" style={{ "--rc": roleColor[r.role] || "#f7b733" }}>{r.name.charAt(0)}</div>
                      <div className="activityInfo">
                        <span className="activityName">{r.name} <span className="activityCompany">from {r.company}</span></span>
                        <span className="activityTime">requested {r.role} access · {r.submitted_at}</span>
                      </div>
                      <span className="statusPill" style={{ "--sc": statusColor[r.status] }}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Requests tab ── */}
          {tab === "requests" && (
            <div className="tabPanel">
              <h2 className="tabTitle">Access Requests</h2>

              {pending.length > 0 && (
                <div className="requestSection">
                  <h3 className="sectionLabel">⏳ Pending ({pending.length})</h3>
                  <div className="requestList">
                    {pending.map((r) => (
                      <div className="requestCard" key={r.id}>
                        <div className="requestTop">
                          <div className="requestInfo">
                            <div className="requestAvatar" style={{ "--rc": roleColor[r.role] || "#f7b733" }}>{r.name.charAt(0)}</div>
                            <div>
                              <p className="requestName">{r.name}</p>
                              <p className="requestCompany">{r.company}</p>
                              <p className="requestEmail">{r.email}</p>
                            </div>
                          </div>
                          <div className="requestMeta">
                            <span className="rolePill" style={{ "--rc": roleColor[r.role] || "#f7b733" }}>{r.role}</span>
                            <span className="requestTime">{r.submitted_at}</span>
                          </div>
                        </div>
                        <p className="requestReason">"{r.reason}"</p>
                        <div className="requestActions">
                          <button className="approveBtn" onClick={() => approve(r)}>✓ Approve & Send Invite</button>
                          <button className="rejectBtn"  onClick={() => reject(r.id)}>✗ Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {approved.length > 0 && (
                <div className="requestSection">
                  <h3 className="sectionLabel">✅ Approved ({approved.length})</h3>
                  <div className="requestList">
                    {approved.map((r) => (
                      <div className="requestCard requestCardMuted" key={r.id}>
                        <div className="requestTop">
                          <div className="requestInfo">
                            <div className="requestAvatar" style={{ "--rc": roleColor[r.role] || "#7ddfbb" }}>{r.name.charAt(0)}</div>
                            <div>
                              <p className="requestName">{r.name}</p>
                              <p className="requestCompany">{r.company} · {r.email}</p>
                            </div>
                          </div>
                          <div className="requestMeta">
                            <span className="rolePill" style={{ "--rc": roleColor[r.role] || "#7ddfbb" }}>{r.role}</span>
                            <span className="statusPill" style={{ "--sc": "#7ddfbb" }}>Approved</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rejected.length > 0 && (
                <div className="requestSection">
                  <h3 className="sectionLabel">✗ Rejected ({rejected.length})</h3>
                  <div className="requestList">
                    {rejected.map((r) => (
                      <div className="requestCard requestCardMuted" key={r.id}>
                        <div className="requestTop">
                          <div className="requestInfo">
                            <div className="requestAvatar" style={{ "--rc": "#ef4444" }}>{r.name.charAt(0)}</div>
                            <div>
                              <p className="requestName">{r.name}</p>
                              <p className="requestCompany">{r.company} · {r.email}</p>
                            </div>
                          </div>
                          <div className="requestMeta">
                            <span className="rolePill" style={{ "--rc": roleColor[r.role] || "#ef4444" }}>{r.role}</span>
                            <span className="statusPill" style={{ "--sc": "#ef4444" }}>Rejected</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pending.length === 0 && approved.length === 0 && rejected.length === 0 && (
                <div className="emptyState">📭 No requests yet.</div>
              )}
            </div>
          )}

          {/* ── Users tab ── */}
          {tab === "users" && (
            <div className="tabPanel">
              <h2 className="tabTitle">Active Users</h2>
              <div className="tableWrap">
                <table className="adminTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.email}>
                        <td className="tdName">{u.name}</td>
                        <td className="tdMuted">{u.email}</td>
                        <td><span className="rolePill" style={{ "--rc": roleColor[u.role] || "#f7b733" }}>{u.role}</span></td>
                        <td><span className="statusPill" style={{ "--sc": "#7ddfbb" }}>active</span></td>
                        <td className="tdMuted">{u.created_at ? u.created_at.slice(0, 10) : "—"}</td>
                        <td><button className="tableActionBtn">Revoke</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .adminPage {
          min-height: 100vh;
          background: #07090f;
          display: flex;
          flex-direction: column;
        }

        /* ── Navbar ── */
        .adminNav {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 64px;
          background: rgba(10,14,26,0.97);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }

        .adminNavInner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .adminNavLogo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .adminNavBrand {
          font-size: 18px;
          font-weight: 950;
          color: #f5f5f5;
          letter-spacing: 0.055em;
          text-transform: uppercase;
        }

        .adminNavTitle {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(245,245,245,0.3);
          padding: 3px 10px;
          border-radius: 6px;
          background: rgba(255,107,74,0.1);
          border: 1px solid rgba(255,107,74,0.2);
          color: #ff6b4a;
        }

        .adminNavRight {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .notifBadge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #f7b733;
          cursor: pointer;
        }

        .notifCount {
          background: #f7b733;
          color: #0a0e1a;
          font-size: 10px;
          font-weight: 900;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .adminAvatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6b4a, #f7b733);
          border: none;
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
        }

        .adminDropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 170px;
          background: rgba(15,19,32,0.98);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          overflow: hidden;
          z-index: 100;
        }

        .dropUser { padding: 12px 16px; display: flex; flex-direction: column; gap: 2px; }
        .dropUserName { font-size: 13px; font-weight: 800; color: #f5f5f5; }
        .dropUserRole { font-size: 11px; color: #ff6b4a; font-weight: 700; }
        .dropDivider { height: 1px; background: rgba(255,255,255,0.07); }
        .dropItem { display: block; width: 100%; padding: 10px 16px; font-size: 13px; font-weight: 600; background: none; border: none; text-align: left; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .dropSignOut { color: #f87171; }
        .dropSignOut:hover { background: rgba(239,68,68,0.08); }

        /* ── Layout ── */
        .adminBody {
          display: flex;
          flex: 1;
          max-width: 1300px;
          margin: 0 auto;
          width: 100%;
          padding: 0 24px;
          gap: 28px;
          padding-top: 32px;
          padding-bottom: 60px;
        }

        /* ── Sidebar ── */
        .adminSidebar {
          width: 220px;
          flex-shrink: 0;
          position: sticky;
          top: 84px;
          align-self: start;
        }

        .sideNav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(15,19,32,0.9);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 10px;
        }

        .sideLink {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 10px;
          border: none;
          background: none;
          color: rgba(245,245,245,0.55);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-align: left;
          transition: all 0.18s;
          font-family: inherit;
          position: relative;
        }

        .sideLink:hover { color: #f5f5f5; background: rgba(255,255,255,0.05); }

        .sideLinkActive {
          color: #f5f5f5 !important;
          background: rgba(255,107,74,0.1) !important;
          box-shadow: inset 2px 0 0 #ff6b4a;
        }

        .sideBadge {
          margin-left: auto;
          background: #f7b733;
          color: #0a0e1a;
          font-size: 10px;
          font-weight: 900;
          min-width: 18px;
          height: 18px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
        }

        /* ── Content ── */
        .adminContent { flex: 1; min-width: 0; }

        .tabPanel { display: flex; flex-direction: column; gap: 24px; }

        .tabTitle {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
          color: #f5f5f5;
          letter-spacing: -0.02em;
        }

        /* Tab title row */
        .tabTitleRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .tabCtas {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ctaBtn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 40px;
          padding: 0 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          border: none;
          font-family: inherit;
          transition: transform 0.18s, box-shadow 0.18s;
        }

        .ctaBtnPrimary {
          background: linear-gradient(135deg, #f7b733, #ff6b4a);
          color: #fff;
          box-shadow: 0 8px 22px rgba(255,107,74,0.22);
        }

        .ctaBtnPrimary:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 28px rgba(255,107,74,0.32);
        }

        .ctaBtnSecondary {
          background: rgba(255,255,255,0.06);
          color: rgba(245,245,245,0.75);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .ctaBtnSecondary:hover {
          background: rgba(255,255,255,0.1);
          color: #f5f5f5;
        }

        .ctaBadge {
          background: #fff;
          color: #ff6b4a;
          font-size: 10px;
          font-weight: 900;
          min-width: 18px;
          height: 18px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        /* Stat cards clickable */
        .statCard {
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
        }

        .statCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
          border-color: var(--cc);
        }

        /* Activity panel */
        .activityPanel {
          background: rgba(15,19,32,0.9);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }

        .panelHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .panelTitle {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
          color: #f5f5f5;
        }

        .panelLink {
          font-size: 12px;
          font-weight: 700;
          color: #f7b733;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.18s;
        }

        .panelLink:hover { color: #ff6b4a; }

        .activityList {
          display: flex;
          flex-direction: column;
        }

        .activityItem {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }

        .activityItem:last-child { border-bottom: none; }
        .activityItem:hover { background: rgba(255,255,255,0.02); }

        .activityAvatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--rc) 16%, transparent);
          border: 1px solid color-mix(in srgb, var(--rc) 28%, transparent);
          color: var(--rc);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .activityInfo {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .activityName {
          font-size: 13px;
          font-weight: 750;
          color: #f5f5f5;
        }

        .activityCompany {
          font-weight: 500;
          color: rgba(245,245,245,0.45);
        }

        .activityTime {
          font-size: 11.5px;
          color: rgba(245,245,245,0.35);
        }

        /* Notif button */
        .notifBadge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #f7b733;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background 0.18s;
        }

        .notifBadge:hover { background: rgba(247,183,51,0.1); }

        /* Stats */
        .statsGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .statCard {
          padding: 22px 18px;
          border-radius: 14px;
          background: rgba(15,19,32,0.9);
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 3px solid var(--cc);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .statIcon { font-size: 24px; }
        .statValue { font-size: 30px; font-weight: 950; color: #f5f5f5; line-height: 1; }
        .statLabel { font-size: 12px; color: rgba(245,245,245,0.45); font-weight: 600; }

        /* Requests */
        .requestSection { display: flex; flex-direction: column; gap: 12px; }

        .sectionLabel {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: rgba(245,245,245,0.45);
          text-transform: uppercase;
        }

        .requestList { display: flex; flex-direction: column; gap: 12px; }

        .requestCard {
          background: rgba(15,19,32,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .requestCardMuted { opacity: 0.65; }

        .requestTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .requestInfo { display: flex; align-items: center; gap: 14px; }

        .requestAvatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--rc) 18%, transparent);
          border: 1px solid color-mix(in srgb, var(--rc) 30%, transparent);
          color: var(--rc);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .requestName { margin: 0 0 2px; font-size: 14px; font-weight: 800; color: #f5f5f5; }
        .requestCompany { margin: 0 0 2px; font-size: 12.5px; color: rgba(245,245,245,0.55); }
        .requestEmail { margin: 0; font-size: 12px; color: rgba(245,245,245,0.35); }

        .requestMeta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .requestTime { font-size: 11.5px; color: rgba(245,245,245,0.3); }

        .requestReason {
          margin: 0;
          font-size: 13px;
          color: rgba(245,245,245,0.5);
          font-style: italic;
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          border-left: 2px solid rgba(255,255,255,0.1);
        }

        .requestActions { display: flex; gap: 10px; flex-wrap: wrap; }

        .approveBtn {
          height: 38px;
          padding: 0 18px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #7ddfbb, #13b8c8);
          color: #0a0e1a;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          font-family: inherit;
        }

        .approveBtn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(125,223,187,0.3); }

        .rejectBtn {
          height: 38px;
          padding: 0 18px;
          border-radius: 999px;
          border: 1px solid rgba(239,68,68,0.3);
          background: rgba(239,68,68,0.08);
          color: #f87171;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.18s;
          font-family: inherit;
        }

        .rejectBtn:hover { background: rgba(239,68,68,0.16); }

        .rolePill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          background: color-mix(in srgb, var(--rc) 14%, transparent);
          color: var(--rc);
          border: 1px solid color-mix(in srgb, var(--rc) 28%, transparent);
          text-transform: capitalize;
        }

        .statusPill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          background: color-mix(in srgb, var(--sc) 14%, transparent);
          color: var(--sc);
          border: 1px solid color-mix(in srgb, var(--sc) 28%, transparent);
          text-transform: capitalize;
        }

        /* Table */
        .tableWrap { overflow-x: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); }

        .adminTable { width: 100%; border-collapse: collapse; font-size: 13px; background: rgba(15,19,32,0.9); }

        .adminTable th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(245,245,245,0.35);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .adminTable td {
          padding: 13px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          color: rgba(245,245,245,0.8);
        }

        .adminTable tr:last-child td { border-bottom: none; }
        .adminTable tr:hover td { background: rgba(255,255,255,0.02); }

        .tdName { font-weight: 700; color: #f5f5f5 !important; }
        .tdMuted { color: rgba(245,245,245,0.42) !important; }

        .tableActionBtn {
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px solid rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.06);
          color: #f87171;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }

        .tableActionBtn:hover { background: rgba(239,68,68,0.14); }

        .emptyState {
          text-align: center;
          padding: 60px 20px;
          color: rgba(245,245,245,0.35);
          font-size: 15px;
        }

        /* Modal */
        .modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 20px;
        }

        .modalBox {
          background: rgba(15,19,32,0.99);
          border: 1px solid rgba(125,223,187,0.25);
          border-radius: 18px;
          padding: 32px 28px;
          max-width: 380px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6);
        }

        .modalIcon { font-size: 48px; }
        .modalTitle { margin: 0; font-size: 20px; font-weight: 900; color: #f5f5f5; }
        .modalDesc { margin: 0; font-size: 13px; color: rgba(245,245,245,0.5); line-height: 1.6; }

        .modalCreds {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px dashed rgba(125,223,187,0.3);
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .modalCredsLabel {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(245,245,245,0.35);
        }

        .modalCredsCode {
          font-size: 16px;
          font-family: monospace;
          color: #7ddfbb;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        @media (max-width: 860px) {
          .adminBody { flex-direction: column; }
          .adminSidebar { width: 100%; position: static; }
          .sideNav { flex-direction: row; flex-wrap: wrap; }
          .statsGrid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </main>
  );
}
