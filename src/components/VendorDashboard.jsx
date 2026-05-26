import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AppNavbar from "./AppNavbar.jsx";

const STATUS_COLORS = {
  submitted:"#13b8c8", reviewing:"#f7b733", shortlisted:"#7ddfbb",
  rejected:"#ef4444", placed:"#22c55e",
};

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [user,        setUser]       = React.useState(null);
  const [profile,     setProfile]    = React.useState(null);
  const [tab,         setTab]        = React.useState("overview");
  const [jobs,        setJobs]       = React.useState([]);
  const [submissions, setSubmissions]= React.useState([]);
  const [loading,     setLoading]    = React.useState(true);
  const [toast,       setToast]      = React.useState("");
  const [submitting,  setSubmitting] = React.useState(null);
  const [subForm,     setSubForm]    = React.useState({ candidate_name:"", candidate_email:"", skills:"", experience:"", notes:"" });
  const [saving,      setSaving]     = React.useState(false);

  React.useEffect(() => {
    init();
    // Realtime: auto-update jobs list
    const channel = supabase
      .channel("vendor-jobs-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, () => {
        fetchJobs();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const init = async () => {
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login/vendor"); return; }
    setUser(user);
    const { data:p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(p);
    await Promise.all([fetchJobs(), fetchSubmissions(user.id)]);
    setLoading(false);
  };

  const fetchJobs = async () => {
    const { data } = await supabase.from("jobs").select("*")
      .eq("status","active").order("created_at",{ascending:false});
    setJobs(data || []);
  };

  const fetchSubmissions = async (uid) => {
    const { data } = await supabase.from("vendor_submissions")
      .select("*, jobs(title, company, location)")
      .eq("vendor_id", uid).order("created_at",{ascending:false});
    setSubmissions(data || []);
  };

  const submitCandidate = async (e) => {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("vendor_submissions").insert({
      vendor_id: user.id, job_id: submitting.id,
      ...subForm, status:"submitted",
    });
    setSaving(false);
    if (error) { showToast("Error: "+error.message); return; }
    showToast("✅ Candidate submitted!");
    setSubForm({ candidate_name:"", candidate_email:"", skills:"", experience:"", notes:"" });
    setSubmitting(null);
    await fetchSubmissions(user.id);
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate("/login/vendor"); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const userName = profile?.full_name || user?.email?.split("@")[0] || "Vendor";

  return (
    <>
      <AppNavbar role="vendor" userName={userName} />

      {toast && (
        <div style={{position:"fixed",bottom:24,right:24,background:"#1a2035",border:"1px solid rgba(255,255,255,0.12)",color:"#f5f5f5",padding:"12px 20px",borderRadius:12,zIndex:9999,fontSize:14,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
          {toast}
        </div>
      )}

      {/* Submit Modal */}
      {submitting && (
        <div className="vdOverlay" onClick={() => setSubmitting(null)}>
          <div className="vdModal" onClick={e => e.stopPropagation()}>
            <h3 className="vdModalTitle">Submit Candidate</h3>
            <p className="vdModalSub">For: {submitting.title} at {submitting.company}</p>
            <form className="vdModalForm" onSubmit={submitCandidate}>
              <div className="vdField">
                <label>Candidate Name *</label>
                <input required placeholder="John Doe" value={subForm.candidate_name}
                  onChange={e => setSubForm(f=>({...f,candidate_name:e.target.value}))} />
              </div>
              <div className="vdField">
                <label>Candidate Email *</label>
                <input required type="email" placeholder="candidate@email.com" value={subForm.candidate_email}
                  onChange={e => setSubForm(f=>({...f,candidate_email:e.target.value}))} />
              </div>
              <div className="vdField">
                <label>Skills</label>
                <input placeholder="React, Node.js, AWS…" value={subForm.skills}
                  onChange={e => setSubForm(f=>({...f,skills:e.target.value}))} />
              </div>
              <div className="vdField">
                <label>Experience</label>
                <input placeholder="3+ years in full-stack dev" value={subForm.experience}
                  onChange={e => setSubForm(f=>({...f,experience:e.target.value}))} />
              </div>
              <div className="vdField">
                <label>Notes</label>
                <textarea rows={3} placeholder="Any additional notes…" value={subForm.notes}
                  onChange={e => setSubForm(f=>({...f,notes:e.target.value}))} />
              </div>
              <div className="vdModalActions">
                <button type="submit" className="vdSubmitBtn" disabled={saving}>{saving?"Submitting…":"Submit Candidate"}</button>
                <button type="button" className="vdCancelBtn" onClick={() => setSubmitting(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="vdPage">
        <aside className="vdSidebar">
          <nav className="vdNav">
            {[
              {id:"overview",    icon:"📊", label:"Overview"},
              {id:"jobs",        icon:"💼", label:"Available Jobs", badge:jobs.length},
              {id:"submissions", icon:"📤", label:"My Submissions", badge:submissions.length},
            ].map(n => (
              <button key={n.id} className={`vdNavLink ${tab===n.id?"vdNavActive":""}`} onClick={() => setTab(n.id)}>
                <span>{n.icon}</span>{n.label}
                {n.badge>0 && <span className="vdBadge">{n.badge}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <div className="vdContent">

          {/* Overview */}
          {tab==="overview" && (
            <div className="vdPanel">
              <h2 className="vdTitle">Welcome, {userName}!</h2>
              <div className="vdStats">
                {[
                  {label:"Active Jobs",   value:jobs.length,                                               icon:"💼", color:"#7ddfbb"},
                  {label:"Submitted",     value:submissions.length,                                        icon:"📤", color:"#13b8c8"},
                  {label:"Shortlisted",   value:submissions.filter(s=>s.status==="shortlisted").length,    icon:"⭐", color:"#f7b733"},
                  {label:"Placed",        value:submissions.filter(s=>s.status==="placed").length,         icon:"✅", color:"#22c55e"},
                ].map(s => (
                  <div className="vdStatCard" key={s.label} style={{"--cc":s.color}}>
                    <span className="vdStatIcon">{s.icon}</span>
                    <span className="vdStatVal">{s.value}</span>
                    <span className="vdStatLabel">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="vdSection">
                <div className="vdSectionHead">
                  <h3 className="vdSectionTitle">Open Positions</h3>
                  <button className="vdLinkBtn" onClick={() => setTab("jobs")}>View all →</button>
                </div>
                {jobs.length===0 ? (
                  <div className="vdEmpty">No active positions right now.</div>
                ) : (
                  <div className="vdJobList">
                    {jobs.slice(0,4).map(job => (
                      <div className="vdJobRow" key={job.id}>
                        <div className="vdJobInfo">
                          <p className="vdJobTitle">{job.title}</p>
                          <p className="vdJobMeta">{job.company} · {job.location} · {job.type}</p>
                          {job.salary_range && <p className="vdJobSalary">{job.salary_range}</p>}
                        </div>
                        <button className="vdSubmitCandBtn" onClick={() => setSubmitting(job)}>Submit Candidate</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Available Jobs */}
          {tab==="jobs" && (
            <div className="vdPanel">
              <h2 className="vdTitle">Available Jobs</h2>
              {loading ? <div className="vdEmpty">Loading…</div> : jobs.length===0 ? (
                <div className="vdEmpty">No active jobs right now.</div>
              ) : (
                <div className="vdJobCards">
                  {jobs.map(job => (
                    <div className="vdJobCard" key={job.id}>
                      <div className="vdJobCardTop">
                        <div style={{flex:1}}>
                          <p className="vdJobCardTitle">{job.title}</p>
                          <p className="vdJobCardMeta">{job.company} · {job.location}</p>
                          <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                            <span className="vdTagPill">{job.type}</span>
                            {job.salary_range && <span className="vdTagPill" style={{color:"#7ddfbb",borderColor:"rgba(125,223,187,0.3)"}}>{job.salary_range}</span>}
                          </div>
                        </div>
                        <button className="vdSubmitCandBtn" onClick={() => setSubmitting(job)}>Submit Candidate</button>
                      </div>
                      {job.description && <p className="vdJobCardDesc">{job.description.slice(0,200)}{job.description.length>200?"…":""}</p>}
                      {job.requirements && <p className="vdJobCardReqs"><strong style={{color:"rgba(245,245,245,0.6)"}}>Requirements:</strong> {job.requirements}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submissions */}
          {tab==="submissions" && (
            <div className="vdPanel">
              <h2 className="vdTitle">My Submissions</h2>
              {submissions.length===0 ? (
                <div className="vdEmpty">No submissions yet. <button className="vdLinkBtn" onClick={() => setTab("jobs")}>Browse jobs →</button></div>
              ) : (
                <div className="vdSubCards">
                  {submissions.map(sub => (
                    <div className="vdSubCard" key={sub.id}>
                      <div className="vdSubTop">
                        <div className="vdSubAvatar">{sub.candidate_name?.charAt(0).toUpperCase()||"C"}</div>
                        <div style={{flex:1}}>
                          <p className="vdSubName">{sub.candidate_name}</p>
                          <p className="vdSubEmail">{sub.candidate_email}</p>
                          {sub.skills && <p className="vdSubSkills">{sub.skills}</p>}
                        </div>
                        <div style={{textAlign:"right"}}>
                          <span className="vdStatusPill" style={{"--sc":STATUS_COLORS[sub.status]||"#13b8c8"}}>{sub.status}</span>
                          <p className="vdSubDate">{sub.created_at?.slice(0,10)}</p>
                        </div>
                      </div>
                      <p className="vdSubJob">📋 {sub.jobs?.title} at {sub.jobs?.company}</p>
                      {sub.experience && <p className="vdSubExp">Experience: {sub.experience}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <style>{`
        .vdPage{display:flex;min-height:calc(100vh - 64px);background:#07090f;}
        .vdSidebar{width:220px;flex-shrink:0;background:rgba(10,14,26,0.9);border-right:1px solid rgba(255,255,255,0.07);padding:24px 12px;position:sticky;top:64px;height:calc(100vh - 64px);}
        .vdNav{display:flex;flex-direction:column;gap:4px;}
        .vdNavLink{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;border:none;background:none;color:rgba(245,245,245,0.5);font-size:13px;font-weight:700;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.18s;}
        .vdNavLink:hover{color:#f5f5f5;background:rgba(255,255,255,0.05);}
        .vdNavActive{color:#f5f5f5!important;background:rgba(125,223,187,0.1)!important;box-shadow:inset 2px 0 0 #7ddfbb;}
        .vdBadge{margin-left:auto;background:#7ddfbb;color:#0a0e1a;font-size:10px;font-weight:900;min-width:18px;height:18px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px;}
        .vdContent{flex:1;padding:32px 28px;min-width:0;}
        .vdPanel{display:flex;flex-direction:column;gap:24px;max-width:900px;}
        .vdTitle{margin:0;font-size:22px;font-weight:900;color:#f5f5f5;letter-spacing:-0.02em;}
        .vdStats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .vdStatCard{padding:18px 16px;border-radius:14px;background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-top:3px solid var(--cc);display:flex;flex-direction:column;gap:6px;}
        .vdStatIcon{font-size:20px;}.vdStatVal{font-size:26px;font-weight:950;color:#f5f5f5;line-height:1;}.vdStatLabel{font-size:11px;color:rgba(245,245,245,0.4);font-weight:600;}
        .vdSection{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;}
        .vdSectionHead{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,0.06);}
        .vdSectionTitle{margin:0;font-size:14px;font-weight:800;color:#f5f5f5;}
        .vdLinkBtn{background:none;border:none;color:#7ddfbb;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;}
        .vdLinkBtn:hover{color:#13b8c8;}
        .vdJobList{display:flex;flex-direction:column;}
        .vdJobRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.04);}
        .vdJobRow:last-child{border-bottom:none;}
        .vdJobInfo{flex:1;}.vdJobTitle{margin:0 0 3px;font-size:13.5px;font-weight:750;color:#f5f5f5;}.vdJobMeta{margin:0 0 2px;font-size:12px;color:rgba(245,245,245,0.4);}.vdJobSalary{margin:0;font-size:12px;color:#7ddfbb;font-weight:700;}
        .vdSubmitCandBtn{height:34px;padding:0 14px;border-radius:999px;border:none;background:linear-gradient(135deg,#7ddfbb,#13b8c8);color:#0a0e1a;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit;flex-shrink:0;transition:transform 0.15s;}
        .vdSubmitCandBtn:hover{transform:translateY(-1px);}
        .vdEmpty{padding:40px 20px;text-align:center;color:rgba(245,245,245,0.35);font-size:14px;}
        .vdJobCards{display:flex;flex-direction:column;gap:14px;}
        .vdJobCard{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:10px;}
        .vdJobCardTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
        .vdJobCardTitle{margin:0 0 4px;font-size:15px;font-weight:800;color:#f5f5f5;}.vdJobCardMeta{margin:0;font-size:12.5px;color:rgba(245,245,245,0.45);}
        .vdTagPill{display:inline-flex;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,0.15);color:rgba(245,245,245,0.6);}
        .vdJobCardDesc{margin:0;font-size:13px;color:rgba(245,245,245,0.45);line-height:1.6;}.vdJobCardReqs{margin:0;font-size:12.5px;color:rgba(245,245,245,0.4);line-height:1.6;}
        .vdStatusPill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;background:color-mix(in srgb,var(--sc) 14%,transparent);color:var(--sc);border:1px solid color-mix(in srgb,var(--sc) 28%,transparent);text-transform:capitalize;}
        .vdSubCards{display:flex;flex-direction:column;gap:14px;}
        .vdSubCard{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:10px;}
        .vdSubTop{display:flex;align-items:center;gap:14px;}
        .vdSubAvatar{width:40px;height:40px;border-radius:50%;background:rgba(125,223,187,0.15);border:1px solid rgba(125,223,187,0.3);color:#7ddfbb;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;flex-shrink:0;}
        .vdSubName{margin:0 0 2px;font-size:14px;font-weight:800;color:#f5f5f5;}.vdSubEmail{margin:0 0 2px;font-size:12px;color:rgba(245,245,245,0.4);}.vdSubSkills{margin:0;font-size:12px;color:#7ddfbb;font-weight:600;}
        .vdSubDate{margin:4px 0 0;font-size:11px;color:rgba(245,245,245,0.3);}
        .vdSubJob{margin:0;font-size:13px;color:rgba(245,245,245,0.5);}.vdSubExp{margin:0;font-size:12.5px;color:rgba(245,245,245,0.4);}
        .vdOverlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;}
        .vdModal{background:rgba(15,19,32,0.99);border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:28px;max-width:480px;width:100%;display:flex;flex-direction:column;gap:4px;box-shadow:0 30px 80px rgba(0,0,0,0.6);max-height:90vh;overflow-y:auto;}
        .vdModalTitle{margin:0 0 4px;font-size:18px;font-weight:900;color:#f5f5f5;}.vdModalSub{margin:0 0 12px;font-size:13px;color:rgba(245,245,245,0.45);}
        .vdModalForm{display:flex;flex-direction:column;gap:14px;}
        .vdField{display:flex;flex-direction:column;gap:6px;}.vdField label{font-size:12px;font-weight:700;color:rgba(245,245,245,0.65);}
        .vdField input,.vdField textarea{padding:0 12px;height:42px;border-radius:10px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.04);color:#f5f5f5;font-size:13.5px;outline:none;font-family:inherit;width:100%;box-sizing:border-box;}
        .vdField textarea{height:auto;padding:10px 12px;resize:vertical;}
        .vdField input::placeholder,.vdField textarea::placeholder{color:rgba(245,245,245,0.22);}
        .vdField input:focus,.vdField textarea:focus{border-color:rgba(125,223,187,0.5);box-shadow:0 0 0 3px rgba(125,223,187,0.1);}
        .vdModalActions{display:flex;gap:10px;margin-top:4px;}
        .vdSubmitBtn{flex:1;height:46px;border-radius:999px;border:none;background:linear-gradient(135deg,#7ddfbb,#13b8c8);color:#0a0e1a;font-size:14px;font-weight:900;cursor:pointer;font-family:inherit;}
        .vdSubmitBtn:disabled{opacity:0.6;cursor:not-allowed;}
        .vdCancelBtn{height:46px;padding:0 20px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(245,245,245,0.6);font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;}
        @media(max-width:768px){.vdPage{flex-direction:column;}.vdSidebar{width:100%;height:auto;position:static;padding:12px;}.vdNav{flex-direction:row;flex-wrap:wrap;}.vdContent{padding:20px 16px;}.vdStats{grid-template-columns:1fr 1fr;}}
      `}</style>
    </>
  );
}
