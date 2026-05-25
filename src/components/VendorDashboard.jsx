import React from "react";
import { Link } from "react-router-dom";
import AppNavbar from "./AppNavbar.jsx";

const stats = [
  { label: "Active Contracts", value: "7", icon: "📄", color: "#7ddfbb" },
  { label: "Candidates Submitted", value: "93", icon: "👤", color: "#f7b733" },
  { label: "Placements This Month", value: "5", icon: "🎯", color: "#ff6b4a" },
  { label: "Revenue (USD)", value: "$42k", icon: "💰", color: "#13b8c8" },
];

const contracts = [
  { client: "TechCorp Inc.", role: "Senior Developer", end: "Jun 30, 2026", status: "Active" },
  { client: "FinServe Ltd.", role: "Data Engineer", end: "Aug 15, 2026", status: "Active" },
  { client: "MediSoft", role: "QA Analyst", end: "May 31, 2026", status: "Expiring" },
  { client: "RetailHub", role: "Project Manager", end: "Dec 01, 2026", status: "Active" },
];

const candidates = [
  { name: "Alex Turner", skill: "React / Node.js", submitted: "Today", status: "Pending" },
  { name: "Nina Patel", skill: "Data Science", submitted: "Yesterday", status: "Accepted" },
  { name: "Carlos Romero", skill: "DevOps / AWS", submitted: "3d ago", status: "Interview" },
  { name: "Yuki Tanaka", skill: "UI/UX Design", submitted: "1w ago", status: "Rejected" },
  { name: "Omar Hassan", skill: "Java Backend", submitted: "1w ago", status: "Accepted" },
];

const statusColor = {
  Active: "#7ddfbb",
  Expiring: "#f7b733",
  Pending: "#13b8c8",
  Accepted: "#7ddfbb",
  Interview: "#ff6b4a",
  Rejected: "#ef4444",
};

export default function VendorDashboard() {
  return (
    <>
    <AppNavbar role="vendor" userName="Vendor" />
    <main className="dashPage">
      {/* ── Header ── */}
      <div className="dashHeader">
        <div className="container">
          <div className="dashHeaderInner">
            <div>
              <p className="dashWelcome">Welcome back,</p>
              <h1 className="dashName">Vendor Dashboard</h1>
            </div>
            <div className="dashHeaderActions">
              <button className="dashBtn dashBtnPrimary">+ Submit Candidate</button>
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
          {/* ── Active Contracts ── */}
          <div className="dashPanel">
            <div className="panelHead">
              <h2 className="panelTitle">Active Contracts</h2>
              <a href="#" className="panelLink">View all</a>
            </div>
            <div className="jobList">
              {contracts.map((c) => (
                <div className="jobItem" key={c.client + c.role}>
                  <div className="jobInfo">
                    <span className="jobTitle">{c.client}</span>
                    <span className="jobMeta">{c.role} · Ends {c.end}</span>
                  </div>
                  <span className="statusBadge" style={{ "--s-color": statusColor[c.status] }}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Submitted Candidates ── */}
          <div className="dashPanel">
            <div className="panelHead">
              <h2 className="panelTitle">Submitted Candidates</h2>
              <a href="#" className="panelLink">View all</a>
            </div>
            <div className="tableWrap">
              <table className="dashTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Skill</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr key={c.name}>
                      <td className="tdName">{c.name}</td>
                      <td className="tdMuted">{c.skill}</td>
                      <td>
                        <span className="statusBadge" style={{ "--s-color": statusColor[c.status] }}>
                          {c.status}
                        </span>
                      </td>
                      <td className="tdMuted">{c.submitted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashPage {
          min-height: calc(100vh - 76px);
          background:
            radial-gradient(ellipse 900px 500px at 20% 0%, rgba(125,223,187,0.06) 0%, transparent 65%),
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

        .dashBtnPrimary {
          background: linear-gradient(135deg, #7ddfbb, #13b8c8);
          color: #0a0e1a;
          box-shadow: 0 8px 22px rgba(125,223,187,0.25);
        }

        .dashBtnPrimary:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 28px rgba(125,223,187,0.35);
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
          color: #7ddfbb;
          text-decoration: none;
          transition: color 0.18s;
        }

        .panelLink:hover { color: #13b8c8; }

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

        .jobList { display: flex; flex-direction: column; }

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
      `}</style>
    </main>
    </>
  );
}
