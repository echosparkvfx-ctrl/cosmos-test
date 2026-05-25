import React from "react";
import { Link } from "react-router-dom";
import AppNavbar from "./AppNavbar.jsx";

const stats = [
  { label: "Jobs Applied", value: "14", icon: "📨", color: "#ff6b4a" },
  { label: "Interviews", value: "3", icon: "📅", color: "#f7b733" },
  { label: "Profile Views", value: "27", icon: "👁️", color: "#13b8c8" },
  { label: "Saved Jobs", value: "9", icon: "🔖", color: "#7ddfbb" },
];

const applications = [
  { company: "TechCorp Inc.", role: "Frontend Developer", applied: "Today", status: "Pending" },
  { company: "FinServe Ltd.", role: "Data Analyst", applied: "2d ago", status: "Interview" },
  { company: "MediSoft", role: "UI/UX Designer", applied: "4d ago", status: "Reviewed" },
  { company: "RetailHub", role: "React Developer", applied: "1w ago", status: "Rejected" },
  { company: "CloudBase", role: "Full Stack Engineer", applied: "1w ago", status: "Shortlisted" },
];

const savedJobs = [
  { title: "Senior React Developer", company: "Nexify", location: "Remote", salary: "$90k–$120k" },
  { title: "Data Scientist", company: "AnalytiQ", location: "New York, NY", salary: "$110k–$140k" },
  { title: "DevOps Engineer", company: "CloudBase", location: "Austin, TX", salary: "$95k–$125k" },
];

const statusColor = {
  Pending:     "#13b8c8",
  Reviewed:    "#f7b733",
  Shortlisted: "#7ddfbb",
  Interview:   "#ff6b4a",
  Rejected:    "#ef4444",
};

export default function ApplicantDashboard() {
  return (
    <>
      <AppNavbar role="applicant" userName="Applicant" />

      <main className="dashPage">
        {/* ── Header ── */}
        <div className="dashHeader">
          <div className="container">
            <div className="dashHeaderInner">
              <div>
                <p className="dashWelcome">Welcome back,</p>
                <h1 className="dashName">Applicant Dashboard</h1>
              </div>
              <div className="dashHeaderActions">
                <button className="dashBtn dashBtnPrimary">Browse Jobs</button>
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

          {/* ── Profile completion ── */}
          <Link to="/profile/applicant" className="profileBanner" style={{ textDecoration: "none" }}>
            <div className="profileBannerLeft">
              <span className="profileBannerIcon">⚡</span>
              <div>
                <p className="profileBannerTitle">Complete your profile to get more matches</p>
                <p className="profileBannerSub">Add your resume, skills, and work experience</p>
              </div>
            </div>
            <div className="profileProgress">
              <span className="profilePct">65%</span>
              <div className="progressBar">
                <div className="progressFill" style={{ width: "65%" }} />
              </div>
            </div>
          </Link>

          <div className="dashGrid">
            {/* ── My Applications ── */}
            <div className="dashPanel">
              <div className="panelHead">
                <h2 className="panelTitle">My Applications</h2>
                <a href="#" className="panelLink">View all</a>
              </div>
              <div className="tableWrap">
                <table className="dashTable">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((a) => (
                      <tr key={a.company + a.role}>
                        <td className="tdName">{a.company}</td>
                        <td className="tdMuted">{a.role}</td>
                        <td>
                          <span className="statusBadge" style={{ "--s-color": statusColor[a.status] }}>
                            {a.status}
                          </span>
                        </td>
                        <td className="tdMuted">{a.applied}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Saved Jobs ── */}
            <div className="dashPanel">
              <div className="panelHead">
                <h2 className="panelTitle">Saved Jobs</h2>
                <a href="#" className="panelLink">Browse more</a>
              </div>
              <div className="jobList">
                {savedJobs.map((j) => (
                  <div className="jobItem" key={j.title}>
                    <div className="jobInfo">
                      <span className="jobTitle">{j.title}</span>
                      <span className="jobMeta">{j.company} · {j.location}</span>
                      <span className="jobSalary">{j.salary}</span>
                    </div>
                    <button className="applyBtn">Apply</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .dashPage {
          min-height: calc(100vh - 64px);
          background:
            radial-gradient(ellipse 900px 500px at 50% 0%, rgba(255,107,74,0.06) 0%, transparent 65%),
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

        .dashHeaderActions { display: flex; gap: 10px; }

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
        }

        .dashBtnPrimary {
          background: linear-gradient(135deg, #f7b733, #ff6b4a);
          color: #fff;
          box-shadow: 0 8px 22px rgba(255,107,74,0.25);
        }

        .dashBtnPrimary:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 28px rgba(255,107,74,0.35);
        }

        .dashBody {
          padding-top: 36px;
          padding-bottom: 60px;
          display: flex;
          flex-direction: column;
          gap: 28px;
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
        .statValue { font-size: 32px; font-weight: 950; color: #f5f5f5; line-height: 1; }
        .statLabel { font-size: 12.5px; color: rgba(245,245,245,0.45); font-weight: 600; }

        /* ── Profile banner ── */
        .profileBanner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 22px;
          border-radius: 14px;
          background: rgba(247,183,51,0.06);
          border: 1px solid rgba(247,183,51,0.18);
          flex-wrap: wrap;
        }

        .profileBannerLeft {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .profileBannerIcon { font-size: 26px; }

        .profileBannerTitle {
          margin: 0 0 3px;
          font-size: 14px;
          font-weight: 800;
          color: #f5f5f5;
        }

        .profileBannerSub {
          margin: 0;
          font-size: 12.5px;
          color: rgba(245,245,245,0.45);
        }

        .profileProgress {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .profilePct {
          font-size: 18px;
          font-weight: 900;
          color: #f7b733;
        }

        .progressBar {
          width: 120px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .progressFill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #f7b733, #ff6b4a);
          transition: width 0.4s ease;
        }

        /* ── Two-col ── */
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

        .panelTitle { margin: 0; font-size: 15px; font-weight: 800; color: #f5f5f5; }

        .panelLink {
          font-size: 12px;
          font-weight: 700;
          color: #f7b733;
          text-decoration: none;
          transition: color 0.18s;
        }

        .panelLink:hover { color: #ff6b4a; }

        .tableWrap { overflow-x: auto; }

        .dashTable { width: 100%; border-collapse: collapse; font-size: 13px; }

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

        /* ── Saved jobs ── */
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

        .jobInfo { display: flex; flex-direction: column; gap: 3px; }

        .jobTitle { font-size: 13.5px; font-weight: 750; color: #f5f5f5; }
        .jobMeta  { font-size: 12px; color: rgba(245,245,245,0.4); }
        .jobSalary { font-size: 12px; color: #7ddfbb; font-weight: 700; }

        .applyBtn {
          flex-shrink: 0;
          height: 32px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,107,74,0.35);
          background: rgba(255,107,74,0.08);
          color: #ff6b4a;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
        }

        .applyBtn:hover {
          background: rgba(255,107,74,0.18);
          border-color: rgba(255,107,74,0.6);
        }

        @media (max-width: 900px) {
          .statsGrid { grid-template-columns: repeat(2, 1fr); }
          .dashGrid  { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
