import React from "react";
import AppNavbar from "./AppNavbar.jsx";

const SKILLS_SUGGESTIONS = [
  "React", "Node.js", "JavaScript", "TypeScript", "Python", "Java", "SQL",
  "AWS", "Docker", "Figma", "UI/UX", "DevOps", "Machine Learning", "Angular",
];

export default function ApplicantProfile() {
  const [profile, setProfile] = React.useState({
    name: "John Doe",
    email: "applicant@cosmos.com",
    phone: "",
    location: "",
    title: "",
    summary: "",
    linkedin: "",
    portfolio: "",
  });

  const [skills, setSkills] = React.useState(["React", "JavaScript"]);
  const [skillInput, setSkillInput] = React.useState("");

  const [experience, setExperience] = React.useState([
    { id: 1, company: "Acme Corp", role: "Junior Developer", from: "2022-01", to: "2024-03", current: false, desc: "" },
  ]);

  const [education, setEducation] = React.useState([
    { id: 1, school: "State University", degree: "B.Tech Computer Science", year: "2022" },
  ]);

  const [resumeName, setResumeName] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  // ── Profile completion ──
  const checks = [
    profile.name, profile.email, profile.phone, profile.location,
    profile.title, profile.summary, skills.length > 0,
    experience.length > 0, education.length > 0, resumeName,
  ];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  const handleField = (e) => {
    setSaved(false);
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const addSkill = (s) => {
    const val = s || skillInput.trim();
    if (val && !skills.includes(val)) setSkills((prev) => [...prev, val]);
    setSkillInput("");
  };

  const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s));

  const handleSkillKey = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); }
  };

  // ── Experience ──
  const addExp = () =>
    setExperience((prev) => [...prev, { id: Date.now(), company: "", role: "", from: "", to: "", current: false, desc: "" }]);

  const updateExp = (id, key, val) =>
    setExperience((prev) => prev.map((e) => e.id === id ? { ...e, [key]: val } : e));

  const removeExp = (id) => setExperience((prev) => prev.filter((e) => e.id !== id));

  // ── Education ──
  const addEdu = () =>
    setEducation((prev) => [...prev, { id: Date.now(), school: "", degree: "", year: "" }]);

  const updateEdu = (id, key, val) =>
    setEducation((prev) => prev.map((e) => e.id === id ? { ...e, [key]: val } : e));

  const removeEdu = (id) => setEducation((prev) => prev.filter((e) => e.id !== id));

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  const progressColor = pct < 40 ? "#ef4444" : pct < 70 ? "#f7b733" : "#7ddfbb";

  return (
    <>
      <AppNavbar role="applicant" userName={profile.name} />

      <main className="profilePage">
        <div className="profileContainer">

          {/* ── Sidebar ── */}
          <aside className="profileSidebar">
            <div className="avatarBlock">
              <div className="avatarCircle">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <p className="avatarName">{profile.name || "Your Name"}</p>
              <p className="avatarTitle">{profile.title || "Add your title"}</p>
            </div>

            <div className="completionCard">
              <div className="completionTop">
                <span className="completionLabel">Profile Completion</span>
                <span className="completionPct" style={{ color: progressColor }}>{pct}%</span>
              </div>
              <div className="progressBar">
                <div className="progressFill" style={{ width: `${pct}%`, background: progressColor }} />
              </div>
              <ul className="completionList">
                {[
                  { label: "Full name", done: !!profile.name },
                  { label: "Phone number", done: !!profile.phone },
                  { label: "Location", done: !!profile.location },
                  { label: "Job title", done: !!profile.title },
                  { label: "Summary", done: !!profile.summary },
                  { label: "Skills added", done: skills.length > 0 },
                  { label: "Work experience", done: experience.length > 0 },
                  { label: "Education", done: education.length > 0 },
                  { label: "Resume uploaded", done: !!resumeName },
                ].map((item) => (
                  <li key={item.label} className={`completionItem ${item.done ? "done" : ""}`}>
                    <span className="completionIcon">{item.done ? "✓" : "○"}</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Main form ── */}
          <form className="profileForm" onSubmit={handleSave}>

            {/* Personal Info */}
            <section className="formSection">
              <h2 className="sectionTitle">Personal Information</h2>
              <div className="formGrid2">
                <div className="fieldGroup">
                  <label className="fieldLabel">Full Name</label>
                  <input name="name" className="fieldInput" value={profile.name} onChange={handleField} placeholder="John Doe" />
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel">Job Title</label>
                  <input name="title" className="fieldInput" value={profile.title} onChange={handleField} placeholder="e.g. Frontend Developer" />
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel">Email</label>
                  <input name="email" type="email" className="fieldInput" value={profile.email} onChange={handleField} placeholder="you@example.com" />
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel">Phone</label>
                  <input name="phone" className="fieldInput" value={profile.phone} onChange={handleField} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel">Location</label>
                  <input name="location" className="fieldInput" value={profile.location} onChange={handleField} placeholder="City, State" />
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel">LinkedIn</label>
                  <input name="linkedin" className="fieldInput" value={profile.linkedin} onChange={handleField} placeholder="linkedin.com/in/username" />
                </div>
              </div>
              <div className="fieldGroup">
                <label className="fieldLabel">Professional Summary</label>
                <textarea name="summary" className="fieldTextarea" rows={4} value={profile.summary} onChange={handleField} placeholder="Write a short summary about yourself..." />
              </div>
            </section>

            {/* Skills */}
            <section className="formSection">
              <h2 className="sectionTitle">Skills</h2>
              <div className="skillsWrap">
                {skills.map((s) => (
                  <span key={s} className="skillTag">
                    {s}
                    <button type="button" className="skillRemove" onClick={() => removeSkill(s)}>×</button>
                  </span>
                ))}
                <input
                  className="skillInput"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKey}
                  placeholder="Type a skill + Enter"
                />
              </div>
              <div className="skillSuggestions">
                {SKILLS_SUGGESTIONS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                  <button key={s} type="button" className="skillSuggest" onClick={() => addSkill(s)}>
                    + {s}
                  </button>
                ))}
              </div>
            </section>

            {/* Work Experience */}
            <section className="formSection">
              <div className="sectionHead">
                <h2 className="sectionTitle">Work Experience</h2>
                <button type="button" className="addBtn" onClick={addExp}>+ Add</button>
              </div>
              {experience.map((exp, i) => (
                <div className="entryCard" key={exp.id}>
                  <div className="entryCardHead">
                    <span className="entryNum">#{i + 1}</span>
                    <button type="button" className="removeBtn" onClick={() => removeExp(exp.id)}>Remove</button>
                  </div>
                  <div className="formGrid2">
                    <div className="fieldGroup">
                      <label className="fieldLabel">Company</label>
                      <input className="fieldInput" value={exp.company} onChange={(e) => updateExp(exp.id, "company", e.target.value)} placeholder="Company name" />
                    </div>
                    <div className="fieldGroup">
                      <label className="fieldLabel">Job Title</label>
                      <input className="fieldInput" value={exp.role} onChange={(e) => updateExp(exp.id, "role", e.target.value)} placeholder="Your role" />
                    </div>
                    <div className="fieldGroup">
                      <label className="fieldLabel">From</label>
                      <input type="month" className="fieldInput" value={exp.from} onChange={(e) => updateExp(exp.id, "from", e.target.value)} />
                    </div>
                    <div className="fieldGroup">
                      <label className="fieldLabel">To</label>
                      <input type="month" className="fieldInput" value={exp.to} onChange={(e) => updateExp(exp.id, "to", e.target.value)} disabled={exp.current} />
                      <label className="checkLabel">
                        <input type="checkbox" checked={exp.current} onChange={(e) => updateExp(exp.id, "current", e.target.checked)} />
                        Currently working here
                      </label>
                    </div>
                  </div>
                  <div className="fieldGroup">
                    <label className="fieldLabel">Description</label>
                    <textarea className="fieldTextarea" rows={3} value={exp.desc} onChange={(e) => updateExp(exp.id, "desc", e.target.value)} placeholder="Describe your responsibilities..." />
                  </div>
                </div>
              ))}
            </section>

            {/* Education */}
            <section className="formSection">
              <div className="sectionHead">
                <h2 className="sectionTitle">Education</h2>
                <button type="button" className="addBtn" onClick={addEdu}>+ Add</button>
              </div>
              {education.map((edu, i) => (
                <div className="entryCard" key={edu.id}>
                  <div className="entryCardHead">
                    <span className="entryNum">#{i + 1}</span>
                    <button type="button" className="removeBtn" onClick={() => removeEdu(edu.id)}>Remove</button>
                  </div>
                  <div className="formGrid3">
                    <div className="fieldGroup">
                      <label className="fieldLabel">School / University</label>
                      <input className="fieldInput" value={edu.school} onChange={(e) => updateEdu(edu.id, "school", e.target.value)} placeholder="University name" />
                    </div>
                    <div className="fieldGroup">
                      <label className="fieldLabel">Degree</label>
                      <input className="fieldInput" value={edu.degree} onChange={(e) => updateEdu(edu.id, "degree", e.target.value)} placeholder="B.Tech Computer Science" />
                    </div>
                    <div className="fieldGroup">
                      <label className="fieldLabel">Graduation Year</label>
                      <input className="fieldInput" value={edu.year} onChange={(e) => updateEdu(edu.id, "year", e.target.value)} placeholder="2024" />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Resume Upload */}
            <section className="formSection">
              <h2 className="sectionTitle">Resume</h2>
              <label className="uploadZone">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="uploadInput"
                  onChange={(e) => { if (e.target.files[0]) setResumeName(e.target.files[0].name); }}
                />
                {resumeName ? (
                  <>
                    <span className="uploadIcon">📄</span>
                    <span className="uploadFileName">{resumeName}</span>
                    <span className="uploadChange">Click to change</span>
                  </>
                ) : (
                  <>
                    <span className="uploadIcon">⬆️</span>
                    <span className="uploadText">Click to upload your resume</span>
                    <span className="uploadHint">PDF, DOC, DOCX — max 5MB</span>
                  </>
                )}
              </label>
            </section>

            {/* Save button */}
            <div className="formFooter">
              {saved && <span className="savedMsg">✓ Profile saved successfully</span>}
              <button type="submit" className="saveBtn">Save Profile</button>
            </div>

          </form>
        </div>
      </main>

      <style>{`
        .profilePage {
          min-height: calc(100vh - 64px);
          background:
            radial-gradient(ellipse 800px 500px at 60% 0%, rgba(255,107,74,0.05) 0%, transparent 65%),
            #0a0e1a;
          padding: 36px 24px 60px;
        }

        .profileContainer {
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 28px;
          align-items: start;
        }

        /* ── Sidebar ── */
        .profileSidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 84px;
        }

        .avatarBlock {
          background: rgba(15,19,32,0.9);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px 20px;
          text-align: center;
        }

        .avatarCircle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f7b733, #ff6b4a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          font-weight: 900;
          color: #fff;
          margin: 0 auto 14px;
        }

        .avatarName {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 800;
          color: #f5f5f5;
        }

        .avatarTitle {
          margin: 0;
          font-size: 12.5px;
          color: rgba(245,245,245,0.45);
        }

        .completionCard {
          background: rgba(15,19,32,0.9);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px;
        }

        .completionTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .completionLabel {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(245,245,245,0.4);
        }

        .completionPct {
          font-size: 18px;
          font-weight: 950;
        }

        .progressBar {
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
          overflow: hidden;
          margin-bottom: 16px;
        }

        .progressFill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.4s ease;
        }

        .completionList {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .completionItem {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: rgba(245,245,245,0.4);
        }

        .completionItem.done { color: rgba(245,245,245,0.75); }

        .completionIcon {
          font-size: 12px;
          width: 16px;
          color: rgba(245,245,245,0.25);
        }

        .completionItem.done .completionIcon { color: #7ddfbb; }

        /* ── Form ── */
        .profileForm {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .formSection {
          background: rgba(15,19,32,0.9);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .sectionHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sectionTitle {
          margin: 0;
          font-size: 16px;
          font-weight: 900;
          color: #f5f5f5;
        }

        .formGrid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .formGrid3 {
          display: grid;
          grid-template-columns: 1fr 1fr 120px;
          gap: 16px;
        }

        .fieldGroup {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .fieldLabel {
          font-size: 12.5px;
          font-weight: 700;
          color: rgba(245,245,245,0.65);
        }

        .fieldInput,
        .fieldTextarea {
          width: 100%;
          padding: 0 14px;
          height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.04);
          color: #f5f5f5;
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }

        .fieldTextarea {
          height: auto;
          padding: 12px 14px;
          resize: vertical;
        }

        .fieldInput::placeholder,
        .fieldTextarea::placeholder { color: rgba(245,245,245,0.22); }

        .fieldInput:focus,
        .fieldTextarea:focus {
          border-color: rgba(255,107,74,0.4);
          box-shadow: 0 0 0 3px rgba(255,107,74,0.08);
        }

        .fieldInput:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .checkLabel {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: rgba(245,245,245,0.5);
          cursor: pointer;
          margin-top: 4px;
        }

        /* ── Skills ── */
        .skillsWrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.03);
          min-height: 52px;
          align-items: center;
        }

        .skillTag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255,107,74,0.12);
          border: 1px solid rgba(255,107,74,0.25);
          color: #ff6b4a;
          font-size: 12.5px;
          font-weight: 700;
        }

        .skillRemove {
          background: none;
          border: none;
          color: rgba(255,107,74,0.6);
          cursor: pointer;
          font-size: 15px;
          line-height: 1;
          padding: 0;
          transition: color 0.15s;
        }

        .skillRemove:hover { color: #ff6b4a; }

        .skillInput {
          border: none;
          background: none;
          outline: none;
          color: #f5f5f5;
          font-size: 13px;
          min-width: 140px;
          font-family: inherit;
        }

        .skillInput::placeholder { color: rgba(245,245,245,0.25); }

        .skillSuggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skillSuggest {
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px dashed rgba(255,255,255,0.15);
          background: transparent;
          color: rgba(245,245,245,0.5);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
        }

        .skillSuggest:hover {
          border-color: rgba(255,107,74,0.4);
          color: #ff6b4a;
          background: rgba(255,107,74,0.06);
        }

        /* ── Entry cards (exp/edu) ── */
        .entryCard {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: rgba(255,255,255,0.02);
        }

        .entryCardHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .entryNum {
          font-size: 12px;
          font-weight: 800;
          color: rgba(245,245,245,0.3);
          letter-spacing: 0.06em;
        }

        .addBtn {
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,107,74,0.3);
          background: rgba(255,107,74,0.08);
          color: #ff6b4a;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
        }

        .addBtn:hover {
          background: rgba(255,107,74,0.15);
          border-color: rgba(255,107,74,0.5);
        }

        .removeBtn {
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px solid rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.06);
          color: #f87171;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
        }

        .removeBtn:hover {
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.45);
        }

        /* ── Resume upload ── */
        .uploadZone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 36px 20px;
          border-radius: 14px;
          border: 2px dashed rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }

        .uploadZone:hover {
          border-color: rgba(255,107,74,0.35);
          background: rgba(255,107,74,0.04);
        }

        .uploadInput {
          display: none;
        }

        .uploadIcon { font-size: 32px; }

        .uploadText {
          font-size: 14px;
          font-weight: 700;
          color: rgba(245,245,245,0.7);
        }

        .uploadFileName {
          font-size: 14px;
          font-weight: 700;
          color: #7ddfbb;
        }

        .uploadChange,
        .uploadHint {
          font-size: 12px;
          color: rgba(245,245,245,0.35);
        }

        /* ── Footer ── */
        .formFooter {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
        }

        .savedMsg {
          font-size: 13px;
          font-weight: 700;
          color: #7ddfbb;
        }

        .saveBtn {
          height: 46px;
          padding: 0 32px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #f7b733, #ff6b4a);
          color: #fff;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(255,107,74,0.25);
          transition: transform 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }

        .saveBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 36px rgba(255,107,74,0.32);
        }

        @media (max-width: 860px) {
          .profileContainer { grid-template-columns: 1fr; }
          .profileSidebar { position: static; }
          .formGrid2, .formGrid3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
