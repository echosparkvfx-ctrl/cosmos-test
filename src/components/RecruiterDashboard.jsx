import React from "react";
import { Link } from "react-router-dom";
import AppNavbar from "./AppNavbar.jsx";

const stats = [
  { label: "Active Job Posts", value: "12", icon: "📋", color: "#13b8c8" },
  { label: "Total Applicants", value: "348", icon: "👥", color: "#f7b733" },
  { label: "Interviews Scheduled", value: "24", icon: "📅", color: "#7ddfbb" },
  { label: "Positions Filled", value: "8", icon: "✅", color: "#ff6b4a" },
];

const recentApplicants = [
  { name: "Sarah Johnson", role: "Frontend Developer", status: "Interview", time: "2h ago" },
  { name: "Michael Chen", role: "Data Analyst", status: "Reviewed", time: "4h ago" },
  { name: "Priya Sharma", role: "UX Designer", status: "New", time: "6h ago" },
  { name: "David Williams", role: "Backend Engineer", status: "Shortlisted", time: "1d ago" },
  { name: "Emily Davis", role: "Product Manager", status: "Rejected", time: "1d ago" },
];

const jobPosts = [
  { title: "Senior Frontend Developer", applicants: 54, status: "Active", posted: "3d ago" },
  { title: "Data Analyst", applicants: 31, status: "Active", posted: "5d ago" },
  { title: "UX Designer", applicants: 18, status: "Paused", posted: "1w ago" },
  { title: "DevOps Engineer", applicants: 42, status: "Active", posted: "1w ago" },
];

const statusColor = {
  New: "#13b8c8",
  Reviewed: "#f7b733",
  Shortlisted: "#7ddfbb",
  Interview: "#ff6b4a",
  Rejected: "#ef4444",
  Active: "#7ddfbb",
  Paused: "#f7b733",
};

