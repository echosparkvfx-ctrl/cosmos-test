import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AppNavbar from "./AppNavbar.jsx";

const SC = { submitted:"#13b8c8",reviewing:"#f7b733",shortlisted:"#7ddfbb",rejected:"#ef4444",placed:"#22c55e" };
const STATUS_MSG = { submitted:"Submitted. Waiting for recruiter review.",reviewing:"Recruiter is reviewing your candidate.",shortlisted:"Candidate shortlisted!",rejected:"Not selected for this role.",placed:"✅ Candidate placed! Great work." };
const JOB_TYPES = ["All","Full-time","Part-time","Contract","Remote","Internship"];

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
  const [saving,      setSaving]     = React.useState(false);
  const [filterType,  setFilterType] = React.useState("All");
  const [search,      setSearch]     = React.useState("");
  const [subForm,     setSubForm]    = React.useState({ candidate_name:"",candidate_email:"",skills:"",experience:"",notes:"" });
  const [newStatusAlert, setNewStatusAlert] = React.useState(null);

  React.useEffect(() => {
    init();
    const ch = supabase.channel("vendor-live")
      .on("postgres_changes",{event:"*",schema:"public",table:"jobs"},()=>fetchJobs())
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"vendor_submissions"},(payload)=>{
        if (payload.new?.status && payload.new.status!==payload.old?.status) {
          setSubmissions(prev=>prev.map(s=>s.id===payload.new.id?{...s,status:payload.new.status}:s));
          setNewStatusAlert({status:payload.new.status, name:payload.new.candidate_name});
          setTimeout(()=>setNewStatusAlert(null),5000);
        }
      })
      .subscribe();
    return ()=>supabase.removeChannel(ch);
  }, []);

  const init = async () => {
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login/vendor"); return; }
    setUser(user);
    const { data:p } = await supabase.from("profiles").select("*").eq("id",user.id).single();
    setProfile(p);
    await Promise.all([fetchJobs(),fetchSubmissions(user.id)]);
    setLoading(false);
  };

  const fetchJobs = async () => {
    const { data } = await supabase.from("jobs").select("*").eq("status","active").order("created_at",{ascending:false});
    setJobs(data||[]);
  };

  const fetchSubmissions = async (uid) => {
    const { data } = await supabase.from("vendor_submissions")
      .select("*,jobs(title,company,location,type)")
      .eq("vendor_id",uid).order("created_at",{ascending:false});
    setSubmissions(data||[]);
  };

  const submitCandidate = async (e) => {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("vendor_submissions").insert({ vendor_id:user.id, job_id:submitting.id, ...subForm, status:"submitted" });
    setSaving(false);
    if (error) { showToast("Error: "+error.message); return; }
    showToast("✅ Candidate submitted!");
    setSubForm({candidate_name:"",candidate_email:"",skills:"",experience:"",notes:""});
    setSubmitting(null);
    await fetchSubmissions(user.id);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3000); };
  const userName = profile?.full_name || user?.email?.split("@")[0] || "Vendor";

  const filteredJobs = jobs.filter(j=>{
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType==="All" || j.type===filterType;
    return matchSearch && matchType;
  });

  const placed     = submissions.filter(s=>s.status==="placed").length;
  const shortlisted= submissions.filter(s=>s.status==="shortlisted").length;
  const placement  = submissions.length ? Math.round((placed/submissions.length)*100) : 0;

  return (
    <>
      <AppNavbar role="vendor" userName={userName} />

      {toast && <div className="vdToast">{toast}</div>}

      {newStatusAlert && (
        <div className="vdAlertBanner" style={{"--ac":SC[newStatusAlert.status]||"#13b8c8"}}>
          <span style={{fontWeight:900}}>Candidate Update:</span> {newStatusAlert.name} → <span style={{textTransform:"capitalize"}}>{newStatusAlert.status}</span>
          <button onClick={()=>setNewStatusAlert(null)} style={{marginLeft:"auto",background:"none",border:"none",color:"inherit",cursor:"pointer",fontSize:16}}>✕</button>
        </div>
      )}

      {/* Submit Modal */}
      {submitting && (
        <div className="vdOverlay" onClick={()=>setSubmitting(null)}>
          <div className="vdModal" onClick={e=>e.stopPropagation()}>
            <h3 className="vdModalTitle">Submit Candidate</h3>
            <p className="vdModalSub">For: <strong style={{color:"#7ddfbb"}}>{submitting.title}</strong> at {submitting.company}</p>
            <form className="vdModalForm" onSubmit={submitCandidate}>
              <div className="vdFormRow">
                <div className="vdField"><label>Candidate Name *</label><input required placeholder="John Doe" value={subForm.candidate_name} onChange={e=>setSubForm(f=>({...f,candidate_name:e.target.value}))} /></div>
                <div className="vdField"><label>Candidate Email *</label><input required type="email" placeholder="candidate@email.com" value={subForm.candidate_email} onChange={e=>setSubForm(f=>({...f,candidate_email:e.target.value}))} /></div>
              </div>
              <div className="vdField"><label>Skills</label><input placeholder="React, Node.js, AWS, 5 years exp…" value={subForm.skills} onChange={e=>setSubForm(f=>({...f,skills:e.target.value}))} /></div>
              <div className="vdField"><label>Experience</label><input placeholder="5+ years full-stack development" value={subForm.experience} onChange={e=>setSubForm(f=>({...f,experience:e.target.value}))} /></div>
              <div className="vdField"><label>Notes</label><textarea rows={3} placeholder="Why this candidate is a great fit…" value={subForm.notes} onChange={e=>setSubForm(f=>({...f,notes:e.target.value}))} /></div>
              <div className="vdModalActions">
                <button type="submit" className="vdSubmitBtn" disabled={saving}>{saving?"Submitting…":"Submit Candidate"}</button>
                <button type="button" className="vdCancelBtn" onClick={()=>setSubmitting(null)}>Cancel</button>
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
              {id:"jobs",        icon:"💼", label:"Available Jobs",  badge:jobs.length},
              {id:"submissions", icon:"📤", label:"My Submissions",  badge:submissions.length},
            ].map(n=>(
              <button key={n.id} className={`vdNavLink ${tab===n.id?"vdNavActive":""}`} onClick={()=>setTab(n.id)}>
                <span>{n.icon}</span>{n.label}
                {n.badge>0&&<span className="vdBadge">{n.badge}</span>}
              </button>
            ))}
          </nav>

          {/* Performance card */}
          {submissions.length>0&&(
            <div className="vdPerfCard">
              <p className="vdPerfLabel">Placement Rate</p>
              <p className="vdPerfVal">{placement}%</p>
              <div className="vdPerfBar"><div style={{width:`${placement}%`,height:"100%",background:"linear-gradient(90deg,#7ddfbb,#13b8c8)",borderRadius:999}} /></div>
              <p className="vdPerfSub">{placed} placed of {submissions.length} submitted</p>
            </div>
          )}
        </aside>

        <div className="vdContent">

          {/* ── Overview ── */}
          {tab==="overview" && (
            <div className="vdPanel">
              <h2 className="vdTitle">Welcome, {userName}!</h2>
              <div className="vdStats">
                {[
                  {label:"Open Positions",  value:jobs.length,          icon:"💼", color:"#7ddfbb"},
                  {label:"Submitted",       value:submissions.length,    icon:"📤", color:"#13b8c8"},
                  {label:"Shortlisted",     value:shortlisted,           icon:"⭐", color:"#f7b733"},
                  {label:"Placed",          value:placed,                icon:"✅", color:"#22c55e"},
                ].map(s=>(
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
                  <button className="vdLinkBtn" onClick={()=>setTab("jobs")}>View all →</button>
                </div>
                {jobs.length===0?<div className="vdEmpty">No active positions right now.</div>:(
                  <div className="vdJobList">
                    {jobs.slice(0,4).map(job=>(
                      <div className="vdJobRow" key={job.id}>
                        <div className="vdJobInfo">
                          <p className="vdJobTitle">{job.title}</p>
                          <p className="vdJobMeta">{job.company} · {job.location} · {job.type}</p>
                          {job.salary_range&&<p className="vdJobSalary">{job.salary_range}</p>}
                        </div>
                        <button className="vdSubmitCandBtn" onClick={()=>setSubmitting(job)}>Submit Candidate</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {submissions.length>0&&(
                <div className="vdSection">
                  <div className="vdSectionHead">
                    <h3 className="vdSectionTitle">Recent Submissions</h3>
                    <button className="vdLinkBtn" onClick={()=>setTab("submissions")}>View all →</button>
                  </div>
                  <div className="vdJobList">
                    {submissions.slice(0,3).map(sub=>(
                      <div className="vdJobRow" key={sub.id} style={{cursor:"default"}}>
                        <div className="vdJobInfo">
                          <p className="vdJobTitle">{sub.candidate_name}</p>
                          <p className="vdJobMeta">{sub.jobs?.title} · {sub.jobs?.company}</p>
                        </div>
                        <span className="vdStatusPill" style={{"--sc":SC[sub.status]||"#13b8c8"}}>{sub.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Available Jobs ── */}
          {tab==="jobs" && (
            <div className="vdPanel">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <h2 className="vdTitle">Available Jobs</h2>
                <span style={{fontSize:13,color:"rgba(245,245,245,0.4)"}}>{filteredJobs.length} open position{filteredJobs.length!==1?"s":""}</span>
              </div>
              <div className="vdSearchBar">
                <div className="vdSearchInput">
                  <span style={{fontSize:16,opacity:0.5}}>🔍</span>
                  <input placeholder="Search by title or company…" value={search} onChange={e=>setSearch(e.target.value)} />
                  {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"rgba(245,245,245,0.4)",cursor:"pointer",fontSize:14}}>✕</button>}
                </div>
                <div className="vdFilterRow">
                  {JOB_TYPES.map(t=>(
                    <button key={t} className={`vdFilterPill ${filterType===t?"vdFilterActive":""}`} onClick={()=>setFilterType(t)}>{t}</button>
                  ))}
                </div>
              </div>
              {loading?<div className="vdEmpty">Loading…</div>:filteredJobs.length===0?<div className="vdEmpty">No jobs match your filters.</div>:(
                <div className="vdJobCards">
                  {filteredJobs.map(job=>(
                    <div className="vdJobCard" key={job.id}>
                      <div className="vdJobCardTop">
                        <div style={{flex:1}}>
                          <p className="vdJobCardTitle">{job.title}</p>
                          <p className="vdJobCardMeta">{job.company} · {job.location}</p>
                          <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
                            <span className="vdTagPill">{job.type}</span>
                            {job.salary_range&&<span className="vdTagPill" style={{color:"#7ddfbb",borderColor:"rgba(125,223,187,0.3)"}}>{job.salary_range}</span>}
                          </div>
                        </div>
                        <button className="vdSubmitCandBtn" onClick={()=>setSubmitting(job)}>Submit Candidate</button>
                      </div>
                      {job.description&&<p className="vdJobCardDesc">{job.description.slice(0,200)}{job.description.length>200?"…":""}</p>}
                      {job.requirements&&<p className="vdJobCardReqs"><strong style={{color:"rgba(245,245,245,0.55)"}}>Requirements: </strong>{job.requirements}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── My Submissions ── */}
          {tab==="submissions" && (
            <div className="vdPanel">
              <h2 className="vdTitle">My Submissions</h2>
              {submissions.length===0?<div className="vdEmpty">No submissions yet. <button className="vdLinkBtn" onClick={()=>setTab("jobs")}>Browse jobs →</button></div>:(
                <div className="vdSubCards">
                  {submissions.map(sub=>(
                    <div className="vdSubCard" key={sub.id}>
                      <div className="vdSubTop">
                        <div className="vdSubAvatar">{sub.candidate_name?.charAt(0).toUpperCase()||"C"}</div>
                        <div style={{flex:1}}>
                          <p className="vdSubName">{sub.candidate_name}</p>
                          <p className="vdSubEmail">{sub.candidate_email}</p>
                          {sub.skills&&<p className="vdSubSkills">{sub.skills}</p>}
                        </div>
                        <div style={{textAlign:"right"}}>
                          <span className="vdStatusPill" style={{"--sc":SC[sub.status]||"#13b8c8"}}>{sub.status}</span>
                          <p className="vdSubDate">{sub.created_at?.slice(0,10)}</p>
                        </div>
                      </div>
                      <div className="vdSubStatusMsg" style={{"--sc":SC[sub.status]||"#13b8c8"}}>{STATUS_MSG[sub.status]||""}</div>
                      <p className="vdSubJob">📋 {sub.jobs?.title} at {sub.jobs?.company} · {sub.jobs?.location}</p>
                      {sub.experience&&<p className="vdSubExp">Experience: {sub.experience}</p>}
                      {sub.notes&&<p style={{margin:0,fontSize:12.5,color:"rgba(245,245,245,0.4)",fontStyle:"italic"}}>"{sub.notes}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <style>{`
        .vdToast{position:fixed;bottom:24px;right:24px;background:#1a2035;border:1px solid rgba(255,255,255,0.12);color:#f5f5f5;padding:12px 20px;border-radius:12px;z-index:9999;font-size:14px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:slideUp 0.3s ease;}
        @keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        .vdAlertBanner{display:flex;align-items:center;gap:12px;padding:14px 24px;background:color-mix(in srgb,var(--ac) 12%,rgba(10,14,26,1));border-bottom:1px solid color-mix(in srgb,var(--ac) 30%,transparent);color:color-mix(in srgb,var(--ac) 90%,white);font-size:13.5px;font-weight:600;}
        .vdPage{display:flex;min-height:calc(100vh - 64px);background:#07090f;}
        .vdSidebar{width:220px;flex-shrink:0;background:rgba(10,14,26,0.9);border-right:1px solid rgba(255,255,255,0.07);padding:24px 12px;position:sticky;top:64px;height:calc(100vh - 64px);display:flex;flex-direction:column;gap:20px;overflow-y:auto;}
        .vdNav{display:flex;flex-direction:column;gap:4px;}
        .vdNavLink{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;border:none;background:none;color:rgba(245,245,245,0.5);font-size:13px;font-weight:700;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.18s;}
        .vdNavLink:hover{color:#f5f5f5;background:rgba(255,255,255,0.05);}
        .vdNavActive{color:#f5f5f5!important;background:rgba(125,223,187,0.1)!important;box-shadow:inset 2px 0 0 #7ddfbb;}
        .vdBadge{margin-left:auto;background:#7ddfbb;color:#0a0e1a;font-size:10px;font-weight:900;min-width:18px;height:18px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px;}
        .vdPerfCard{background:rgba(15,19,32,0.8);border:1px solid rgba(125,223,187,0.15);border-radius:12px;padding:14px;}
        .vdPerfLabel{margin:0 0 6px;font-size:11px;font-weight:700;color:rgba(245,245,245,0.4);text-transform:uppercase;letter-spacing:0.06em;}
        .vdPerfVal{margin:0 0 8px;font-size:28px;font-weight:950;color:#7ddfbb;line-height:1;}
        .vdPerfBar{height:5px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;margin-bottom:6px;}
        .vdPerfSub{margin:0;font-size:11px;color:rgba(245,245,245,0.35);font-weight:600;}
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
        /* Search */
        .vdSearchBar{display:flex;flex-direction:column;gap:12px;background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px;}
        .vdSearchInput{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0 14px;height:44px;}
        .vdSearchInput input{flex:1;background:none;border:none;outline:none;color:#f5f5f5;font-size:13.5px;font-family:inherit;}
        .vdSearchInput input::placeholder{color:rgba(245,245,245,0.25);}
        .vdFilterRow{display:flex;gap:8px;flex-wrap:wrap;}
        .vdFilterPill{height:30px;padding:0 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(245,245,245,0.5);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.15s;}
        .vdFilterPill:hover{color:#f5f5f5;border-color:rgba(255,255,255,0.25);}
        .vdFilterActive{background:rgba(125,223,187,0.12)!important;color:#7ddfbb!important;border-color:rgba(125,223,187,0.3)!important;}
        /* Job cards */
        .vdJobCards{display:flex;flex-direction:column;gap:14px;}
        .vdJobCard{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:10px;transition:border-color 0.15s;}
        .vdJobCard:hover{border-color:rgba(255,255,255,0.15);}
        .vdJobCardTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
        .vdJobCardTitle{margin:0 0 4px;font-size:15px;font-weight:800;color:#f5f5f5;}.vdJobCardMeta{margin:0;font-size:12.5px;color:rgba(245,245,245,0.45);}
        .vdTagPill{display:inline-flex;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,0.15);color:rgba(245,245,245,0.6);}
        .vdJobCardDesc{margin:0;font-size:13px;color:rgba(245,245,245,0.45);line-height:1.6;}.vdJobCardReqs{margin:0;font-size:12.5px;color:rgba(245,245,245,0.4);line-height:1.6;}
        .vdStatusPill{display:inline-flex;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;background:color-mix(in srgb,var(--sc) 14%,transparent);color:var(--sc);border:1px solid color-mix(in srgb,var(--sc) 28%,transparent);text-transform:capitalize;}
        /* Submission cards */
        .vdSubCards{display:flex;flex-direction:column;gap:14px;}
        .vdSubCard{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:10px;}
        .vdSubTop{display:flex;align-items:center;gap:14px;}
        .vdSubAvatar{width:40px;height:40px;border-radius:50%;background:rgba(125,223,187,0.15);border:1px solid rgba(125,223,187,0.3);color:#7ddfbb;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;flex-shrink:0;}
        .vdSubName{margin:0 0 2px;font-size:14px;font-weight:800;color:#f5f5f5;}.vdSubEmail{margin:0 0 2px;font-size:12px;color:rgba(245,245,245,0.4);}.vdSubSkills{margin:0;font-size:12px;color:#7ddfbb;font-weight:600;}
        .vdSubDate{margin:4px 0 0;font-size:11px;color:rgba(245,245,245,0.3);}
        .vdSubStatusMsg{font-size:12.5px;color:color-mix(in srgb,var(--sc) 80%,white);background:color-mix(in srgb,var(--sc) 8%,transparent);border:1px solid color-mix(in srgb,var(--sc) 20%,transparent);border-radius:8px;padding:8px 12px;font-weight:600;}
        .vdSubJob{margin:0;font-size:13px;color:rgba(245,245,245,0.5);}.vdSubExp{margin:0;font-size:12.5px;color:rgba(245,245,245,0.4);}
        /* Modal */
        .vdOverlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;}
        .vdModal{background:rgba(12,16,28,0.99);border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:28px;max-width:500px;width:100%;box-shadow:0 30px 80px rgba(0,0,0,0.6);max-height:90vh;overflow-y:auto;}
        .vdModalTitle{margin:0 0 4px;font-size:18px;font-weight:900;color:#f5f5f5;}.vdModalSub{margin:0 0 16px;font-size:13px;color:rgba(245,245,245,0.45);}
        .vdModalForm{display:flex;flex-direction:column;gap:14px;}
        .vdFormRow{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .vdField{display:flex;flex-direction:column;gap:6px;}.vdField label{font-size:12px;font-weight:700;color:rgba(245,245,245,0.65);}
        .vdField input,.vdField textarea{padding:0 12px;height:42px;border-radius:10px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.04);color:#f5f5f5;font-size:13.5px;outline:none;font-family:inherit;width:100%;box-sizing:border-box;}
        .vdField textarea{height:auto;padding:10px 12px;resize:vertical;}
        .vdField input::placeholder,.vdField textarea::placeholder{color:rgba(245,245,245,0.22);}
        .vdField input:focus,.vdField textarea:focus{border-color:rgba(125,223,187,0.5);box-shadow:0 0 0 3px rgba(125,223,187,0.1);}
        .vdModalActions{display:flex;gap:10px;margin-top:4px;}
        .vdSubmitBtn{flex:1;height:46px;border-radius:999px;border:none;background:linear-gradient(135deg,#7ddfbb,#13b8c8);color:#0a0e1a;font-size:14px;font-weight:900;cursor:pointer;font-family:inherit;transition:opacity 0.2s;}
        .vdSubmitBtn:disabled{opacity:0.6;cursor:not-allowed;}
        .vdCancelBtn{height:46px;padding:0 20px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(245,245,245,0.6);font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;}
        @media(max-width:768px){.vdPage{flex-direction:column;}.vdSidebar{width:100%;height:auto;position:static;padding:12px;}.vdNav{flex-direction:row;flex-wrap:wrap;}.vdContent{padding:20px 16px;}.vdStats{grid-template-columns:1fr 1fr;}.vdFormRow{grid-template-columns:1fr;}}
      `}</style>
    </>
  );
}
