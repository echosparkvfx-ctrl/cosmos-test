import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AppNavbar from "./AppNavbar.jsx";

const STATUS_COLORS = {
  applied:"#13b8c8", reviewed:"#f7b733", shortlisted:"#7ddfbb",
  interview:"#ff6b4a", rejected:"#ef4444", hired:"#22c55e",
};

export default function ApplicantDashboard() {
  const navigate = useNavigate();
  const [user,         setUser]        = React.useState(null);
  const [profile,      setProfile]     = React.useState(null);
  const [tab,          setTab]         = React.useState("overview");
  const [jobs,         setJobs]        = React.useState([]);
  const [applications, setApplications]= React.useState([]);
  const [loading,      setLoading]     = React.useState(true);
  const [toast,        setToast]       = React.useState("");
  const [applying,     setApplying]    = React.useState(null);
  const [coverLetter,  setCoverLetter] = React.useState("");
  const [profileForm,  setProfileForm] = React.useState({ full_name:"", bio:"", skills:"" });
  const [savingProfile,setSavingProfile]= React.useState(false);

  React.useEffect(() => {
    init();
    // Realtime: auto-update jobs
    const channel = supabase
      .channel("applicant-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, () => {
        fetchJobs();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, (payload) => {
        // Only refresh if it's this user's application
        if (payload.new?.applicant_id === user?.id || payload.old?.applicant_id === user?.id) {
          fetchApplications(user.id);
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const init = async () => {
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login"); return; }
    setUser(user);
    const { data:p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(p);
    if (p) setProfileForm({ full_name:p.full_name||"", bio:p.bio||"", skills:p.skills||"" });
    await Promise.all([fetchJobs(), fetchApplications(user.id)]);
    setLoading(false);
  };

  const fetchJobs = async () => {
    const { data } = await supabase.from("jobs").select("*")
      .eq("status","active").order("created_at",{ascending:false});
    setJobs(data || []);
  };

  const fetchApplications = async (uid) => {
    const { data } = await supabase.from("applications")
      .select("*, jobs(title, company, location, type)")
      .eq("applicant_id", uid).order("created_at",{ascending:false});
    setApplications(data || []);
  };

  const applyToJob = async (jobId) => {
    const alreadyApplied = applications.find(a => a.job_id===jobId);
    if (alreadyApplied) { showToast("Already applied to this job."); return; }
    const { error } = await supabase.from("applications").insert({
      job_id:jobId, applicant_id:user.id,
      cover_letter:coverLetter, status:"applied",
    });
    if (error) { showToast("Error: "+error.message); return; }
    showToast("✅ Application submitted!");
    setCoverLetter(""); setApplying(null);
    await fetchApplications(user.id);
  };

  const saveProfile = async (e) => {
    e.preventDefault(); setSavingProfile(true);
    const { error } = await supabase.from("profiles")
      .update({ full_name:profileForm.full_name, bio:profileForm.bio, skills:profileForm.skills })
      .eq("id", user.id);
    setSavingProfile(false);
    if (error) { showToast("Error: "+error.message); return; }
    setProfile(p => ({...p, ...profileForm}));
    showToast("✅ Profile saved!");
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate("/login"); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const hasApplied = (jobId) => applications.some(a => a.job_id===jobId);
  const userName = profile?.full_name || user?.email?.split("@")[0] || "Applicant";

  return (
    <>
      <AppNavbar role="applicant" userName={userName} />

      {toast && (
        <div style={{position:"fixed",bottom:24,right:24,background:"#1a2035",border:"1px solid rgba(255,255,255,0.12)",color:"#f5f5f5",padding:"12px 20px",borderRadius:12,zIndex:9999,fontSize:14,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
          {toast}
        </div>
      )}

      {/* Apply Modal */}
      {applying && (
        <div className="adOverlay" onClick={() => setApplying(null)}>
          <div className="adModal" onClick={e => e.stopPropagation()}>
            <h3 className="adModalTitle">Apply — {applying.title}</h3>
            <p className="adModalSub">{applying.company} · {applying.location}</p>
            <div className="adField">
              <label>Cover Letter (optional)</label>
              <textarea rows={5} placeholder="Why are you a great fit for this role?"
                value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
            </div>
            <div className="adModalActions">
              <button className="adApplyBtn" onClick={() => applyToJob(applying.id)}>Submit Application</button>
              <button className="adCancelBtn" onClick={() => setApplying(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <main className="adPage">
        <aside className="adSidebar">
          <nav className="adNav">
            {[
              {id:"overview",     icon:"📊", label:"Overview"},
              {id:"browse",       icon:"🔍", label:"Browse Jobs", badge:jobs.length},
              {id:"applications", icon:"📨", label:"My Applications", badge:applications.length},
              {id:"profile",      icon:"👤", label:"My Profile"},
            ].map(n => (
              <button key={n.id} className={`adNavLink ${tab===n.id?"adNavActive":""}`} onClick={() => setTab(n.id)}>
                <span>{n.icon}</span>{n.label}
                {n.badge>0 && <span className="adBadge">{n.badge}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <div className="adContent">

          {/* Overview */}
          {tab==="overview" && (
            <div className="adPanel">
              <h2 className="adTitle">Welcome back, {userName}!</h2>
              <div className="adStats">
                {[
                  {label:"Jobs Applied",    value:applications.length,                                    icon:"📨", color:"#ff6b4a"},
                  {label:"Shortlisted",     value:applications.filter(a=>a.status==="shortlisted").length, icon:"⭐", color:"#f7b733"},
                  {label:"Interviews",      value:applications.filter(a=>a.status==="interview").length,   icon:"📅", color:"#13b8c8"},
                  {label:"Jobs Available",  value:jobs.length,                                             icon:"💼", color:"#7ddfbb"},
                ].map(s => (
                  <div className="adStatCard" key={s.label} style={{"--cc":s.color}}>
                    <span className="adStatIcon">{s.icon}</span>
                    <span className="adStatVal">{s.value}</span>
                    <span className="adStatLabel">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="adSection">
                <div className="adSectionHead">
                  <h3 className="adSectionTitle">Latest Jobs</h3>
                  <button className="adLinkBtn" onClick={() => setTab("browse")}>Browse all →</button>
                </div>
                {jobs.length===0 ? (
                  <div className="adEmpty">No active jobs right now.</div>
                ) : (
                  <div className="adJobList">
                    {jobs.slice(0,4).map(job => (
                      <div className="adJobRow" key={job.id}>
                        <div className="adJobInfo">
                          <p className="adJobTitle">{job.title}</p>
                          <p className="adJobMeta">{job.company} · {job.location} · {job.type}</p>
                          {job.salary_range && <p className="adJobSalary">{job.salary_range}</p>}
                        </div>
                        {hasApplied(job.id) ? (
                          <span className="adAppliedTag">Applied ✓</span>
                        ) : (
                          <button className="adQuickApply" onClick={() => setApplying(job)}>Apply</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {applications.length>0 && (
                <div className="adSection">
                  <div className="adSectionHead">
                    <h3 className="adSectionTitle">Recent Applications</h3>
                    <button className="adLinkBtn" onClick={() => setTab("applications")}>View all →</button>
                  </div>
                  <div className="adAppList">
                    {applications.slice(0,3).map(app => (
                      <div className="adAppRow" key={app.id}>
                        <div className="adAppInfo">
                          <p className="adAppTitle">{app.jobs?.title||"—"}</p>
                          <p className="adAppMeta">{app.jobs?.company} · {app.jobs?.location}</p>
                        </div>
                        <span className="adStatusPill" style={{"--sc":STATUS_COLORS[app.status]||"#13b8c8"}}>{app.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Browse Jobs */}
          {tab==="browse" && (
            <div className="adPanel">
              <h2 className="adTitle">Browse Jobs</h2>
              {loading ? <div className="adEmpty">Loading…</div> : jobs.length===0 ? (
                <div className="adEmpty">No active jobs right now. Check back soon!</div>
              ) : (
                <div className="adJobCards">
                  {jobs.map(job => (
                    <div className="adJobCard" key={job.id}>
                      <div className="adJobCardTop">
                        <div style={{flex:1}}>
                          <p className="adJobCardTitle">{job.title}</p>
                          <p className="adJobCardMeta">{job.company} · {job.location}</p>
                          <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                            <span className="adTagPill">{job.type}</span>
                            {job.salary_range && <span className="adTagPill" style={{color:"#7ddfbb",borderColor:"rgba(125,223,187,0.3)"}}>{job.salary_range}</span>}
                          </div>
                        </div>
                        {hasApplied(job.id) ? (
                          <span className="adAppliedTag">Applied ✓</span>
                        ) : (
                          <button className="adApplyBtnCard" onClick={() => setApplying(job)}>Apply Now</button>
                        )}
                      </div>
                      {job.description && <p className="adJobCardDesc">{job.description.slice(0,180)}{job.description.length>180?"…":""}</p>}
                      {job.requirements && <p className="adJobCardReqs"><strong style={{color:"rgba(245,245,245,0.6)"}}>Requirements:</strong> {job.requirements.slice(0,150)}{job.requirements.length>150?"…":""}</p>}
                      <p className="adJobCardDate">Posted {job.created_at?.slice(0,10)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Applications */}
          {tab==="applications" && (
            <div className="adPanel">
              <h2 className="adTitle">My Applications</h2>
              {applications.length===0 ? (
                <div className="adEmpty">No applications yet. <button className="adLinkBtn" onClick={() => setTab("browse")}>Browse jobs →</button></div>
              ) : (
                <div className="adAppCards">
                  {applications.map(app => (
                    <div className="adAppCard" key={app.id}>
                      <div className="adAppCardTop">
                        <div>
                          <p className="adAppCardTitle">{app.jobs?.title||"—"}</p>
                          <p className="adAppCardMeta">{app.jobs?.company} · {app.jobs?.location} · {app.jobs?.type}</p>
                        </div>
                        <span className="adStatusPill" style={{"--sc":STATUS_COLORS[app.status]||"#13b8c8"}}>{app.status}</span>
                      </div>
                      {app.cover_letter && (
                        <p className="adAppCardCover">"{app.cover_letter.slice(0,140)}{app.cover_letter.length>140?"…":""}"</p>
                      )}
                      <p className="adAppCardDate">Applied {app.created_at?.slice(0,10)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {tab==="profile" && (
            <div className="adPanel">
              <h2 className="adTitle">My Profile</h2>
              <form className="adForm" onSubmit={saveProfile}>
                <div className="adField">
                  <label>Full Name</label>
                  <input placeholder="Jane Smith" value={profileForm.full_name}
                    onChange={e => setProfileForm(f=>({...f,full_name:e.target.value}))} />
                </div>
                <div className="adField">
                  <label>Bio</label>
                  <textarea rows={3} placeholder="Brief professional summary…"
                    value={profileForm.bio} onChange={e => setProfileForm(f=>({...f,bio:e.target.value}))} />
                </div>
                <div className="adField">
                  <label>Skills</label>
                  <input placeholder="React, Node.js, Python, AWS…" value={profileForm.skills}
                    onChange={e => setProfileForm(f=>({...f,skills:e.target.value}))} />
                </div>
                <div className="adField" style={{pointerEvents:"none",opacity:0.5}}>
                  <label>Email</label>
                  <input value={user?.email||""} readOnly />
                </div>
                <button type="submit" className="adSubmitBtn" disabled={savingProfile}>
                  {savingProfile ? "Saving…" : "Save Profile"}
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      <style>{`
        .adPage{display:flex;min-height:calc(100vh - 64px);background:#07090f;}
        .adSidebar{width:220px;flex-shrink:0;background:rgba(10,14,26,0.9);border-right:1px solid rgba(255,255,255,0.07);padding:24px 12px;position:sticky;top:64px;height:calc(100vh - 64px);}
        .adNav{display:flex;flex-direction:column;gap:4px;}
        .adNavLink{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;border:none;background:none;color:rgba(245,245,245,0.5);font-size:13px;font-weight:700;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.18s;}
        .adNavLink:hover{color:#f5f5f5;background:rgba(255,255,255,0.05);}
        .adNavActive{color:#f5f5f5!important;background:rgba(255,107,74,0.1)!important;box-shadow:inset 2px 0 0 #ff6b4a;}
        .adBadge{margin-left:auto;background:#ff6b4a;color:#fff;font-size:10px;font-weight:900;min-width:18px;height:18px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px;}
        .adContent{flex:1;padding:32px 28px;min-width:0;}
        .adPanel{display:flex;flex-direction:column;gap:24px;max-width:900px;}
        .adTitle{margin:0;font-size:22px;font-weight:900;color:#f5f5f5;letter-spacing:-0.02em;}
        .adStats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .adStatCard{padding:18px 16px;border-radius:14px;background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-top:3px solid var(--cc);display:flex;flex-direction:column;gap:6px;}
        .adStatIcon{font-size:20px;}.adStatVal{font-size:26px;font-weight:950;color:#f5f5f5;line-height:1;}.adStatLabel{font-size:11px;color:rgba(245,245,245,0.4);font-weight:600;}
        .adSection{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;}
        .adSectionHead{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,0.06);}
        .adSectionTitle{margin:0;font-size:14px;font-weight:800;color:#f5f5f5;}
        .adLinkBtn{background:none;border:none;color:#f7b733;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;}
        .adLinkBtn:hover{color:#ff6b4a;}
        .adJobList{display:flex;flex-direction:column;}
        .adJobRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.04);}
        .adJobRow:last-child{border-bottom:none;}
        .adJobInfo{flex:1;}.adJobTitle{margin:0 0 3px;font-size:13.5px;font-weight:750;color:#f5f5f5;}.adJobMeta{margin:0 0 2px;font-size:12px;color:rgba(245,245,245,0.4);}.adJobSalary{margin:0;font-size:12px;color:#7ddfbb;font-weight:700;}
        .adQuickApply{height:32px;padding:0 14px;border-radius:999px;border:none;background:linear-gradient(135deg,#ff6b4a,#f7b733);color:#fff;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit;transition:transform 0.15s;flex-shrink:0;}
        .adQuickApply:hover{transform:translateY(-1px);}
        .adAppliedTag{font-size:12px;font-weight:800;color:#7ddfbb;background:rgba(125,223,187,0.1);border:1px solid rgba(125,223,187,0.25);padding:4px 12px;border-radius:999px;flex-shrink:0;}
        .adAppList{display:flex;flex-direction:column;}
        .adAppRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 20px;border-bottom:1px solid rgba(255,255,255,0.04);}
        .adAppRow:last-child{border-bottom:none;}
        .adAppInfo{flex:1;}.adAppTitle{margin:0 0 2px;font-size:13px;font-weight:750;color:#f5f5f5;}.adAppMeta{margin:0;font-size:12px;color:rgba(245,245,245,0.4);}
        .adStatusPill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;background:color-mix(in srgb,var(--sc) 14%,transparent);color:var(--sc);border:1px solid color-mix(in srgb,var(--sc) 28%,transparent);text-transform:capitalize;flex-shrink:0;}
        .adEmpty{padding:40px 20px;text-align:center;color:rgba(245,245,245,0.35);font-size:14px;}
        .adJobCards{display:flex;flex-direction:column;gap:14px;}
        .adJobCard{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:10px;}
        .adJobCardTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
        .adJobCardTitle{margin:0 0 4px;font-size:15px;font-weight:800;color:#f5f5f5;}.adJobCardMeta{margin:0;font-size:12.5px;color:rgba(245,245,245,0.45);}
        .adTagPill{display:inline-flex;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,0.15);color:rgba(245,245,245,0.6);}
        .adJobCardDesc{margin:0;font-size:13px;color:rgba(245,245,245,0.45);line-height:1.6;}.adJobCardReqs{margin:0;font-size:12.5px;color:rgba(245,245,245,0.4);line-height:1.6;}.adJobCardDate{margin:0;font-size:11.5px;color:rgba(245,245,245,0.3);}
        .adApplyBtnCard{height:38px;padding:0 18px;border-radius:999px;border:none;background:linear-gradient(135deg,#ff6b4a,#f7b733);color:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;flex-shrink:0;transition:transform 0.15s;}
        .adApplyBtnCard:hover{transform:translateY(-1px);}
        .adAppCards{display:flex;flex-direction:column;gap:14px;}
        .adAppCard{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:10px;}
        .adAppCardTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
        .adAppCardTitle{margin:0 0 4px;font-size:14px;font-weight:800;color:#f5f5f5;}.adAppCardMeta{margin:0;font-size:12.5px;color:rgba(245,245,245,0.45);}
        .adAppCardCover{margin:0;font-size:13px;color:rgba(245,245,245,0.45);font-style:italic;line-height:1.6;border-left:2px solid rgba(255,255,255,0.1);padding-left:12px;}
        .adAppCardDate{margin:0;font-size:11.5px;color:rgba(245,245,245,0.3);}
        .adForm{display:flex;flex-direction:column;gap:18px;background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:28px;}
        .adField{display:flex;flex-direction:column;gap:7px;}.adField label{font-size:12.5px;font-weight:700;color:rgba(245,245,245,0.65);}
        .adField input,.adField textarea{padding:0 14px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.04);color:#f5f5f5;font-size:13.5px;outline:none;font-family:inherit;transition:border-color 0.2s,box-shadow 0.2s;width:100%;box-sizing:border-box;}
        .adField textarea{height:auto;padding:11px 14px;resize:vertical;}
        .adField input::placeholder,.adField textarea::placeholder{color:rgba(245,245,245,0.22);}
        .adField input:focus,.adField textarea:focus{border-color:rgba(255,107,74,0.5);box-shadow:0 0 0 3px rgba(255,107,74,0.1);}
        .adSubmitBtn{height:50px;border-radius:999px;border:none;background:linear-gradient(135deg,#ff6b4a,#f7b733);color:#fff;font-size:15px;font-weight:900;cursor:pointer;font-family:inherit;transition:transform 0.2s,opacity 0.2s;}
        .adSubmitBtn:hover:not(:disabled){transform:translateY(-2px);}.adSubmitBtn:disabled{opacity:0.6;cursor:not-allowed;}
        .adOverlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;}
        .adModal{background:rgba(15,19,32,0.99);border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:32px 28px;max-width:460px;width:100%;display:flex;flex-direction:column;gap:16px;box-shadow:0 30px 80px rgba(0,0,0,0.6);}
        .adModalTitle{margin:0;font-size:18px;font-weight:900;color:#f5f5f5;}.adModalSub{margin:-8px 0 0;font-size:13px;color:rgba(245,245,245,0.45);}
        .adModalActions{display:flex;gap:10px;}
        .adApplyBtn{flex:1;height:46px;border-radius:999px;border:none;background:linear-gradient(135deg,#ff6b4a,#f7b733);color:#fff;font-size:14px;font-weight:900;cursor:pointer;font-family:inherit;}
        .adCancelBtn{height:46px;padding:0 20px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(245,245,245,0.6);font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;}
        @media(max-width:768px){.adPage{flex-direction:column;}.adSidebar{width:100%;height:auto;position:static;padding:12px;}.adNav{flex-direction:row;flex-wrap:wrap;}.adContent{padding:20px 16px;}.adStats{grid-template-columns:1fr 1fr;}}
      `}</style>
    </>
  );
}