export default function RecruiterDashboard() {
  return (
    <>
    <AppNavbar role="recruiter" userName="Recruiter" />
    <main className="dashPage">
      {/* ── Header ── */}
      <div className="dashHeader">
        <div className="container">
          <div className="dashHeaderInner">
            <div>
              <p className="dashWelcome">Welcome back,</p>
              <h1 className="dashName">Recruiter Dashboard</h1>
            </div>
            <div className="dashHeaderActions">
              <button className="dashBtn dashBtnOutline">+ Post a Job</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashBody">
        {/* ── Stats ── */}
        <div className="statsGrid">
          {stats.map((s) => (
            <div className="statCard" key={s.label} style={{ "--card-color": s.color }}>
              <div className="statIcon">{s.icon}</div>
              <div className="statValue">{s.value}</div>
              <div className="statLabel">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="dashGrid">
          {/* ── Recent Applicants ── */}
          <div className="dashPanel">
            <div className="panelHead">
              <h2 className="panelTitle">Recent Applicants</h2>
              <a href="#" className="panelLink">View all</a>
            </div>
            <div className="tableWrap">
              <table className="dashTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplicants.map((a) => (
                    <tr key={a.name}>
                      <td className="tdName">{a.name}</td>
                      <td className="tdMuted">{a.role}</td>
                      <td>
                        <span className="statusBadge" style={{ "--s-color": statusColor[a.status] }}>
                          {a.status}
                        </span>
                      </td>
                      <td className="tdMuted">{a.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Job Posts ── */}
          <div className="dashPanel">
            <div className="panelHead">
              <h2 className="panelTitle">Job Posts</h2>
              <a href="#" className="panelLink">Manage</a>
            </div>
            <div className="jobList">
              {jobPosts.map((j) => (
                <div className="jobItem" key={j.title}>
                  <div className="jobInfo">
                    <span className="jobTitle">{j.title}</span>
                    <span className="jobMeta">{j.applicants} applicants · {j.posted}</span>
                  </div>
                  <span className="statusBadge" style={{ "--s-color": statusColor[j.status] }}>
                    {j.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashPage {
          min-height: calc(100vh - 76px);
          background:
            radial-gradient(ellipse 900px 500px at 80% 0%, rgba(19,184,200,0.06) 0%, transparent 65%),
            #0a0e1a;
        }

        .container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .dashHeader {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 28px 0;
          background: rgba(15,19,32,0.6);
        }

        .dashHeaderInner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .dashWelcome {
          margin: 0 0 4px;
          font-size: 13px;
          color: rgba(245,245,245,0.45);
        }

        .dashName {
          margin: 0;
          font-size: 26px;
          font-weight: 900;
          color: #f5f5f5;
          letter-spacing: -0.02em;
        }

        .dashHeaderActions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .dashBtn {
          display: inline-flex;
          align-items: center;
          height: 40px;
          padding: 0 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          border: none;
          transition: transform 0.18s, box-shadow 0.18s;
          text-decoration: none;
        }

        .dashBtnOutline {
          background: linear-gradient(135deg, #13b8c8, #7ddfbb);
          color: #0a0e1a;
          box-shadow: 0 8px 22px rgba(19,184,200,0.25);
        }

        .dashBtnOutline:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 28px rgba(19,184,200,0.35);
        }

        .dashBtnGhost {
          background: rgba(255,255,255,0.06);
          color: rgba(245,245,245,0.7);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .dashBtnGhost:hover {
          background: rgba(255,255,255,0.1);
          color: #f5f5f5;
        }

        .dashBody {
          padding-top: 36px;
          padding-bottom: 60px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* ── Stats ── */
        .statsGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .statCard {
          padding: 24px 20px;
          border-radius: 16px;
          background: rgba(15,19,32,0.9);
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 3px solid var(--card-color);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .statIcon { font-size: 26px; }

        .statValue {
          font-size: 32px;
          font-weight: 950;
          color: #f5f5f5;
          line-height: 1;
        }

        .statLabel {
          font-size: 12.5px;
          color: rgba(245,245,245,0.45);
          font-weight: 600;
        }

        /* ── Two-col grid ── */
        .dashGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .dashPanel {
          background: rgba(15,19,32,0.9);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }

        .panelHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .panelTitle {
          margin: 0;
          font-size: 15px;
          font-weight: 800;
          color: #f5f5f5;
        }

        .panelLink {
          font-size: 12px;
          font-weight: 700;
          color: #13b8c8;
          text-decoration: none;
          transition: color 0.18s;
        }

        .panelLink:hover { color: #7ddfbb; }

        /* ── Table ── */
        .tableWrap { overflow-x: auto; }

        .dashTable {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .dashTable th {
          padding: 10px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(245,245,245,0.35);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .dashTable td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          color: rgba(245,245,245,0.8);
        }

        .dashTable tr:last-child td { border-bottom: none; }
        .dashTable tr:hover td { background: rgba(255,255,255,0.02); }

        .tdName { font-weight: 700; color: #f5f5f5 !important; }
        .tdMuted { color: rgba(245,245,245,0.45) !important; }

        .statusBadge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          background: color-mix(in srgb, var(--s-color) 15%, transparent);
          color: var(--s-color);
          border: 1px solid color-mix(in srgb, var(--s-color) 30%, transparent);
        }

        /* ── Job list ── */
        .jobList {
          display: flex;
          flex-direction: column;
        }

        .jobItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }

        .jobItem:last-child { border-bottom: none; }
        .jobItem:hover { background: rgba(255,255,255,0.02); }

        .jobInfo {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .jobTitle {
          font-size: 13.5px;
          font-weight: 750;
          color: #f5f5f5;
        }

        .jobMeta {
          font-size: 12px;
          color: rgba(245,245,245,0.4);
        }

        @media (max-width: 900px) {
          .statsGrid { grid-template-columns: repeat(2, 1fr); }
          .dashGrid { grid-template-columns: 1fr; }
        }

        @media (max-width: 500px) {
          .statsGrid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </main>
    </>
  );
}
