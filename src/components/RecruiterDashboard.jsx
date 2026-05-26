import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AppNavbar from "./AppNavbar.jsx";

const STATUS_COLORS = {
  applied:"#13b8c8", reviewed:"#f7b733", shortlisted:"#7ddfbb",
  interview:"#ff6b4a", rejected:"#ef4444", hired:"#22c55e",
};
const SUB_STATUS_COLORS = {
  submitted:"#13b8c8", reviewing:"#f7b733", shortlisted:"#7ddfbb",
  rejected:"#ef4444", placed:"#22c55e",
};
const JOB_TYPES = ["Full-time","Part-time","Contract","Remote","Internship"];

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [user,         setUser]        = React.useState(null);
  const [profile,      setProfile]     = React.useState(null);
  const [tab,          setTab]         = React.useState("overview");
  const [jobs,         setJobs]        = React.useState([]);
  const [applications, setApplications]= React.useState([]);
  const [submissions,  setSubmissions] = React.useState([]);
  const [appCounts,    setAppCounts]   = React.useState({});
  const [totalApps,    setTotalApps]   = React.useState(0);
  const [selectedJob,  setSelectedJob] = React.useState(null);
  const [loading,      setLoading]     = React.useState(true);
  const [toast,        setToast]       = React.useState("");
  const [jobForm,      setJobForm]     = React.useState({
    title:"", company:"", location:"", type:"Full-time",
    description:"", requirements:"", salary_range:"",
  });
  const [posting, setPosting] = React.useState(false);

  const selectedJobRef = React.useRef(null);
  const jobIdsRef      = React.useRef([]);

  React.useEffect(() => {
    init();
    const channel = supabase
      .channel("recruiter-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "applications" }, () => {
        if (selectedJobRef.current) fetchApplications(selectedJobRef.current.id);
        fetchAppCounts(jobIdsRef.current);
        showToast("🔔 New application received!");
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "vendor_submissions" }, () => {
        fetchSubmissions(jobIdsRef.current);
        showToast("🤝 New vendor submission!");
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const init = async () => {
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login/recruiter"); return; }
    setUser(user);
    const { data:p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(p);
    const jobsData = await fetchJobs(user.id);
    const ids = (jobsData || []).map(j => j.id);
    jobIdsRef.current = ids;
    await Promise.all([fetchSubmissions(ids), fetchAppCounts(ids)]);
  };

  const fetchJobs = async (uid) => {
    const { data } = await supabase.from("jobs").select("*")
      .eq("posted_by", uid).order("created_at", { ascending:false });
    setJobs(data || []);
    setLoading(false);
    return data || [];
  };

  const fetchApplications = async (jobId) => {
    const { data: apps } = await supabase.from("applications")
      .select("*").eq("job_id", jobId).order("created_at", { ascending: false });
    if (!apps || apps.length === 0) { setApplications([]); return; }
    const ids = apps.map(a => a.applicant_id);
    const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
    const profMap = Object.fromEntries((profs || []).map(p => [p.id, p]));
    setApplications(apps.map(a => ({ ...a, profiles: profMap[a.applicant_id] || null })));
  };

  const fetchSubmissions = async (ids) => {
    if (!ids.length) { setSubmissions([]); return; }
    const { data } = await supabase.from("vendor_submissions")
      .select("*, jobs(title, company)")
      .in("job_id", ids).order("created_at", { ascending: false });
    setSubmissions(data || []);
  };

  const fetchAppCounts = async (ids) => {
    if (!ids.length) { setTotalApps(0); setAppCounts({}); return; }
    const { data } = await supabase.from("applications").select("job_id").in("job_id", ids);
    const counts = {};
    let total = 0;
    (data || []).forEach(a => { counts[a.job_id] = (counts[a.job_id] || 0) + 1; total++; });
    setAppCounts(counts);
    setTotalApps(total);
  };

  const openJob = async (job) => {
    setSelectedJob(job); selectedJobRef.current = job; setTab("applicants");
    await fetchApplications(job.id);
  };

  const updateStatus = async (appId, status) => {
    await supabase.from("applications").update({ status }).eq("id", appId);
    setApplications(prev => prev.map(a => a.id===appId ? {...a, status} : a));
    showToast("Status updated to " + status);
  };

  const updateSubStatus = async (subId, status) => {
    await supabase.from("vendor_submissions").update({ status }).eq("id", subId);
    setSubmissions(prev => prev.map(s => s.id===subId ? {...s, status} : s));
    showToast("Submission status updated to " + status);
  };

  const toggleJobStatus = async (job) => {
    const s = job.status==="active" ? "paused" : "active";
    await supabase.from("jobs").update({ status:s }).eq("id", job.id);
    setJobs(prev => prev.map(j => j.id===job.id ? {...j, status:s} : j));
    showToast("Job " + s);
  };

  const postJob = async (e) => {
    e.preventDefault(); setPosting(true);
    const { error } = await supabase.from("jobs").insert({ ...jobForm, posted_by:user.id, status:"active" });
    if (error) { showToast("Error: "+error.message); setPosting(false); return; }
    showToast("✅ Job posted!");
    setJobForm({ title:"", company:"", location:"", type:"Full-time", description:"", requirements:"", salary_range:"" });
    const updated = await fetchJobs(user.id);
    const ids = (updated || []).map(j => j.id);
    jobIdsRef.current = ids;
    await fetchAppCounts(ids);
    setPosting(false); setTab("jobs");
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate("/login/recruiter"); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const activeJobs = jobs.filter(j => j.status==="active").length;
  const userName   = profile?.full_name || user?.email?.split("@")[0] || "Recruiter";

  return (
    <>
      <AppNavbar role="recruiter" userName={userName} />

      {toast && (
        <div style={{position:"fixed",bottom:24,right:24,background:"#1a2035",border:"1px solid rgba(255,255,255,0.12)",color:"#f5f5f5",padding:"12px 20px",borderRadius:12,zIndex:9999,fontSize:14,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
          {toast}
        </div>
      )}

      <main className="rdPage">
        <aside className="rdSidebar">
          <nav className="rdNav">
            {[
              {id:"overview",     icon:"📊", label:"Overview"},
              {id:"jobs",         icon:"📋", label:"My Jobs",           badge:jobs.length},
              {id:"post-job",     icon:"➕", label:"Post Job"},
              {id:"submissions",  icon:"🤝", label:"Vendor Candidates", badge:submissions.length},
            ].map(n => (
              <button key={n.id}
                className={`rdNavLink ${tab===n.id||(tab==="applicants"&&n.id==="jobs")?"rdNavActive":""}`}
                onClick={() => setTab(n.id)}>
                <span>{n.icon}</span>{n.label}
                {n.badge>0 && <span className="rdBadge">{n.badge}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <div className="rdContent">

          {/* Overview */}
          {tab==="overview" && (
            <div className="rdPanel">
              <h2 className="rdTitle">Overview</h2>
              <div className="rdStats">
                {[
                  {label:"Active Jobs",        value:activeJobs,                    icon:"📋", color:"#13b8c8"},
                  {label:"Total Applications", value:totalApps,                     icon:"📨", color:"#ff6b4a"},
                  {label:"Vendor Submissions", value:submissions.length,            icon:"🤝", color:"#7ddfbb"},
                  {label:"Total Jobs",         value:jobs.length,                   icon:"💼", color:"#f7b733"},
                ].map(s => (
                  <div className="rdStatCard" key={s.label} style={{"--cc":s.color}}>
                    <span className="rdStatIcon">{s.icon}</span>
                    <span className="rdStatVal">{s.value}</span>
                    <span className="rdStatLabel">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="rdSection">
                <div className="rdSectionHead">
                  <h3 className="rdSectionTitle">Recent Jobs</h3>
                  <button className="rdLinkBtn" onClick={() => setTab("jobs")}>View all →</button>
                </div>
                {jobs.length===0 ? (
                  <div className="rdEmpty">No jobs yet. <button className="rdLinkBtn" onClick={() => setTab("post-job")}>Post first job →</button></div>
                ) : (
                  <div className="rdJobList">
                    {jobs.slice(0,5).map(job => (
                      <div className="rdJobRow" key={job.id} onClick={() => openJob(job)}>
                        <div className="rdJobInfo">
                          <p className="rdJobTitle">{job.title}</p>
                          <p className="rdJobMeta">{job.company} · {job.location} · {job.type}</p>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          {appCounts[job.id] > 0 && (
                            <span className="rdAppCountPill">{appCounts[job.id]} applicant{appCounts[job.id]!==1?"s":""}</span>
                          )}
                          <span className="rdStatusPill" style={{"--sc":job.status==="active"?"#7ddfbb":"#f7b733"}}>{job.status}</span>
                          <span className="rdJobDate">{job.created_at?.slice(0,10)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* My Jobs + Applicants */}
          {(tab==="jobs"||tab==="applicants") && (
            <div className="rdPanel">
              {tab==="applicants" && selectedJob ? (
                <>
                  <div className="rdBackRow">
                    <button className="rdBackBtn" onClick={() => setTab("jobs")}>← Back</button>
                    <h2 className="rdTitle" style={{margin:0}}>{selectedJob.title}</h2>
                  </div>
                  <p className="rdSubTitle">{selectedJob.company} · {selectedJob.location}</p>
                  {applications.length===0 ? (
                    <div className="rdEmpty">No applications yet.</div>
                  ) : (
                    <div className="rdAppTable">
                      {applications.map(app => (
                        <div className="rdAppRow" key={app.id}>
                          <div className="rdAppAvatar">{(app.profiles?.full_name||app.profiles?.email||"?").charAt(0).toUpperCase()}</div>
                          <div className="rdAppInfo">
                            <p className="rdAppName">{app.profiles?.full_name||"—"}</p>
                            <p className="rdAppEmail">{app.profiles?.email||"—"}</p>
                          </div>
                          {app.cover_letter && <p className="rdAppCover">"{app.cover_letter.slice(0,100)}{app.cover_letter.length>100?"…":""}"</p>}
                          <div className="rdAppActions">
                            <select className="rdStatusSelect" value={app.status}
                              style={{"--sc":STATUS_COLORS[app.status]||"#13b8c8"}}
                              onChange={e => updateStatus(app.id, e.target.value)}>
                              {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <span className="rdAppDate">{app.created_at?.slice(0,10)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="rdSectionHead" style={{padding:0}}>
                    <h2 className="rdTitle" style={{margin:0}}>My Jobs</h2>
                    <button className="rdPostBtn" onClick={() => setTab("post-job")}>+ Post New Job</button>
                  </div>
                  {loading ? <div className="rdEmpty">Loading…</div> : jobs.length===0 ? (
                    <div className="rdEmpty">No jobs posted yet.</div>
                  ) : (
                    <div className="rdJobCards">
                      {jobs.map(job => (
                        <div className="rdJobCard" key={job.id}>
                          <div className="rdJobCardTop">
                            <div>
                              <p className="rdJobCardTitle">{job.title}</p>
                              <p className="rdJobCardMeta">{job.company} · {job.location} · {job.type}</p>
                              {job.salary_range && <p className="rdJobCardSalary">{job.salary_range}</p>}
                            </div>
                            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
                              <span className="rdStatusPill" style={{"--sc":job.status==="active"?"#7ddfbb":"#f7b733"}}>{job.status}</span>
                              {appCounts[job.id] > 0 && (
                                <span className="rdAppCountPill">{appCounts[job.id]} applicant{appCounts[job.id]!==1?"s":""}</span>
                              )}
                            </div>
                          </div>
                          {job.description && <p className="rdJobCardDesc">{job.description.slice(0,130)}{job.description.length>130?"…":""}</p>}
                          <div className="rdJobCardActions">
                            <button className="rdViewAppsBtn" onClick={() => openJob(job)}>
                              View Applicants {appCounts[job.id]>0?`(${appCounts[job.id]})`:""}
                            </button>
                            <button className="rdToggleBtn" onClick={() => toggleJobStatus(job)}>
                              {job.status==="active"?"Pause":"Activate"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Post Job */}
          {tab==="post-job" && (
            <div className="rdPanel">
              <h2 className="rdTitle">Post a New Job</h2>
              <form className="rdForm" onSubmit={postJob}>
                <div className="rdFormRow">
                  <div className="rdField">
                    <label>Job Title *</label>
                    <input required placeholder="Senior React Developer" value={jobForm.title}
                      onChange={e => setJobForm(f=>({...f,title:e.target.value}))} />
                  </div>
                  <div className="rdField">
                    <label>Company *</label>
                    <input required placeholder="Acme Corp" value={jobForm.company}
                      onChange={e => setJobForm(f=>({...f,company:e.target.value}))} />
                  </div>
                </div>
                <div className="rdFormRow">
                  <div className="rdField">
                    <label>Location</label>
                    <input placeholder="Hyderabad / Remote" value={jobForm.location}
                      onChange={e => setJobForm(f=>({...f,location:e.target.value}))} />
                  </div>
                  <div className="rdField">
                    <label>Job Type</label>
                    <select value={jobForm.type} onChange={e => setJobForm(f=>({...f,type:e.target.value}))}>
                      {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="rdField">
                  <label>Salary Range</label>
                  <input placeholder="₹8L–₹15L / $80k–$120k" value={jobForm.salary_range}
                    onChange={e => setJobForm(f=>({...f,salary_range:e.target.value}))} />
                </div>
                <div className="rdField">
                  <label>Job Description *</label>
                  <textarea required rows={4} placeholder="Describe the role and responsibilities…"
                    value={jobForm.description} onChange={e => setJobForm(f=>({...f,description:e.target.value}))} />
                </div>
                <div className="rdField">
                  <label>Requirements</label>
                  <textarea rows={3} placeholder="Skills, experience, qualifications…"
                    value={jobForm.requirements} onChange={e => setJobForm(f=>({...f,requirements:e.target.value}))} />
                </div>
                <button type="submit" className="rdSubmitBtn" disabled={posting}>
                  {posting ? "Publishing…" : "Publish Job"}
                </button>
              </form>
            </div>
          )}

          {/* Vendor Submissions */}
          {tab==="submissions" && (
            <div className="rdPanel">
              <h2 className="rdTitle">Vendor Candidates</h2>
              <p className="rdSubTitle" style={{margin:0}}>Candidates submitted by your vendor partners for your jobs</p>
              {submissions.length===0 ? (
                <div className="rdEmpty">No vendor submissions yet.</div>
              ) : (
                <div className="rdAppTable">
                  {submissions.map(sub => (
                    <div className="rdAppRow" key={sub.id}>
                      <div className="rdAppAvatar" style={{background:"rgba(125,223,187,0.12)",borderColor:"rgba(125,223,187,0.3)",color:"#7ddfbb"}}>
                        {sub.candidate_name?.charAt(0).toUpperCase()||"C"}
                      </div>
                      <div className="rdAppInfo">
                        <p className="rdAppName">{sub.candidate_name}</p>
                        <p className="rdAppEmail">{sub.candidate_email}</p>
                        {sub.skills && <p style={{margin:0,fontSize:11,color:"#7ddfbb",fontWeight:600}}>{sub.skills}</p>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{margin:"0 0 2px",fontSize:12,color:"rgba(245,245,245,0.5)"}}>📋 {sub.jobs?.title} at {sub.jobs?.company}</p>
                        {sub.experience && <p style={{margin:0,fontSize:12,color:"rgba(245,245,245,0.4)"}}>{sub.experience}</p>}
                      </div>
                      <div className="rdAppActions">
                        <select className="rdStatusSelect" value={sub.status}
                          style={{"--sc":SUB_STATUS_COLORS[sub.status]||"#13b8c8"}}
                          onChange={e => updateSubStatus(sub.id, e.target.value)}>
                          {Object.keys(SUB_STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <span className="rdAppDate">{sub.created_at?.slice(0,10)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <style>{`
        .rdPage{display:flex;min-height:calc(100vh - 64px);background:#07090f;}
        .rdSidebar{width:220px;flex-shrink:0;background:rgba(10,14,26,0.9);border-right:1px solid rgba(255,255,255,0.07);padding:24px 12px;position:sticky;top:64px;height:calc(100vh - 64px);}
        .rdNav{display:flex;flex-direction:column;gap:4px;}
        .rdNavLink{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;border:none;background:none;color:rgba(245,245,245,0.5);font-size:13px;font-weight:700;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.18s;position:relative;}
        .rdNavLink:hover{color:#f5f5f5;background:rgba(255,255,255,0.05);}
        .rdNavActive{color:#f5f5f5!important;background:rgba(19,184,200,0.1)!important;box-shadow:inset 2px 0 0 #13b8c8;}
        .rdBadge{margin-left:auto;background:#13b8c8;color:#0a0e1a;font-size:10px;font-weight:900;min-width:18px;height:18px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px;}
        .rdContent{flex:1;padding:32px 28px;min-width:0;}
        .rdPanel{display:flex;flex-direction:column;gap:24px;max-width:900px;}
        .rdTitle{margin:0;font-size:22px;font-weight:900;color:#f5f5f5;letter-spacing:-0.02em;}
        .rdSubTitle{margin:-16px 0 0;font-size:13px;color:rgba(245,245,245,0.45);}
        .rdStats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .rdStatCard{padding:18px 16px;border-radius:14px;background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-top:3px solid var(--cc);display:flex;flex-direction:column;gap:6px;}
        .rdStatIcon{font-size:20px;}.rdStatVal{font-size:26px;font-weight:950;color:#f5f5f5;line-height:1;}.rdStatLabel{font-size:11px;color:rgba(245,245,245,0.4);font-weight:600;}
        .rdSection{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;}
        .rdSectionHead{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,0.06);}
        .rdSectionTitle{margin:0;font-size:14px;font-weight:800;color:#f5f5f5;}
        .rdJobList{display:flex;flex-direction:column;}
        .rdJobRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;transition:background 0.15s;}
        .rdJobRow:last-child{border-bottom:none;}.rdJobRow:hover{background:rgba(255,255,255,0.03);}
        .rdJobTitle{margin:0 0 3px;font-size:13.5px;font-weight:750;color:#f5f5f5;}.rdJobMeta{margin:0;font-size:12px;color:rgba(245,245,245,0.4);}.rdJobDate{font-size:11.5px;color:rgba(245,245,245,0.3);flex-shrink:0;}.rdJobInfo{flex:1;}
        .rdStatusPill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;background:color-mix(in srgb,var(--sc) 14%,transparent);color:var(--sc);border:1px solid color-mix(in srgb,var(--sc) 28%,transparent);text-transform:capitalize;}
        .rdAppCountPill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;background:rgba(255,107,74,0.12);color:#ff6b4a;border:1px solid rgba(255,107,74,0.25);}
        .rdEmpty{padding:40px 20px;text-align:center;color:rgba(245,245,245,0.35);font-size:14px;}
        .rdLinkBtn{background:none;border:none;color:#f7b733;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:color 0.15s;padding:0;}
        .rdLinkBtn:hover{color:#ff6b4a;}
        .rdJobCards{display:flex;flex-direction:column;gap:14px;}
        .rdJobCard{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:12px;}
        .rdJobCardTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
        .rdJobCardTitle{margin:0 0 4px;font-size:15px;font-weight:800;color:#f5f5f5;}.rdJobCardMeta{margin:0 0 3px;font-size:12.5px;color:rgba(245,245,245,0.45);}.rdJobCardSalary{margin:0;font-size:12px;color:#7ddfbb;font-weight:700;}.rdJobCardDesc{margin:0;font-size:13px;color:rgba(245,245,245,0.45);line-height:1.6;}
        .rdJobCardActions{display:flex;gap:10px;}
        .rdViewAppsBtn{height:34px;padding:0 16px;border-radius:999px;border:none;background:linear-gradient(135deg,#13b8c8,#7ddfbb);color:#0a0e1a;font-size:12.5px;font-weight:800;cursor:pointer;font-family:inherit;transition:transform 0.15s;}
        .rdViewAppsBtn:hover{transform:translateY(-1px);}
        .rdToggleBtn{height:34px;padding:0 16px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(245,245,245,0.6);font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.15s;}
        .rdToggleBtn:hover{background:rgba(255,255,255,0.08);color:#f5f5f5;}
        .rdPostBtn{height:38px;padding:0 18px;border-radius:999px;border:none;background:linear-gradient(135deg,#13b8c8,#f7b733);color:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;}
        .rdBackRow{display:flex;align-items:center;gap:16px;}.rdBackBtn{background:none;border:none;color:#f7b733;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;}
        .rdAppTable{display:flex;flex-direction:column;gap:12px;}
        .rdAppRow{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
        .rdAppAvatar{width:40px;height:40px;border-radius:50%;background:rgba(19,184,200,0.15);border:1px solid rgba(19,184,200,0.3);color:#13b8c8;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;flex-shrink:0;}
        .rdAppInfo{min-width:140px;}.rdAppName{margin:0 0 2px;font-size:13.5px;font-weight:800;color:#f5f5f5;}.rdAppEmail{margin:0;font-size:12px;color:rgba(245,245,245,0.4);}
        .rdAppCover{margin:0;font-size:12px;color:rgba(245,245,245,0.4);font-style:italic;flex:1;min-width:200px;}.rdAppDate{font-size:11.5px;color:rgba(245,245,245,0.3);flex-shrink:0;}.rdAppActions{flex-shrink:0;}
        .rdStatusSelect{height:32px;padding:0 10px;border-radius:999px;border:1px solid color-mix(in srgb,var(--sc) 30%,transparent);background:color-mix(in srgb,var(--sc) 10%,transparent);color:var(--sc);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;outline:none;}
        .rdForm{display:flex;flex-direction:column;gap:18px;background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:28px;}
        .rdFormRow{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .rdField{display:flex;flex-direction:column;gap:7px;}.rdField label{font-size:12.5px;font-weight:700;color:rgba(245,245,245,0.65);}
        .rdField input,.rdField select,.rdField textarea{padding:0 14px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.04);color:#f5f5f5;font-size:13.5px;outline:none;font-family:inherit;transition:border-color 0.2s,box-shadow 0.2s;}
        .rdField textarea{height:auto;padding:11px 14px;resize:vertical;}
        .rdField input::placeholder,.rdField textarea::placeholder{color:rgba(245,245,245,0.22);}
        .rdField input:focus,.rdField select:focus,.rdField textarea:focus{border-color:rgba(19,184,200,0.5);box-shadow:0 0 0 3px rgba(19,184,200,0.1);}
        .rdSubmitBtn{height:50px;border-radius:999px;border:none;background:linear-gradient(135deg,#13b8c8,#f7b733);color:#fff;font-size:15px;font-weight:900;cursor:pointer;font-family:inherit;transition:transform 0.2s,opacity 0.2s;margin-top:4px;}
        .rdSubmitBtn:hover:not(:disabled){transform:translateY(-2px);}.rdSubmitBtn:disabled{opacity:0.6;cursor:not-allowed;}
        @media(max-width:768px){.rdPage{flex-direction:column;}.rdSidebar{width:100%;height:auto;position:static;padding:12px;}.rdNav{flex-direction:row;flex-wrap:wrap;}.rdContent{padding:20px 16px;}.rdStats{grid-template-columns:1fr 1fr;}.rdFormRow{grid-template-columns:1fr;}}
      `}</style>
    </>
  );
}
