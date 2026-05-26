import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { notify } from "../lib/notify";
import AppNavbar from "./AppNavbar.jsx";

const STAGES = ["applied","reviewed","shortlisted","interview","hired","rejected"];
const SC = { applied:"#13b8c8",reviewed:"#f7b733",shortlisted:"#7ddfbb",interview:"#ff6b4a",hired:"#22c55e",rejected:"#ef4444" };
const JOB_TYPES = ["Full-time","Part-time","Contract","Remote","Internship"];
const SUB_SC = { submitted:"#13b8c8",reviewing:"#f7b733",shortlisted:"#7ddfbb",rejected:"#ef4444",placed:"#22c55e" };

function Stars({ value = 0, onChange }) {
  return (
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5].map(s => (
        <button key={s} onClick={()=>onChange(s)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:s<=value?"#f7b733":"rgba(255,255,255,0.18)",padding:"0 1px",lineHeight:1}}>★</button>
      ))}
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d=>d.count), 1);
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:6,height:70,padding:"0 4px"}}>
      {data.map(({date,count})=>(
        <div key={date} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{fontSize:10,color:"rgba(19,184,200,0.8)",fontWeight:700,minHeight:14}}>{count>0?count:""}</span>
          <div style={{width:"100%",borderRadius:"4px 4px 0 0",background:count>0?"rgba(19,184,200,0.5)":"rgba(255,255,255,0.05)",height:`${Math.max(4,Math.round((count/max)*48))}px`,transition:"height 0.3s"}} />
          <span style={{fontSize:9.5,color:"rgba(245,245,245,0.3)",whiteSpace:"nowrap"}}>{date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [user,         setUser]        = React.useState(null);
  const [profile,      setProfile]     = React.useState(null);
  const [tab,          setTab]         = React.useState("overview");
  const [jobs,         setJobs]        = React.useState([]);
  const [applications, setApplications]= React.useState([]);
  const [pipeline,     setPipeline]    = React.useState({});
  const [submissions,  setSubmissions] = React.useState([]);
  const [appCounts,    setAppCounts]   = React.useState({});
  const [chartData,    setChartData]   = React.useState([]);
  const [selectedJob,  setSelectedJob] = React.useState(null);
  const [editingJob,   setEditingJob]  = React.useState(null);
  const [editForm,     setEditForm]    = React.useState({});
  const [loading,      setLoading]     = React.useState(true);
  const [toast,        setToast]       = React.useState("");
  const [posting,      setPosting]     = React.useState(false);
  const [expandedApp,  setExpandedApp] = React.useState(null);
  const [appSearch,    setAppSearch]   = React.useState("");
  const [notesDraft,   setNotesDraft]  = React.useState({});
  const [jobForm,      setJobForm]     = React.useState({ title:"",company:"",location:"",type:"Full-time",description:"",requirements:"",salary_range:"" });

  const selectedJobRef = React.useRef(null);
  const jobIdsRef      = React.useRef([]);

  React.useEffect(() => {
    init();
    const ch = supabase.channel("rd-live")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"applications"},()=>{
        fetchAppCounts(jobIdsRef.current); fetchPipeline(jobIdsRef.current);
        if(selectedJobRef.current) fetchApplications(selectedJobRef.current.id);
        fetchChartData(jobIdsRef.current);
        showToast("🔔 New application!");
      })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"applications"},()=>{
        fetchPipeline(jobIdsRef.current);
        if(selectedJobRef.current) fetchApplications(selectedJobRef.current.id);
      })
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"vendor_submissions"},()=>{
        fetchSubmissions(jobIdsRef.current); showToast("🤝 New vendor submission!");
      })
      .subscribe();
    return ()=>supabase.removeChannel(ch);
  },[]);

  const init = async () => {
    const { data:{ user } } = await supabase.auth.getUser();
    if(!user){ navigate("/login/recruiter"); return; }
    setUser(user);
    const { data:p } = await supabase.from("profiles").select("*").eq("id",user.id).single();
    setProfile(p);
    const jobsData = await fetchJobs(user.id);
    const ids = (jobsData||[]).map(j=>j.id);
    jobIdsRef.current = ids;
    await Promise.all([fetchSubmissions(ids),fetchAppCounts(ids),fetchPipeline(ids),fetchChartData(ids)]);
  };

  const fetchJobs = async (uid) => {
    const { data } = await supabase.from("jobs").select("*").eq("posted_by",uid).order("created_at",{ascending:false});
    setJobs(data||[]); setLoading(false); return data||[];
  };

  const fetchApplications = async (jobId) => {
    const { data:apps } = await supabase.from("applications").select("*").eq("job_id",jobId).order("created_at",{ascending:false});
    if(!apps?.length){ setApplications([]); return; }
    const { data:profs } = await supabase.from("profiles").select("id,full_name,email,skills,bio,phone,linkedin,resume_url").in("id",apps.map(a=>a.applicant_id));
    const pm = Object.fromEntries((profs||[]).map(p=>[p.id,p]));
    setApplications(apps.map(a=>({...a,profiles:pm[a.applicant_id]||null})));
  };

  const fetchPipeline = async (ids) => {
    if(!ids.length){ const e={}; STAGES.forEach(s=>e[s]=[]); setPipeline(e); return; }
    const { data:apps } = await supabase.from("applications").select("*,jobs(title,company)").in("job_id",ids).order("created_at",{ascending:false});
    if(!apps?.length){ const e={}; STAGES.forEach(s=>e[s]=[]); setPipeline(e); return; }
    const { data:profs } = await supabase.from("profiles").select("id,full_name,email,skills").in("id",apps.map(a=>a.applicant_id));
    const pm = Object.fromEntries((profs||[]).map(p=>[p.id,p]));
    const enriched = apps.map(a=>({...a,profiles:pm[a.applicant_id]||null}));
    const g={}; STAGES.forEach(s=>g[s]=[]);
    enriched.forEach(a=>{ const st=STAGES.includes(a.status)?a.status:"applied"; g[st].push(a); });
    setPipeline(g);
  };

  const fetchSubmissions = async (ids) => {
    if(!ids.length){ setSubmissions([]); return; }
    const { data } = await supabase.from("vendor_submissions").select("*,jobs(title,company)").in("job_id",ids).order("created_at",{ascending:false});
    setSubmissions(data||[]);
  };

  const fetchAppCounts = async (ids) => {
    if(!ids.length){ setAppCounts({}); return; }
    const { data } = await supabase.from("applications").select("job_id").in("job_id",ids);
    const c={}; (data||[]).forEach(a=>{ c[a.job_id]=(c[a.job_id]||0)+1; });
    setAppCounts(c);
  };

  const fetchChartData = async (ids) => {
    const days=[]; const counts={};
    for(let i=6;i>=0;i--){
      const d=new Date(Date.now()-i*86400000);
      const key=d.toISOString().slice(0,10);
      days.push(key); counts[key]=0;
    }
    if(ids.length){
      const since = days[0]+"T00:00:00Z";
      const { data } = await supabase.from("applications").select("created_at").in("job_id",ids).gte("created_at",since);
      (data||[]).forEach(a=>{ const k=a.created_at.slice(0,10); if(k in counts) counts[k]++; });
    }
    setChartData(days.map(d=>({date:d,count:counts[d]})));
  };

  const openJob = async (job) => {
    setSelectedJob(job); selectedJobRef.current=job; setTab("applicants"); setAppSearch("");
    await fetchApplications(job.id);
  };

  const updateStatus = async (appId, status, applicantId) => {
    await supabase.from("applications").update({status}).eq("id",appId);
    setApplications(prev=>prev.map(a=>a.id===appId?{...a,status}:a));
    fetchPipeline(jobIdsRef.current);
    if(applicantId) await notify(applicantId, "Application Status Updated", `Your application is now: ${status}`);
    showToast("Status → "+status);
  };

  const updateRating = async (appId, rating) => {
    await supabase.from("applications").update({rating}).eq("id",appId);
    setApplications(prev=>prev.map(a=>a.id===appId?{...a,rating}:a));
  };

  const saveNote = async (appId) => {
    const note = notesDraft[appId] ?? (applications.find(a=>a.id===appId)?.notes||"");
    await supabase.from("applications").update({notes:note}).eq("id",appId);
    setApplications(prev=>prev.map(a=>a.id===appId?{...a,notes:note}:a));
    showToast("Note saved");
  };

  const updatePipelineStatus = async (appId, newStatus, applicantId) => {
    await supabase.from("applications").update({status:newStatus}).eq("id",appId);
    await fetchPipeline(jobIdsRef.current);
    if(applicantId) await notify(applicantId,"Application Status Updated",`Your application is now: ${newStatus}`);
    showToast("Moved to "+newStatus);
  };

  const updateSubStatus = async (subId, status) => {
    await supabase.from("vendor_submissions").update({status}).eq("id",subId);
    setSubmissions(prev=>prev.map(s=>s.id===subId?{...s,status}:s));
    showToast("Submission → "+status);
  };

  const toggleJobStatus = async (job) => {
    const s=job.status==="active"?"paused":"active";
    await supabase.from("jobs").update({status:s}).eq("id",job.id);
    setJobs(prev=>prev.map(j=>j.id===job.id?{...j,status:s}:j));
    showToast("Job "+s);
  };

  const deleteJob = async (jobId) => {
    if(!window.confirm("Delete this job? All applications will also be deleted.")) return;
    await supabase.from("jobs").delete().eq("id",jobId);
    const updated = jobs.filter(j=>j.id!==jobId);
    setJobs(updated);
    const ids = updated.map(j=>j.id);
    jobIdsRef.current=ids;
    await Promise.all([fetchAppCounts(ids),fetchPipeline(ids),fetchSubmissions(ids),fetchChartData(ids)]);
    showToast("Job deleted.");
  };

  const saveEditJob = async (e) => {
    e.preventDefault();
    await supabase.from("jobs").update(editForm).eq("id",editingJob);
    setJobs(prev=>prev.map(j=>j.id===editingJob?{...j,...editForm}:j));
    setEditingJob(null); showToast("✅ Job updated!");
  };

  const postJob = async (e) => {
    e.preventDefault(); setPosting(true);
    const { error } = await supabase.from("jobs").insert({...jobForm,posted_by:user.id,status:"active"});
    if(error){ showToast("Error: "+error.message); setPosting(false); return; }
    showToast("✅ Job published!");
    setJobForm({title:"",company:"",location:"",type:"Full-time",description:"",requirements:"",salary_range:""});
    const updated = await fetchJobs(user.id);
    const ids=(updated||[]).map(j=>j.id); jobIdsRef.current=ids;
    await Promise.all([fetchAppCounts(ids),fetchChartData(ids)]);
    setPosting(false); setTab("jobs");
  };

  const copyShareLink = (job) => {
    const url = `${window.location.origin}/login`;
    navigator.clipboard.writeText(url);
    showToast(`🔗 Link copied! Share with applicants to apply for "${job.title}"`);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),3500); };

  const totalApps  = Object.values(appCounts).reduce((a,b)=>a+b,0);
  const hired      = (pipeline.hired||[]).length;
  const shortlisted= (pipeline.shortlisted||[]).length;
  const userName   = profile?.full_name || user?.email?.split("@")[0] || "Recruiter";
  const activeJobs = jobs.filter(j=>j.status==="active").length;

  const filteredApps = applications.filter(a => {
    if(!appSearch) return true;
    const q = appSearch.toLowerCase();
    return (a.profiles?.full_name||"").toLowerCase().includes(q) ||
           (a.profiles?.email||"").toLowerCase().includes(q) ||
           (a.profiles?.skills||"").toLowerCase().includes(q);
  });

  return (
    <>
      <AppNavbar role="recruiter" userName={userName} userId={user?.id} onTabChange={setTab} />

      {toast && <div className="rdToast">{toast}</div>}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="rdOverlay" onClick={()=>setEditingJob(null)}>
          <div className="rdModal" onClick={e=>e.stopPropagation()}>
            <h3 className="rdModalTitle">Edit Job</h3>
            <form onSubmit={saveEditJob} style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="rdFormRow">
                <div className="rdField"><label>Title *</label><input required value={editForm.title||""} onChange={e=>setEditForm(f=>({...f,title:e.target.value}))} /></div>
                <div className="rdField"><label>Company *</label><input required value={editForm.company||""} onChange={e=>setEditForm(f=>({...f,company:e.target.value}))} /></div>
              </div>
              <div className="rdFormRow">
                <div className="rdField"><label>Location</label><input value={editForm.location||""} onChange={e=>setEditForm(f=>({...f,location:e.target.value}))} /></div>
                <div className="rdField"><label>Type</label>
                  <select value={editForm.type||"Full-time"} onChange={e=>setEditForm(f=>({...f,type:e.target.value}))}>
                    {JOB_TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="rdField"><label>Salary Range</label><input value={editForm.salary_range||""} onChange={e=>setEditForm(f=>({...f,salary_range:e.target.value}))} /></div>
              <div className="rdField"><label>Description *</label><textarea required rows={3} value={editForm.description||""} onChange={e=>setEditForm(f=>({...f,description:e.target.value}))} /></div>
              <div className="rdField"><label>Requirements</label><textarea rows={2} value={editForm.requirements||""} onChange={e=>setEditForm(f=>({...f,requirements:e.target.value}))} /></div>
              <div style={{display:"flex",gap:10}}>
                <button type="submit" className="rdSubmitBtn" style={{flex:1}}>Save Changes</button>
                <button type="button" className="rdCancelBtn" onClick={()=>setEditingJob(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="rdPage">
        <aside className="rdSidebar">
          <nav className="rdNav">
            {[
              {id:"overview",    icon:"📊", label:"Overview"},
              {id:"jobs",        icon:"📋", label:"My Jobs",          badge:jobs.length},
              {id:"pipeline",    icon:"🔄", label:"Pipeline",          badge:totalApps},
              {id:"post-job",    icon:"➕", label:"Post Job"},
              {id:"submissions", icon:"🤝", label:"Vendor Candidates",  badge:submissions.length},
            ].map(n=>(
              <button key={n.id} className={`rdNavLink ${tab===n.id||(tab==="applicants"&&n.id==="jobs")?"rdNavActive":""}`} onClick={()=>setTab(n.id)}>
                <span>{n.icon}</span>{n.label}
                {n.badge>0&&<span className="rdBadge">{n.badge}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <div className="rdContent">

          {/* ── Overview ── */}
          {tab==="overview" && (
            <div className="rdPanel">
              <h2 className="rdTitle">Overview</h2>
              <div className="rdStats">
                {[
                  {label:"Active Jobs",    value:activeJobs,   icon:"📋", color:"#13b8c8"},
                  {label:"Applications",   value:totalApps,    icon:"📨", color:"#ff6b4a"},
                  {label:"Shortlisted",    value:shortlisted,  icon:"⭐", color:"#7ddfbb"},
                  {label:"Hired",          value:hired,        icon:"✅", color:"#22c55e"},
                ].map(s=>(
                  <div className="rdStatCard" key={s.label} style={{"--cc":s.color}}>
                    <span className="rdStatIcon">{s.icon}</span>
                    <span className="rdStatVal">{s.value}</span>
                    <span className="rdStatLabel">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* 7-day chart */}
              {chartData.length>0 && (
                <div className="rdSection">
                  <div className="rdSectionHead">
                    <h3 className="rdSectionTitle">Applications — Last 7 Days</h3>
                    <span style={{fontSize:11,color:"rgba(245,245,245,0.3)"}}>{chartData.reduce((a,b)=>a+b.count,0)} total</span>
                  </div>
                  <div style={{padding:"16px 20px 12px"}}>
                    <BarChart data={chartData} />
                  </div>
                </div>
              )}

              {/* Pipeline summary */}
              <div className="rdSection">
                <div className="rdSectionHead">
                  <h3 className="rdSectionTitle">Pipeline Summary</h3>
                  <button className="rdLinkBtn" onClick={()=>setTab("pipeline")}>Full view →</button>
                </div>
                <div style={{display:"flex",overflow:"hidden"}}>
                  {STAGES.filter(s=>s!=="rejected").map(s=>(
                    <div key={s} style={{flex:1,padding:"14px 10px",textAlign:"center",borderRight:"1px solid rgba(255,255,255,0.05)"}}>
                      <div style={{fontSize:20,fontWeight:900,color:SC[s]}}>{(pipeline[s]||[]).length}</div>
                      <div style={{fontSize:10,color:"rgba(245,245,245,0.4)",fontWeight:600,textTransform:"capitalize",marginTop:3}}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent jobs */}
              <div className="rdSection">
                <div className="rdSectionHead">
                  <h3 className="rdSectionTitle">Active Jobs</h3>
                  <button className="rdLinkBtn" onClick={()=>setTab("jobs")}>View all →</button>
                </div>
                {jobs.length===0?<div className="rdEmpty">No jobs yet.</div>:(
                  <div className="rdJobList">
                    {jobs.filter(j=>j.status==="active").slice(0,5).map(job=>(
                      <div className="rdJobRow" key={job.id} onClick={()=>openJob(job)}>
                        <div className="rdJobInfo">
                          <p className="rdJobTitle">{job.title}</p>
                          <p className="rdJobMeta">{job.company} · {job.location} · {job.type}</p>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          {appCounts[job.id]>0&&<span className="rdAppCountPill">{appCounts[job.id]} applicant{appCounts[job.id]!==1?"s":""}</span>}
                          <span className="rdJobDate">{job.created_at?.slice(0,10)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── My Jobs + Applicants ── */}
          {(tab==="jobs"||tab==="applicants") && (
            <div className="rdPanel">
              {tab==="applicants"&&selectedJob ? (
                <>
                  <div className="rdBackRow">
                    <button className="rdBackBtn" onClick={()=>setTab("jobs")}>← Back</button>
                    <h2 className="rdTitle" style={{margin:0}}>{selectedJob.title}</h2>
                    <span className="rdStatusPill" style={{"--sc":selectedJob.status==="active"?"#7ddfbb":"#f7b733"}}>{selectedJob.status}</span>
                  </div>
                  <p className="rdSubTitle">{selectedJob.company} · {selectedJob.location}</p>

                  {/* Applicant search */}
                  <div className="rdSearchBox">
                    <span style={{fontSize:14,opacity:0.5}}>🔍</span>
                    <input placeholder="Search by name, email, skills…" value={appSearch} onChange={e=>setAppSearch(e.target.value)} />
                    {appSearch&&<button onClick={()=>setAppSearch("")} style={{background:"none",border:"none",color:"rgba(245,245,245,0.4)",cursor:"pointer",fontSize:13}}>✕</button>}
                  </div>

                  {filteredApps.length===0?<div className="rdEmpty">{appSearch?"No applicants match your search.":"No applications yet."}</div>:(
                    <div className="rdAppTable">
                      {filteredApps.map(app=>(
                        <div key={app.id}>
                          <div className="rdAppRow" onClick={()=>setExpandedApp(expandedApp===app.id?null:app.id)}>
                            <div className="rdAppAvatar">{(app.profiles?.full_name||app.profiles?.email||"?").charAt(0).toUpperCase()}</div>
                            <div className="rdAppInfo">
                              <p className="rdAppName">{app.profiles?.full_name||"—"}</p>
                              <p className="rdAppEmail">{app.profiles?.email||"—"}</p>
                              {app.profiles?.skills&&<p style={{margin:0,fontSize:11,color:"#7ddfbb",fontWeight:600}}>{app.profiles.skills}</p>}
                            </div>
                            <Stars value={app.rating||0} onChange={v=>{updateRating(app.id,v);}} />
                            <select className="rdStatusSelect" value={app.status} style={{"--sc":SC[app.status]||"#13b8c8"}}
                              onClick={e=>e.stopPropagation()} onChange={e=>updateStatus(app.id,e.target.value,app.applicant_id)}>
                              {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
                            </select>
                            <span className="rdAppDate">{app.created_at?.slice(0,10)}</span>
                            <span style={{fontSize:11,color:"rgba(245,245,245,0.3)"}}>{expandedApp===app.id?"▲":"▼"}</span>
                          </div>
                          {expandedApp===app.id&&(
                            <div className="rdAppExpanded">
                              <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                                <div style={{flex:1,minWidth:200}}>
                                  <p style={{margin:"0 0 6px",fontSize:11,fontWeight:700,color:"rgba(245,245,245,0.4)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Cover Letter</p>
                                  {app.cover_letter?<p className="rdCoverText">"{app.cover_letter}"</p>:<p style={{color:"rgba(245,245,245,0.25)",fontSize:13}}>No cover letter.</p>}
                                  {app.profiles?.bio&&<p style={{margin:"12px 0 0",fontSize:13,color:"rgba(245,245,245,0.5)"}}>{app.profiles.bio}</p>}
                                  <div style={{display:"flex",gap:12,marginTop:10,flexWrap:"wrap"}}>
                                    {app.profiles?.phone&&<span style={{fontSize:12,color:"rgba(245,245,245,0.5)"}}>📞 {app.profiles.phone}</span>}
                                    {app.profiles?.linkedin&&<a href={app.profiles.linkedin} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#13b8c8"}}>LinkedIn ↗</a>}
                                    {app.profiles?.resume_url&&<a href={app.profiles.resume_url} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#7ddfbb",fontWeight:700}}>📄 View Resume</a>}
                                  </div>
                                </div>
                                <div style={{flex:1,minWidth:200}}>
                                  <p style={{margin:"0 0 6px",fontSize:11,fontWeight:700,color:"rgba(245,245,245,0.4)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Recruiter Notes</p>
                                  <textarea className="rdNotesArea" rows={3}
                                    placeholder="Add private notes about this candidate…"
                                    value={notesDraft[app.id]??app.notes??""}
                                    onChange={e=>setNotesDraft(d=>({...d,[app.id]:e.target.value}))}
                                    onBlur={()=>saveNote(app.id)} />
                                  <button className="rdSaveNoteBtn" onClick={()=>saveNote(app.id)}>Save Note</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="rdSectionHead" style={{padding:0,marginBottom:4}}>
                    <h2 className="rdTitle" style={{margin:0}}>My Jobs</h2>
                    <button className="rdPostBtn" onClick={()=>setTab("post-job")}>+ Post New Job</button>
                  </div>
                  {loading?<div className="rdEmpty">Loading…</div>:jobs.length===0?<div className="rdEmpty">No jobs posted yet.</div>:(
                    <div className="rdJobCards">
                      {jobs.map(job=>(
                        <div className="rdJobCard" key={job.id}>
                          <div className="rdJobCardTop">
                            <div style={{flex:1}}>
                              <p className="rdJobCardTitle">{job.title}</p>
                              <p className="rdJobCardMeta">{job.company} · {job.location} · {job.type}</p>
                              {job.salary_range&&<p className="rdJobCardSalary">{job.salary_range}</p>}
                            </div>
                            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                              <span className="rdStatusPill" style={{"--sc":job.status==="active"?"#7ddfbb":"#f7b733"}}>{job.status}</span>
                              {appCounts[job.id]>0&&<span className="rdAppCountPill">{appCounts[job.id]} applicant{appCounts[job.id]!==1?"s":""}</span>}
                            </div>
                          </div>
                          {job.description&&<p className="rdJobCardDesc">{job.description.slice(0,120)}{job.description.length>120?"…":""}</p>}
                          <div className="rdJobCardActions">
                            <button className="rdViewAppsBtn" onClick={()=>openJob(job)}>View Applicants{appCounts[job.id]>0?` (${appCounts[job.id]})`:""}</button>
                            <button className="rdShareBtn" onClick={()=>copyShareLink(job)}>🔗 Share</button>
                            <button className="rdEditBtn" onClick={()=>{setEditingJob(job.id);setEditForm({title:job.title,company:job.company,location:job.location,type:job.type,description:job.description,requirements:job.requirements,salary_range:job.salary_range});}}>Edit</button>
                            <button className="rdToggleBtn" onClick={()=>toggleJobStatus(job)}>{job.status==="active"?"Pause":"Activate"}</button>
                            <button className="rdDeleteBtn" onClick={()=>deleteJob(job.id)}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── Pipeline ── */}
          {tab==="pipeline" && (
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <h2 className="rdTitle">Candidate Pipeline</h2>
                <span style={{fontSize:13,color:"rgba(245,245,245,0.4)"}}>{totalApps} total across all jobs</span>
              </div>
              {totalApps===0?<div className="rdEmpty">No applications yet. Post a job and share it with candidates.</div>:(
                <div className="rdKanban">
                  {STAGES.map(stage=>(
                    <div className="rdKanbanCol" key={stage}>
                      <div className="rdKanbanHead" style={{"--sc":SC[stage]}}>
                        <span className="rdKanbanLabel">{stage.charAt(0).toUpperCase()+stage.slice(1)}</span>
                        <span className="rdKanbanCount">{(pipeline[stage]||[]).length}</span>
                      </div>
                      <div className="rdKanbanCards">
                        {(pipeline[stage]||[]).length===0?(
                          <div style={{padding:"14px 10px",textAlign:"center",fontSize:12,color:"rgba(245,245,245,0.18)"}}>Empty</div>
                        ):(pipeline[stage]||[]).map(app=>(
                          <div className="rdKanbanCard" key={app.id}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                              <div className="rdKanbanAvatar">{(app.profiles?.full_name||"?").charAt(0).toUpperCase()}</div>
                              <div style={{flex:1,minWidth:0}}>
                                <p style={{margin:0,fontSize:12,fontWeight:800,color:"#f5f5f5",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{app.profiles?.full_name||"Unknown"}</p>
                                <p style={{margin:0,fontSize:10.5,color:"rgba(245,245,245,0.4)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{app.profiles?.email||"—"}</p>
                              </div>
                            </div>
                            {app.rating>0&&<div style={{display:"flex",gap:1,marginBottom:4}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:11,color:s<=app.rating?"#f7b733":"rgba(255,255,255,0.15)"}}>★</span>)}</div>}
                            <p style={{margin:"0 0 6px",fontSize:10.5,color:"rgba(245,245,245,0.45)",lineHeight:1.3}}>📋 {app.jobs?.title}</p>
                            <p style={{margin:"0 0 6px",fontSize:10,color:"rgba(245,245,245,0.28)"}}>{app.created_at?.slice(0,10)}</p>
                            <select className="rdMiniSelect" value={app.status} style={{"--sc":SC[app.status]}}
                              onChange={e=>updatePipelineStatus(app.id,e.target.value,app.applicant_id)}>
                              {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Post Job ── */}
          {tab==="post-job" && (
            <div className="rdPanel">
              <h2 className="rdTitle">Post a New Job</h2>
              <form className="rdForm" onSubmit={postJob}>
                <div className="rdFormRow">
                  <div className="rdField"><label>Job Title *</label><input required placeholder="Senior React Developer" value={jobForm.title} onChange={e=>setJobForm(f=>({...f,title:e.target.value}))} /></div>
                  <div className="rdField"><label>Company *</label><input required placeholder="COSMOS Technologies" value={jobForm.company} onChange={e=>setJobForm(f=>({...f,company:e.target.value}))} /></div>
                </div>
                <div className="rdFormRow">
                  <div className="rdField"><label>Location</label><input placeholder="Hyderabad / Remote" value={jobForm.location} onChange={e=>setJobForm(f=>({...f,location:e.target.value}))} /></div>
                  <div className="rdField"><label>Job Type</label>
                    <select value={jobForm.type} onChange={e=>setJobForm(f=>({...f,type:e.target.value}))}>
                      {JOB_TYPES.map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="rdField"><label>Salary Range</label><input placeholder="₹12L–₹18L / $90k–$130k" value={jobForm.salary_range} onChange={e=>setJobForm(f=>({...f,salary_range:e.target.value}))} /></div>
                <div className="rdField"><label>Job Description *</label><textarea required rows={4} placeholder="Describe the role and responsibilities…" value={jobForm.description} onChange={e=>setJobForm(f=>({...f,description:e.target.value}))} /></div>
                <div className="rdField"><label>Requirements</label><textarea rows={3} placeholder="Skills, experience, qualifications…" value={jobForm.requirements} onChange={e=>setJobForm(f=>({...f,requirements:e.target.value}))} /></div>
                <button type="submit" className="rdSubmitBtn" disabled={posting}>{posting?"Publishing…":"Publish Job"}</button>
              </form>
            </div>
          )}

          {/* ── Vendor Candidates ── */}
          {tab==="submissions" && (
            <div className="rdPanel">
              <h2 className="rdTitle">Vendor Candidates</h2>
              <p style={{margin:"-12px 0 0",fontSize:13,color:"rgba(245,245,245,0.4)"}}>Candidates submitted by your vendor partners</p>
              {submissions.length===0?<div className="rdEmpty">No vendor submissions yet.</div>:(
                <div className="rdAppTable">
                  {submissions.map(sub=>(
                    <div className="rdAppRow" key={sub.id}>
                      <div className="rdAppAvatar" style={{background:"rgba(125,223,187,0.12)",borderColor:"rgba(125,223,187,0.3)",color:"#7ddfbb"}}>{sub.candidate_name?.charAt(0).toUpperCase()||"C"}</div>
                      <div className="rdAppInfo">
                        <p className="rdAppName">{sub.candidate_name}</p>
                        <p className="rdAppEmail">{sub.candidate_email}</p>
                        {sub.skills&&<p style={{margin:0,fontSize:11,color:"#7ddfbb",fontWeight:600}}>{sub.skills}</p>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{margin:"0 0 2px",fontSize:12,color:"rgba(245,245,245,0.5)"}}>📋 {sub.jobs?.title} · {sub.jobs?.company}</p>
                        {sub.experience&&<p style={{margin:0,fontSize:12,color:"rgba(245,245,245,0.4)"}}>{sub.experience}</p>}
                      </div>
                      <select className="rdStatusSelect" value={sub.status} style={{"--sc":SUB_SC[sub.status]||"#13b8c8"}} onChange={e=>updateSubStatus(sub.id,e.target.value)}>
                        {Object.keys(SUB_SC).map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
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
        .rdToast{position:fixed;bottom:24px;right:24px;background:#1a2035;border:1px solid rgba(255,255,255,0.12);color:#f5f5f5;padding:12px 20px;border-radius:12px;z-index:9999;font-size:14px;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:slideUp 0.3s ease;max-width:360px;}
        @keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        .rdPage{display:flex;min-height:calc(100vh - 64px);background:#07090f;}
        .rdSidebar{width:220px;flex-shrink:0;background:rgba(10,14,26,0.9);border-right:1px solid rgba(255,255,255,0.07);padding:24px 12px;position:sticky;top:64px;height:calc(100vh - 64px);overflow-y:auto;}
        .rdNav{display:flex;flex-direction:column;gap:4px;}
        .rdNavLink{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:10px;border:none;background:none;color:rgba(245,245,245,0.5);font-size:13px;font-weight:700;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.18s;}
        .rdNavLink:hover{color:#f5f5f5;background:rgba(255,255,255,0.05);}
        .rdNavActive{color:#f5f5f5!important;background:rgba(19,184,200,0.1)!important;box-shadow:inset 2px 0 0 #13b8c8;}
        .rdBadge{margin-left:auto;background:#13b8c8;color:#0a0e1a;font-size:10px;font-weight:900;min-width:18px;height:18px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px;}
        .rdContent{flex:1;padding:32px 28px;min-width:0;overflow-x:hidden;}
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
        .rdJobTitle{margin:0 0 3px;font-size:13.5px;font-weight:750;color:#f5f5f5;}.rdJobMeta{margin:0;font-size:12px;color:rgba(245,245,245,0.4);}.rdJobDate{font-size:11.5px;color:rgba(245,245,245,0.3);}.rdJobInfo{flex:1;}
        .rdStatusPill{display:inline-flex;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;background:color-mix(in srgb,var(--sc) 14%,transparent);color:var(--sc);border:1px solid color-mix(in srgb,var(--sc) 28%,transparent);text-transform:capitalize;}
        .rdAppCountPill{display:inline-flex;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;background:rgba(255,107,74,0.12);color:#ff6b4a;border:1px solid rgba(255,107,74,0.25);}
        .rdEmpty{padding:40px 20px;text-align:center;color:rgba(245,245,245,0.35);font-size:14px;}
        .rdLinkBtn{background:none;border:none;color:#f7b733;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;}
        .rdSearchBox{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0 14px;height:42px;}
        .rdSearchBox input{flex:1;background:none;border:none;outline:none;color:#f5f5f5;font-size:13.5px;font-family:inherit;}
        .rdSearchBox input::placeholder{color:rgba(245,245,245,0.25);}
        .rdJobCards{display:flex;flex-direction:column;gap:14px;}
        .rdJobCard{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:12px;}
        .rdJobCardTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
        .rdJobCardTitle{margin:0 0 4px;font-size:15px;font-weight:800;color:#f5f5f5;}.rdJobCardMeta{margin:0 0 3px;font-size:12.5px;color:rgba(245,245,245,0.45);}.rdJobCardSalary{margin:0;font-size:12px;color:#7ddfbb;font-weight:700;}.rdJobCardDesc{margin:0;font-size:13px;color:rgba(245,245,245,0.45);line-height:1.6;}
        .rdJobCardActions{display:flex;gap:8px;flex-wrap:wrap;}
        .rdViewAppsBtn{height:34px;padding:0 16px;border-radius:999px;border:none;background:linear-gradient(135deg,#13b8c8,#7ddfbb);color:#0a0e1a;font-size:12.5px;font-weight:800;cursor:pointer;font-family:inherit;transition:transform 0.15s;}
        .rdViewAppsBtn:hover{transform:translateY(-1px);}
        .rdShareBtn{height:34px;padding:0 14px;border-radius:999px;border:1px solid rgba(247,183,51,0.25);background:rgba(247,183,51,0.07);color:#f7b733;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;}
        .rdEditBtn{height:34px;padding:0 14px;border-radius:999px;border:1px solid rgba(19,184,200,0.25);background:rgba(19,184,200,0.07);color:#13b8c8;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;}
        .rdToggleBtn{height:34px;padding:0 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(245,245,245,0.6);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;}
        .rdDeleteBtn{height:34px;padding:0 14px;border-radius:999px;border:1px solid rgba(239,68,68,0.25);background:rgba(239,68,68,0.06);color:#f87171;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;}
        .rdPostBtn{height:38px;padding:0 18px;border-radius:999px;border:none;background:linear-gradient(135deg,#13b8c8,#f7b733);color:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;}
        .rdBackRow{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}.rdBackBtn{background:none;border:none;color:#f7b733;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;}
        .rdAppTable{display:flex;flex-direction:column;gap:8px;}
        .rdAppRow{background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;cursor:pointer;transition:border-color 0.15s;}
        .rdAppRow:hover{border-color:rgba(255,255,255,0.15);}
        .rdAppExpanded{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-top:none;border-radius:0 0 12px 12px;padding:18px 20px;}
        .rdCoverText{margin:0;font-size:13px;color:rgba(245,245,245,0.55);font-style:italic;line-height:1.6;border-left:2px solid rgba(255,255,255,0.1);padding-left:12px;}
        .rdNotesArea{width:100%;height:80px;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.04);color:#f5f5f5;font-size:13px;outline:none;font-family:inherit;resize:vertical;box-sizing:border-box;}
        .rdNotesArea::placeholder{color:rgba(245,245,245,0.22);}
        .rdNotesArea:focus{border-color:rgba(19,184,200,0.4);}
        .rdSaveNoteBtn{margin-top:6px;height:28px;padding:0 14px;border-radius:999px;border:1px solid rgba(19,184,200,0.25);background:rgba(19,184,200,0.08);color:#13b8c8;font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;}
        .rdAppAvatar{width:40px;height:40px;border-radius:50%;background:rgba(19,184,200,0.15);border:1px solid rgba(19,184,200,0.3);color:#13b8c8;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;flex-shrink:0;}
        .rdAppInfo{min-width:130px;flex:1;}.rdAppName{margin:0 0 2px;font-size:13.5px;font-weight:800;color:#f5f5f5;}.rdAppEmail{margin:0;font-size:12px;color:rgba(245,245,245,0.4);}
        .rdAppDate{font-size:11.5px;color:rgba(245,245,245,0.3);flex-shrink:0;}.rdAppActions{flex-shrink:0;}
        .rdStatusSelect{height:32px;padding:0 10px;border-radius:999px;border:1px solid color-mix(in srgb,var(--sc) 30%,transparent);background:color-mix(in srgb,var(--sc) 10%,transparent);color:var(--sc);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;outline:none;}
        .rdKanban{display:flex;gap:12px;overflow-x:auto;padding-bottom:16px;min-height:400px;}
        .rdKanbanCol{flex:0 0 190px;display:flex;flex-direction:column;}
        .rdKanbanHead{padding:10px 12px;border-radius:10px 10px 0 0;background:color-mix(in srgb,var(--sc) 14%,rgba(15,19,32,1));border:1px solid color-mix(in srgb,var(--sc) 25%,transparent);border-bottom:none;display:flex;align-items:center;justify-content:space-between;}
        .rdKanbanLabel{font-size:11.5px;font-weight:800;color:var(--sc);text-transform:capitalize;}
        .rdKanbanCount{font-size:11px;font-weight:900;background:color-mix(in srgb,var(--sc) 20%,transparent);color:var(--sc);padding:2px 7px;border-radius:999px;}
        .rdKanbanCards{flex:1;background:rgba(15,19,32,0.6);border:1px solid rgba(255,255,255,0.07);border-radius:0 0 10px 10px;padding:8px;display:flex;flex-direction:column;gap:7px;overflow-y:auto;max-height:480px;}
        .rdKanbanCard{background:rgba(10,14,26,0.95);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px;}
        .rdKanbanAvatar{width:26px;height:26px;border-radius:50%;background:rgba(19,184,200,0.15);color:#13b8c8;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0;}
        .rdMiniSelect{width:100%;height:26px;border-radius:999px;border:1px solid color-mix(in srgb,var(--sc) 30%,transparent);background:color-mix(in srgb,var(--sc) 10%,transparent);color:var(--sc);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;outline:none;padding:0 8px;}
        .rdForm{display:flex;flex-direction:column;gap:18px;background:rgba(15,19,32,0.9);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:28px;}
        .rdFormRow{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .rdField{display:flex;flex-direction:column;gap:7px;}.rdField label{font-size:12.5px;font-weight:700;color:rgba(245,245,245,0.65);}
        .rdField input,.rdField select,.rdField textarea{padding:0 14px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.04);color:#f5f5f5;font-size:13.5px;outline:none;font-family:inherit;transition:border-color 0.2s;}
        .rdField textarea{height:auto;padding:11px 14px;resize:vertical;}
        .rdField input::placeholder,.rdField textarea::placeholder{color:rgba(245,245,245,0.22);}
        .rdField input:focus,.rdField select:focus,.rdField textarea:focus{border-color:rgba(19,184,200,0.5);box-shadow:0 0 0 3px rgba(19,184,200,0.08);}
        .rdSubmitBtn{height:50px;border-radius:999px;border:none;background:linear-gradient(135deg,#13b8c8,#f7b733);color:#fff;font-size:15px;font-weight:900;cursor:pointer;font-family:inherit;transition:transform 0.2s,opacity 0.2s;}
        .rdSubmitBtn:hover:not(:disabled){transform:translateY(-2px);}.rdSubmitBtn:disabled{opacity:0.6;cursor:not-allowed;}
        .rdCancelBtn{height:50px;padding:0 20px;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(245,245,245,0.6);font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;}
        .rdOverlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;}
        .rdModal{background:rgba(12,16,28,0.99);border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:28px;max-width:580px;width:100%;box-shadow:0 30px 80px rgba(0,0,0,0.6);max-height:90vh;overflow-y:auto;}
        .rdModalTitle{margin:0 0 20px;font-size:18px;font-weight:900;color:#f5f5f5;}
        @media(max-width:768px){.rdPage{flex-direction:column;}.rdSidebar{width:100%;height:auto;position:static;padding:12px;}.rdNav{flex-direction:row;flex-wrap:wrap;}.rdContent{padding:20px 16px;}.rdStats{grid-template-columns:1fr 1fr;}.rdFormRow{grid-template-columns:1fr;}.rdKanbanCol{flex:0 0 160px;}}
      `}</style>
    </>
  );
}
