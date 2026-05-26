import React from "react";
import { supabase } from "../lib/supabase";

export default function NotificationBell({ userId }) {
  const [open,  setOpen]  = React.useState(false);
  const [notifs,setNotifs]= React.useState([]);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!userId) return;
    fetchNotifs();
    const handleOut = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleOut);
    const ch = supabase.channel("nb-" + userId)
      .on("postgres_changes", { event:"INSERT", schema:"public", table:"notifications", filter:`user_id=eq.${userId}` },
        (p) => setNotifs(prev => [p.new, ...prev]))
      .subscribe();
    return () => { document.removeEventListener("mousedown", handleOut); supabase.removeChannel(ch); };
  }, [userId]);

  const fetchNotifs = async () => {
    const { data } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at",{ascending:false}).limit(30);
    setNotifs(data || []);
  };

  const markRead = async (id) => {
    await supabase.from("notifications").update({ read:true }).eq("id", id);
    setNotifs(p => p.map(n => n.id===id ? {...n,read:true} : n));
  };

  const markAll = async () => {
    await supabase.from("notifications").update({ read:true }).eq("user_id", userId).eq("read", false);
    setNotifs(p => p.map(n => ({...n,read:true})));
  };

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div ref={ref} style={{position:"relative"}}>
      <button className="nbBell" onClick={()=>setOpen(v=>!v)} title="Notifications">
        🔔
        {unread > 0 && <span className="nbBadge">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="nbDrop">
          <div className="nbHead">
            <span className="nbHeadTitle">Notifications</span>
            {unread > 0 && <button className="nbMarkAll" onClick={markAll}>Mark all read</button>}
          </div>
          <div className="nbList">
            {notifs.length === 0 ? (
              <div className="nbEmpty">No notifications yet.</div>
            ) : notifs.map(n => (
              <div key={n.id} className={`nbItem ${!n.read?"nbUnread":""}`} onClick={()=>markRead(n.id)}>
                <div className="nbDot" style={{background:n.read?"transparent":"#13b8c8"}} />
                <div style={{flex:1,minWidth:0}}>
                  <p className="nbTitle">{n.title}</p>
                  {n.message && <p className="nbMsg">{n.message}</p>}
                  <p className="nbTime">{n.created_at?.slice(0,16).replace("T"," ")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .nbBell{position:relative;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;transition:background 0.15s;}
        .nbBell:hover{background:rgba(255,255,255,0.1);}
        .nbBadge{position:absolute;top:-5px;right:-5px;background:#ff6b4a;color:#fff;font-size:9px;font-weight:900;min-width:16px;height:16px;border-radius:999px;display:flex;align-items:center;justify-content:center;padding:0 4px;border:2px solid #07090f;}
        .nbDrop{position:absolute;top:calc(100% + 10px);right:0;width:320px;background:rgba(12,16,28,0.99);border:1px solid rgba(255,255,255,0.1);border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,0.6);z-index:100;overflow:hidden;animation:fadeDown 0.16s ease;}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .nbHead{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;border-bottom:1px solid rgba(255,255,255,0.07);}
        .nbHeadTitle{font-size:13px;font-weight:800;color:#f5f5f5;}
        .nbMarkAll{background:none;border:none;color:#13b8c8;font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;padding:0;}
        .nbList{max-height:340px;overflow-y:auto;}
        .nbEmpty{padding:28px 16px;text-align:center;font-size:13px;color:rgba(245,245,245,0.3);}
        .nbItem{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;transition:background 0.15s;}
        .nbItem:last-child{border-bottom:none;}
        .nbItem:hover{background:rgba(255,255,255,0.03);}
        .nbUnread{background:rgba(19,184,200,0.04);}
        .nbDot{width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0;transition:background 0.2s;}
        .nbTitle{margin:0 0 2px;font-size:12.5px;font-weight:700;color:#f5f5f5;line-height:1.4;}
        .nbMsg{margin:0 0 3px;font-size:11.5px;color:rgba(245,245,245,0.5);line-height:1.4;}
        .nbTime{margin:0;font-size:10.5px;color:rgba(245,245,245,0.3);}
      `}</style>
    </div>
  );
}
