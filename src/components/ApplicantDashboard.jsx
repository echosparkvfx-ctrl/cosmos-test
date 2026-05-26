import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AppNavbar from "./AppNavbar.jsx";
import { notify } from "../lib/notify.js";

const SC = { applied:"#13b8c8",reviewed:"#f7b733",shortlisted:"#7ddfbb",interview:"#ff6b4a",rejected:"#ef4444",hired:"#22c55e" };
const STATUS_MSG = {
  applied:    "Application received. Waiting for review.",
  reviewed:   "Your profile is being reviewed by the recruiter.",
  shortlisted:"You've been shortlisted! Interview may be scheduled soon.",
  interview:  "Interview scheduled. Check your email for details.",
  hired:      "Congratulations! You've been selected.",
  rejected:   "Unfortunately you were not selected for this role.",
};
const TIMELINE = ["applied","reviewed","shortlisted","interview","hired"];
const JOB_TYPES = ["All","Full-time","Part-time","Contract","Remote","Internship"];

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
  const [submitting,   setSubmitting]  = React.useState(false);
  const [profileForm,  setProfileForm] = React.useState({ full_name:"",bio:"",skills:"",phone:"",linkedin:"" });
  const [savingProfile,setSavingProfile]= React.useState(false);
  const [uploadingResume, setUploadingResume] = React.useState(false);
  const [search,       setSearch]      = React.useState("");
  const [filterType,   setFilterType]  = React.useState("All");
  const [newStatusAlert, setNewStatusAlert] = React.useState(null);
  const userRef = React.useRef(null);

  React.useEffect(() => {
    init();
    const ch = supabase.channel("applicant-live")
      .on("postgres_changes",{event:"*",schema:"public",table:"jobs"},()=>fetchJobs())
      .on("postgres_changes",{event:"*",schema:"public",table:"applications"},(payload)=>{
        const uid = userRef.current?.id;
        if (!uid) return;
        if (payload.new?.applicant_id===uid||payload.old?.applicant_id===uid) {
          fetchApplications(uid);
          if (payload.new?.status && payload.new.status!==payload.old?.status) {
            setNewStatusAlert({ status:payload.new.status, msg:STATUS_MSG[payload.new.status] });
            setTimeout(()=>setNewStatusAlert(null),5000);
          }
        }
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const init = async () => {
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login"); return; }
    setUser(user); userRef.current = user;
    const { data:p } = await supabase.from("profiles").select("*").eq("id",user.id).single();
    setProfile(p);
    if (p) setProfileForm({ full_name:p.full_name||"", bio:p.bio||"", skills:p.skills||"", phone:p.phone||"", linkedin:p.linkedin||"" });
    await Promise.all([fetchJobs(), fetchApplications(user.id)]);
    setLoading(false);
  };

  const fetchJobs = async () => {
    const { data } = await supabase.from("jobs").select("*").eq("status","active").order("created_at",{ascending:false});
    setJobs(data||[]);
  };

  const fetchApplications = async (uid) => {
    const { data } = await supabase.from("applications")
      .select("*,jobs(title,company,location,type,salary_range,description)")
      .eq("applicant_id",uid).order("created_at",{ascending:false});
    setApplications(data||[]);
  };

  const applyToJob = async (jobId) => {
    if (applications.find(a=>a.job_id===jobId)) { showToast("Already applied."); return; }
    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({ job_id:jobId, applicant_id:user.id, cover_letter:coverLetter, status:"applied" });
    setSubmitting(false);
    if (error) { showToast("Error: "+error.message); return; }
    showToast("✅ Application submitted!");
    const job = jobs.find(j=>j.id===jobId);
    if (job?.posted_by) await notify(job.posted_by, "New Application", `${userName} applied for ${job.title}`);
    setCoverLetter(""); setApplying(null);
    await fetchApplications(user.id);
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingResume(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/resume.${ext}`;
    const { error: upErr } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (upErr) { showToast("Upload error: "+upErr.message); setUploadingResume(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("resumes").getPublicUrl(path);
    await supabase.from("profiles").update({ resume_url: publicUrl }).eq("id", user.id);
    setProfile(p=>({...p, resume_url: publicUrl}));
    showToast("✅ Resume uploaded!");
    setUploadingResume(false);
  };

  const withdrawApplication = async (appId) => {
    if (!window.confirm("Withdraw this application?")) return;
    await supabase.from("applications").delete().eq("id",appId);
    showToast("Application withdrawn.");
    await fetchApplications(user.id);
  };

  const saveProfile = async (e) => {
    e.preventDefault(); setSavingProfile(true);
    const { error } = await supabase.from("profiles")
      .update({ full_name:profileForm.full_name, bio:profileForm.bio, skills:profileForm.skills, phone:profileForm.phone, linkedin:profileForm.linkedin })
      .eq("id",user.id);
    setSavingProfile(false);
    if (error) { showToast("Error: "+error.message); return; }
    setProfile(p=>({...p,...profileForm}));
    showToast("✅ Profile saved!");
  };

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3000); };
  const hasApplied = (jobId) => applications.some(a=>a.job_id===jobId);
  const userName = profile?.full_name || user?.email?.split("@")[0] || "Applicant";

  const filteredJobs = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || (j.location||"").toLowerCase().includes(search.toLowerCase());
    const matchType = filterType==="All" || j.type===filterType;
    return matchSearch && matchType;
  });

  const profileComplete = [profile?.full_name, profile?.skills, profile?.bio].filter(Boolean).length;

  return (
    <>
      <AppNavbar role="applicant" userName={userName} userId={user?.id} onTabChange={setTab} />

      {toast && <div className="adToast">{toast}</div>}

      {/* Status alert banner */}
      {newStatusAlert && (
        <div className="adAlertBanner" style={{"--ac":SC[newStatusAlert.status]||"#13b8c8"}}>
          <span style={{fontWeight:900}}>Status Update:</span> {newStatusAlert.msg}
          <button onClick={()=>setNewStatusAlert(null)} style={{marginLeft:"auto",background:"none",border:"none",color:"inherit",cursor:"pointer",fontSize:16}}>✕</button>
        </div>
      )}

      {/* Apply Modal */}
      {applying && (
        <div className="adOverlay" onClick={()=>setApplying(null)}>
          <div className="adModal" onClick={e=>e.stopPropagation()}>
            <h3 className="adModalTitle">Apply — {applying.title}</h3>
            <p className="adModalSub">{applying.company} · {applying.location}</p>
            {applying.salary_range&&<p style={{margin:"0 0 12px",fontSize:13,color:"#7ddfbb",fontWeight:700}}>💰 {applying.salary_range}</p>}
            <div className="adField">
              <label>Cover Letter <span style={{color:"rgba(245,245,245,0.35)",fontWeight:500}}>(optional)</span></label>
              <textarea rows={5} placeholder="Why are you a great fit for this role? Highlight your relevant experience…"
                value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} />
            </div>
            <div className="adModalActions">
              <button className="adApplyBtn" onClick={()=>applyToJob(applying.id)} disabled={submitting}>
                {submitting?"Submitting…":"Submit Application"}
              </button>
              <button className="adCancelBtn" onClick={()=>setApplying(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <main className="adPage">
        <aside className="adSidebar">
          <nav className="adNav">
            {[
              {id:"overview",     icon:"📊", label:"Overview"},
              {id:"browse",       icon:"🔍", label:"Browse Jobs",      badge:jobs.length},
              {id:"applications", icon:"📨", label:"My Applications",  badge:applications.length},
              {id:"profile",      icon:"👤", label:"My Profile"},
            ].map(n=>(
              <button key={n.id} className={`adNavLink ${tab===n.id?"adNavActive":""}`} onClick={()=>setTab(n.id)}>
                <span>{n.icon}</span>{n.label}
                {n.badge>0&&<span className="adBadge">{n.badge}</span>}
              </button>
            ))}
          </nav>

          {/* Profile completeness */}
          <div className="adProfileCard">
            <p className="adProfileCardLabel">Profile Strength</p>
            <div className="adProgressBar">
              <div className="adProgressFill" style={{width:`${Math.round((profileComplete/3)*100)}%`}} />
            </div>
            <p className="adProfileCardPct">{Math.round((profileComplete/3)*100)}% complete</p>
            {profileComplete<3&&<button className="adProfileCardBtn" onClick={()=>setTab("profile")}>Complete profile →</button>}
          </div>
        </aside>

        <div className="adContent">

          {/* ── Overview ── */}
          {tab==="overview" && (
            <div className="adPanel">
              <h2 className="adTitle">Welcome back, {userName}!</h2>
              <div className="adStats">
                {[
                  {label:"Applied",     value:applications.length,                                     icon:"📨", color:"#ff6b4a"},
                  {label:"Shortlisted", value:applications.filter(a=>a.status==="shortlisted").length,  icon:"⭐", color:"#f7b733"},
                  {label:"Interviews",  value:applications.filter(a=>a.status==="interview").length,    icon:"📅", color:"#13b8c8"},
                  {label:"Jobs Open",   value:jobs.length,                                              icon:"💼", color:"#7ddfbb"},
                ].map(s=>(
                  <div className="adStatCard" key={s.label} style={{"--cc":s.color}}>
                    <span className="adStatIcon">{s.icon}</span>
                    <span className="adStatVal">{s.value}</span>
                    <span className="adStatLabel">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Recent applications status */}
              {applications.length>0&&(
                <div className="adSection">
                  <div className="adSectionHead">
                    <h3 className="adSectionTitle">Recent Applications</h3>
                    <button className="adLinkBtn" onClick={()=>setTab("applications")}>View all →</button>
                  </div>
                  <div className="adAppList">
                    {applications.slice(0,4).map(app=>(
                      <div className="adAppRow" key={app.id}>
                        <div className="adAppInfo">
                          <p className="adAppTitle">{app.jobs?.title||"—"}</p>
                          <p className="adAppMeta">{app.jobs?.company} · {app.jobs?.location}</p>
                        </div>
                        <span className="adStatusPill" style={{"--sc":SC[app.status]||"#13b8c8"}}>{app.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest jobs */}
              <div className="adSection">
                <div className="adSectionHead">
                  <h3 className="adSectionTitle">Latest Openings</h3>
                  <button className="adLinkBtn" onClick={()=>setTab("browse")}>Browse all →</button>
                </div>
                {jobs.length===0?<div className="adEmpty">No active jobs right now.</div>:(
                  <div className="adJobList">
                    {jobs.slice(0,4).map(job=>(
                      <div className="adJobRow" key={job.id}>
                        <div className="adJobInfo">
                          <p className="adJobTitle">{job.title}</p>
                          <p className="adJobMeta">{job.company} · {job.location} · {job.type}</p>
                          {job.salary_range&&<p className="adJobSalary">{job.salary_range}</p>}
                        </div>
                        {hasApplied(job.id)?<span className="adAppliedTag">Applied ✓</span>:<button className="adQuickApply" onClick={()=>setApplying(job)}>Apply</button>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Browse Jobs ── */}
          {tab==="browse" && (
            <div className="adPanel">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <h2 className="adTitle">Browse Jobs</h2>
                <span style={{fontSize:13,color:"rgba(245,245,245,0.4)"}}>{filteredJobs.length} job{filteredJobs.length!==1?"s":""} found</span>
              </div>

              {/* Search + Filter bar */}
              <div className="adSearchBar">
                <div className="adSearchInput">
                  <span style={{fontSize:16,opacity:0.5}}>🔍</span>
                  <input placeholder="Search by title, company, location…" value={search} onChange={e=>setSearch(e.target.value)} />
                  {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"rgba(245,245,245,0.4)",cursor:"pointer",fontSize:14}}>✕</button>}
                </div>
                <div className="adFilterRow">
                  {JOB_TYPES.map(t=>(
                    <button key={t} className={`adFilterPill ${filterType===t?"adFilterActive":""}`} onClick={()=>setFilterType(t)}>{t}</button>
                  ))}
                </div>
              </div>

              {loading?<div className="adEmpty">Loading…</div>:filteredJobs.length===0?(
                <div className="adEmpty">{search||filterType!=="All"?"No jobs match your filters.":"No active jobs right now. Check back soon!"}</div>
              ):(
                <div className="adJobCards">
                  {filteredJobs.map(job=>(
                    <div className="adJobCard" key={job.id}>
                      <div className="adJobCardTop">
                        <div style={{flex:1}}>
                          <p className="adJobCardTitle">{job.title}</p>
                          <p className="adJobCardMeta">{job.company} · {job.location}</p>
                          <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                            <span className="adTagPill">{job.type}</span>
                            {job.salary_range&&<span className="adTagPill" style={{color:"#7ddfbb",borderColor:"rgba(125,223,187,0.3)"}}>{job.salary_range}</span>}
                          </div>
                        </div>
                        {hasApplied(job.id)?<span className="adAppliedTag">Applied ✓</span>:<button className="adApplyBtnCard" onClick={()=>setApplying(job)}>Apply Now</button>}
                      </div>
                      {job.description&&<p className="adJobCardDesc">{job.description.slice(0,200)}{job.description.length>200?"…":""}</p>}
                      {job.requirements&&<p className="adJobCardReqs"><strong style={{color:"rgba(245,245,245,0.55)"}}>Requirements: </strong>{job.requirements.slice(0,150)}{job.requirements.length>150?"…":""}</p>}
                      <p className="adJobCardDate">Posted {job.created_at?.slice(0,10)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── My Applications ── */}
          {tab==="applications" && (
            <div className="adPanel">
              <h2 className="adTitle">My Applications</h2>
              {applications.length===0?(
                <div className="adEmpty">No applications yet. <button className="adLinkBtn" onClick={()=>setTab("browse")}>Browse jobs →</button></div>
              ):(
                <div className="adAppCards">
                  {applications.map(app=>(
                    <div className="adAppCard" key={app.id}>
                      <div className="adAppCardTop">
                        <div>
                          <p className="adAppCardTitle">{app.jobs?.title||"—"}</p>
                          <p className="adAppCardMeta">{app.jobs?.company} · {app.jobs?.location} · {app.jobs?.type}</p>
                          {app.jobs?.salary_range&&<p style={{margin:"4px 0 0",fontSize:12,color:"#7ddfbb",fontWeight:700}}>{app.jobs.salary_range}</p>}
                        </div>
                        <span className="adStatusPill" style={{"--sc":SC[app.status]||"#13b8c8"}}>{app.status}</span>
                      </div>

                      {/* Status message */}
                      <div className="adStatusMsg" style={{"--sc":SC[app.status]||"#13b8c8"}}>
                        {STATUS_MSG[app.status]||"In progress."}
                      </div>

                      {/* Timeline */}
                      {app.status!=="rejected"&&(
                        <div className="adTimeline">
                          {TIMELINE.map((stage,i)=>{
                            const idx = TIMELINE.indexOf(app.status);
                            const done = i<=idx;
                            return (
                              <React.Fragment key={stage}>
                                <div className="adTimelineStep">
                                  <div className="adTimelineDot" style={{background:done?SC[stage]:"rgba(255,255,255,0.1)",borderColor:done?SC[stage]:"rgba(255,255,255,0.15)"}} />
                                  <span className="adTimelineLabel" style={{color:done?"#f5f5f5":"rgba(245,245,245,0.3)",fontWeight:done?700:500}}>{stage.charAt(0).toUpperCase()+stage.slice(1)}</span>
                                </div>
                                {i<TIMELINE.length-1&&<div className="adTimelineLine" style={{background:i<idx?"#7ddfbb":"rgba(255,255,255,0.08)"}} />}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      )}

                      {app.cover_letter&&<p className="adAppCardCover">"{app.cover_letter.slice(0,140)}{app.cover_letter.length>140?"…":""}"</p>}
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <p className="adAppCardDate" style={{margin:0}}>Applied {app.created_at?.slice(0,10)}</p>
                        {(app.status==="applied"||app.status==="reviewed")&&(
                          <button className="adWithdrawBtn" onClick={()=>withdrawApplication(app.id)}>Withdraw</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Profile ── */}
          {tab==="profile" && (
            <div className="adPanel">
              <h2 className="adTitle">My Profile</h2>
              <form className="adForm" onSubmit={saveProfile}>
                <div className="adFormRow">
                  <div className="adField"><label>Full Name</label><input placeholder="Jane Smith" value={profileForm.full_name} onChange={e=>setProfileForm(f=>({...f,full_name:e.target.value}))} /></div>
                  <div className="adField"><label>Phone</label><input placeholder="+91 98765 43210" value={profileForm.phone} onChange={e=>setProfileForm(f=>({...f,phone:e.target.value}))} /></div>
                </div>
                <div className="adField"><label>Skills <span style={{color:"rgba(245,245,245,0.35)"}}>— helps recruiters find you</span></label><input placeholder="React, Node.js, Python, AWS, Figma…" value={profileForm.skills} onChange={e=>setProfileForm(f=>({...f,skills:e.target.value}))} /></div>
                <div className="adField"><label>Professional Summary</label><textarea rows={4} placeholder="Brief summary of your experience, goals and strengths…" value={profileForm.bio} onChange={e=>setProfileForm(f=>({...f,bio:e.target.value}))} /></div>
                <div className="adField"><label>LinkedIn URL</label><input placeholder="https://linkedin.com/in/yourname" value={profileForm.linkedin} onChange={e=>setProfileForm(f=>({...f,linkedin:e.target.value}))} /></div>
                <div className="adField" style={{pointerEvents:"none",opacity:0.4}}>
                  <label>Email</label>
                  <input value={user?.email||""} readOnly />
                </div>
                <div className="adResumeSection">
                  <p className="adResumeLabel">Resume / CV</p>
                  {profile?.resume_url && (
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="adResumeLink">📄 View current resume</a>
                  )}
                  <label className="adResumeUpload">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={uploadResume} style={{display:"none"}} disabled={uploadingResume} />
                    <span className="adResumeBtn">{uploadingResume ? "Uploading…" : profile?.resume_url ? "Replace Resume" : "Upload Resume"}</span>
                    <span className="adResumeHint">PDF, DOC, DOCX · Max 10MB</span>
                  </label>
                </div>
                <button type="submit" className="adSubmitBtn" disabled={savingProfile}>{savingProfile?"Saving…":"Save Profile"}</button>
              </form>
            </div>
          )}

        </div>
      </main>

      <style>{`
        .adToast{position:fixed;bottom:24px;right:24px;background:#1a2035;border:1px solid rgba(255,255,255,0.12);color:#f5f5f5;padding:12px 20px;border-radius:12px;z-index:9999;font-size:14px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:slideUp 0.3s ease;}
        @keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        .adAlertBanner{display:flex;align-items:center;gap:12px;padding:14px 24px;background:color-mix(in srgb,var(--ac) 12%,rgba(10,14,26,1));border-bottom:1px solid color-mix(in srgb,var(--ac) 30%,transparent);color:color-mix(in srgb,var(--ac) 90%,white);font-size:13.5px;font-weight:600;animation:slideDown 0.3s ease;}
        @keyframes slideDown{from{transform:translateY(-12px);opacity:0}to{transform:translateY(0);opacity:1}}
        .adPage{display:flex;min-height:calc(100vh - 64px);background:#07090f;}
        .adSidebar{width:220px;flex-shrink:0;background:rgba(10,14,26,0.9);border-right:1px solid rgba(255,255,255,0.07);padding:24px 12px;position:sticky;top:64px;height:calc(100vh - 64px);display:flex;flex-direction:column;gap:20px;overflow-y:auto;}
        .adNav{display:flex;flex-direction:column;gap:4px;}
        .adNavLink{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;border:none;background:none;color:rgba(245,245,245,0.5);font-size:13px;font-weight:700;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.18s;}
        .adNavLink:hover{color:#f5f5f5;background:rgba(255,255,255,0.05);}
        .adNavActive{color:#f5f5f5!important;background:rgba(167,139,250,0.1)!important;box-shadow:inset 2px 0 0 #a78bfa;}
        .adBadge{margin-left:auto;background:#a78bfa;color:#fff;font-size:10px;font-weight:900;min-width:18px;height:18px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px;}
        .adProfileCard{background:rgba(15,19,32,0.8);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px;}
        .adProfileCardLabel{margin:0 0 8px;font-size:11px;font-weight:700;color:rgba(245,245,245,0.4);text-transform:uppercase;letter-spacing:0.06em;}
        .adProgressBar{height:5px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;}
        .adProgressFill{height:100%;border-radius:999px;background:linear-gradient(90deg,#a78bfa,#c4b5fd);transition:width 0.4s ease;}
        .adProfileCardPct{margin:6px 0 8px;font-size:12px;font-weight:700;color:#f5f5f5;}
        .adProfileCardBtn{background:none;border:none;color:#a78bfa;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;}
        .adContent{flex:1;padding:32px 28px;min-width:0;}
        .adPanel{display:flex;flex-direction:column;gap:24px;max-width:900px;}
        .adTitle{margin:0;font-size:22px;font-weight:900;color:#f5f5f5;letter-spacing:-0.02em;}
        .adStats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .adStatCard{padding:18px 16px;border-radius:14px;background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-top:3px solid var(--cc);display:flex;flex-direction:column;gap:6px;}
        .adStatIcon{font-size:20px;}.adStatVal{font-size:26px;font-weight:950;color:#f5f5f5;line-height:1;}.adStatLabel{font-size:11px;color:rgba(245,245,245,0.4);font-weight:600;}
        .adSection{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;}
        .adSectionHead{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,0.06);}
        .adSectionTitle{margin:0;font-size:14px;font-weight:800;color:#f5f5f5;}
        .adLinkBtn{background:none;border:none;color:#a78bfa;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;}
        .adLinkBtn:hover{color:#c4b5fd;}
        .adJobList{display:flex;flex-direction:column;}
        .adJobRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.04);}
        .adJobRow:last-child{border-bottom:none;}
        .adJobInfo{flex:1;}.adJobTitle{margin:0 0 3px;font-size:13.5px;font-weight:750;color:#f5f5f5;}.adJobMeta{margin:0 0 2px;font-size:12px;color:rgba(245,245,245,0.4);}.adJobSalary{margin:0;font-size:12px;color:#7ddfbb;font-weight:700;}
        .adQuickApply{height:32px;padding:0 14px;border-radius:999px;border:none;background:linear-gradient(135deg,#a78bfa,#c4b5fd);color:#fff;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit;flex-shrink:0;}
        .adAppliedTag{font-size:12px;font-weight:800;color:#7ddfbb;background:rgba(125,223,187,0.1);border:1px solid rgba(125,223,187,0.25);padding:4px 12px;border-radius:999px;flex-shrink:0;}
        .adAppList{display:flex;flex-direction:column;}
        .adAppRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 20px;border-bottom:1px solid rgba(255,255,255,0.04);}
        .adAppRow:last-child{border-bottom:none;}
        .adAppInfo{flex:1;}.adAppTitle{margin:0 0 2px;font-size:13px;font-weight:750;color:#f5f5f5;}.adAppMeta{margin:0;font-size:12px;color:rgba(245,245,245,0.4);}
        .adStatusPill{display:inline-flex;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;background:color-mix(in srgb,var(--sc) 14%,transparent);color:var(--sc);border:1px solid color-mix(in srgb,var(--sc) 28%,transparent);text-transform:capitalize;flex-shrink:0;}
        /* Search bar */
        .adSearchBar{display:flex;flex-direction:column;gap:12px;background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px;}
        .adSearchInput{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0 14px;height:44px;}
        .adSearchInput input{flex:1;background:none;border:none;outline:none;color:#f5f5f5;font-size:13.5px;font-family:inherit;}
        .adSearchInput input::placeholder{color:rgba(245,245,245,0.25);}
        .adFilterRow{display:flex;gap:8px;flex-wrap:wrap;}
        .adFilterPill{height:30px;padding:0 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(245,245,245,0.5);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.15s;}
        .adFilterPill:hover{color:#f5f5f5;border-color:rgba(255,255,255,0.25);}
        .adFilterActive{background:rgba(167,139,250,0.12)!important;color:#a78bfa!important;border-color:rgba(167,139,250,0.3)!important;}
        /* Job cards */
        .adJobCards{display:flex;flex-direction:column;gap:14px;}
        .adJobCard{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:10px;transition:border-color 0.15s;}
        .adJobCard:hover{border-color:rgba(255,255,255,0.15);}
        .adJobCardTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
        .adJobCardTitle{margin:0 0 4px;font-size:15px;font-weight:800;color:#f5f5f5;}.adJobCardMeta{margin:0;font-size:12.5px;color:rgba(245,245,245,0.45);}
        .adTagPill{display:inline-flex;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,0.15);color:rgba(245,245,245,0.6);}
        .adJobCardDesc{margin:0;font-size:13px;color:rgba(245,245,245,0.45);line-height:1.6;}.adJobCardReqs{margin:0;font-size:12.5px;color:rgba(245,245,245,0.4);line-height:1.6;}.adJobCardDate{margin:0;font-size:11.5px;color:rgba(245,245,245,0.3);}
        .adApplyBtnCard{height:38px;padding:0 18px;border-radius:999px;border:none;background:linear-gradient(135deg,#a78bfa,#c4b5fd);color:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;flex-shrink:0;transition:transform 0.15s;}
        .adApplyBtnCard:hover{transform:translateY(-1px);}
        .adEmpty{padding:40px 20px;text-align:center;color:rgba(245,245,245,0.35);font-size:14px;}
        /* Application cards */
        .adAppCards{display:flex;flex-direction:column;gap:14px;}
        .adAppCard{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:12px;}
        .adAppCardTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
        .adAppCardTitle{margin:0 0 4px;font-size:14px;font-weight:800;color:#f5f5f5;}.adAppCardMeta{margin:0;font-size:12.5px;color:rgba(245,245,245,0.45);}
        .adStatusMsg{font-size:12.5px;color:color-mix(in srgb,var(--sc) 80%,white);background:color-mix(in srgb,var(--sc) 8%,transparent);border:1px solid color-mix(in srgb,var(--sc) 20%,transparent);border-radius:8px;padding:8px 12px;font-weight:600;}
        /* Timeline */
        .adTimeline{display:flex;align-items:center;gap:0;overflow-x:auto;padding:4px 0;}
        .adTimelineStep{display:flex;flex-direction:column;align-items:center;gap:5px;flex-shrink:0;}
        .adTimelineDot{width:10px;height:10px;border-radius:50%;border:2px solid;transition:all 0.3s;}
        .adTimelineLabel{font-size:10px;font-weight:600;text-transform:capitalize;white-space:nowrap;}
        .adTimelineLine{flex:1;height:2px;min-width:20px;margin-bottom:14px;}
        .adAppCardCover{margin:0;font-size:13px;color:rgba(245,245,245,0.45);font-style:italic;line-height:1.6;border-left:2px solid rgba(255,255,255,0.1);padding-left:12px;}
        .adAppCardDate{margin:0;font-size:11.5px;color:rgba(245,245,245,0.3);}
        .adWithdrawBtn{height:28px;padding:0 12px;border-radius:999px;border:1px solid rgba(239,68,68,0.25);background:rgba(239,68,68,0.06);color:#f87171;font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:background 0.15s;}
        .adWithdrawBtn:hover{background:rgba(239,68,68,0.14);}
        /* Profile form */
        .adForm{display:flex;flex-direction:column;gap:18px;background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:28px;}
        .adFormRow{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .adField{display:flex;flex-direction:column;gap:7px;}.adField label{font-size:12.5px;font-weight:700;color:rgba(245,245,245,0.65);}
        .adField input,.adField textarea{padding:0 14px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.04);color:#f5f5f5;font-size:13.5px;outline:none;font-family:inherit;transition:border-color 0.2s;width:100%;box-sizing:border-box;}
        .adField textarea{height:auto;padding:11px 14px;resize:vertical;}
        .adField input::placeholder,.adField textarea::placeholder{color:rgba(245,245,245,0.22);}
        .adField input:focus,.adField textarea:focus{border-color:rgba(167,139,250,0.5);box-shadow:0 0 0 3px rgba(167,139,250,0.1);}
        .adResumeSection{display:flex;flex-direction:column;gap:10px;padding:16px;background:rgba(167,139,250,0.04);border:1px solid rgba(167,139,250,0.15);border-radius:12px;}
        .adResumeLabel{margin:0;font-size:12.5px;font-weight:700;color:rgba(245,245,245,0.65);}
        .adResumeLink{font-size:13px;font-weight:600;color:#a78bfa;text-decoration:none;}
        .adResumeLink:hover{color:#c4b5fd;}
        .adResumeUpload{display:flex;align-items:center;gap:14px;cursor:pointer;}
        .adResumeBtn{height:38px;padding:0 18px;border-radius:999px;border:1px solid rgba(167,139,250,0.3);background:rgba(167,139,250,0.08);color:#a78bfa;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:background 0.15s;white-space:nowrap;}
        .adResumeBtn:hover{background:rgba(167,139,250,0.15);}
        .adResumeHint{font-size:11.5px;color:rgba(245,245,245,0.3);}
        .adSubmitBtn{height:50px;border-radius:999px;border:none;background:linear-gradient(135deg,#a78bfa,#c4b5fd);color:#fff;font-size:15px;font-weight:900;cursor:pointer;font-family:inherit;transition:transform 0.2s,opacity 0.2s;}
        .adSubmitBtn:hover:not(:disabled){transform:translateY(-2px);}.adSubmitBtn:disabled{opacity:0.6;cursor:not-allowed;}
        /* Modal */
        .adOverlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;}
        .adModal{background:rgba(12,16,28,0.99);border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:28px;max-width:460px;width:100%;display:flex;flex-direction:column;gap:16px;box-shadow:0 30px 80px rgba(0,0,0,0.6);}
        .adModalTitle{margin:0;font-size:18px;font-weight:900;color:#f5f5f5;}.adModalSub{margin:-8px 0 0;font-size:13px;color:rgba(245,245,245,0.45);}
        .adModalActions{display:flex;gap:10px;}
        .adApplyBtn{flex:1;height:46px;border-radius:999px;border:none;background:linear-gradient(135deg,#a78bfa,#c4b5fd);color:#fff;font-size:14px;font-weight:900;cursor:pointer;font-family:inherit;transition:opacity 0.2s;}
        .adApplyBtn:disabled{opacity:0.6;cursor:not-allowed;}
        .adCancelBtn{height:46px;padding:0 20px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(245,245,245,0.6);font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;}
        @media(max-width:768px){.adPage{flex-direction:column;}.adSidebar{width:100%;height:auto;position:static;padding:12px;}.adNav{flex-direction:row;flex-wrap:wrap;}.adContent{padding:20px 16px;}.adStats{grid-template-columns:1fr 1fr;}.adFormRow{grid-template-columns:1fr;}}
      `}</style>
    </>
  );
}
