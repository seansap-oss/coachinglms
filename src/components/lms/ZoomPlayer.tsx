'use client';
import { useEffect, useRef, useState } from 'react';
import { Video, Users, MessageCircle, Mic, MicOff, VideoOff, PhoneOff, Maximize2, Settings, Share2 } from 'lucide-react';

interface ZoomPlayerProps {
  meetingId: string;
  title: string;
  instructor?: string;
  startAt?: number;
}

export default function ZoomPlayer({ meetingId, title, instructor, startAt }: ZoomPlayerProps) {
  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [useZoomSDK, setUseZoomSDK] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Try to detect if Zoom SDK env is configured
  useEffect(()=>{
    // if env has keys, we could init ZoomMtgEmbedded; for now we show mock player
    // To enable real Zoom: set NEXT_PUBLIC_ZOOM_SDK_KEY + call /lms/api/zoom/signature
    const hasKey = !!process.env.NEXT_PUBLIC_ZOOM_SDK_KEY;
    setUseZoomSDK(hasKey);
  },[]);

  const handleJoin = async ()=>{
    setLoading(true);
    // attempt to fetch signature (if backend configured)
    try{
      const res = await fetch('/lms/api/zoom/signature', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ meetingNumber: meetingId, role:0 }) });
      if(res.ok){
        const data = await res.json();
        // would init ZoomMtgEmbedded here
        console.log('Zoom signature', data);
        setUseZoomSDK(true);
      }
    }catch{}
    setTimeout(()=>{ setJoined(true); setLoading(false); }, 900);
  };

  if(!joined){
    return (
      <div className="relative bg-[#0b1220] rounded-[20px] overflow-hidden border border-white/10">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80" alt="classroom" className="w-full h-full object-cover opacity-40"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/60 to-transparent"/>
        </div>
        <div className="relative p-6 sm:p-10 lg:p-12 flex flex-col min-h-[420px] sm:min-h-[480px]">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full self-start">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/> ZOOM WEBINAR • MEETING ID: {meetingId}
          </div>
          <div className="mt-auto max-w-2xl">
            <h3 className="text-white text-[24px] sm:text-[32px] font-black leading-tight tracking-tighter">{title}</h3>
            {instructor && <p className="text-white/70 text-sm mt-2">with {instructor} • {startAt ? new Date(startAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short'}) : 'Live'}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={handleJoin} disabled={loading} className="bg-white text-black px-6 sm:px-8 h-11 rounded-full font-black text-sm hover:bg-neutral-100 transition flex items-center gap-2 disabled:opacity-60">
                {loading ? 'Connecting…' : <><Video className="w-4 h-4"/> Join via Zoom</>}
              </button>
              <button className="bg-white/10 backdrop-blur text-white border border-white/20 px-6 h-11 rounded-full font-bold text-sm hover:bg-white/20 transition">Watch recording</button>
            </div>
            <p className="text-white/50 text-xs mt-4">Powered by Zoom Meeting SDK (Component View). Works on desktop & mobile browsers. No app install needed if you join from here.</p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-white/60">
              <span className="bg-white/10 px-2 py-1 rounded-full">HD Video</span>
              <span className="bg-white/10 px-2 py-1 rounded-full">Chat + Q&A</span>
              <span className="bg-white/10 px-2 py-1 rounded-full">Cloud recording</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="bg-black rounded-[20px] overflow-hidden border border-neutral-800 flex flex-col min-h-[520px]">
      {/* top bar */}
      <div className="h-12 bg-[#111827] text-white flex items-center justify-between px-3 sm:px-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>
          <span className="text-sm font-bold">LIVE • {title}</span>
          <span className="hidden sm:inline text-xs bg-white/10 px-2 py-1 rounded-full">ID: {meetingId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full"><Users className="w-3 h-3"/> 1,284 watching</span>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Settings className="w-4 h-4"/></button>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Maximize2 className="w-4 h-4"/></button>
        </div>
      </div>

      {/* main stage */}
      <div className="flex-1 grid lg:grid-cols-[1fr_320px] min-h-[420px]">
        <div className="relative bg-[#0a0a0a] flex flex-col">
          <div className="flex-1 relative flex items-center justify-center p-4">
            {camOn ? (
              <img src="https://images.unsplash.com/photo-1577896859042-629e2ba6c1a8?w=1000&q=80" alt="instructor" className="w-full h-full object-cover rounded-xl max-h-[420px]"/>
            ) : (
              <div className="w-full h-[300px] bg-neutral-900 rounded-xl flex flex-col items-center justify-center text-white/60 gap-3">
                <VideoOff className="w-10 h-10"/>
                <span className="text-sm">Camera off</span>
              </div>
            )}
            <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full font-bold">
              {instructor || 'Instructor'} • Host
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2">
              <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full">REC</span>
              <span className="bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">HD</span>
            </div>
          </div>
          {/* controls */}
          <div className="h-[72px] bg-[#111827] border-t border-white/10 flex items-center justify-center gap-2 sm:gap-3 px-3">
            <button onClick={()=>setMicOn(v=>!v)} className={`w-11 h-11 rounded-full flex items-center justify-center ${micOn?'bg-white text-black':'bg-white/10 text-white hover:bg-white/20'}`}>{micOn?<Mic className="w-5 h-5"/>:<MicOff className="w-5 h-5"/>}</button>
            <button onClick={()=>setCamOn(v=>!v)} className={`w-11 h-11 rounded-full flex items-center justify-center ${camOn?'bg-white text-black':'bg-white/10 text-white'}`}>{camOn?<Video className="w-5 h-5"/>:<VideoOff className="w-5 h-5"/>}</button>
            <button className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><Share2 className="w-5 h-5"/></button>
            <button className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><MessageCircle className="w-5 h-5"/></button>
            <button onClick={()=>setJoined(false)} className="ml-2 bg-[#e11d48] hover:bg-[#be123c] text-white px-5 h-11 rounded-full font-black text-sm flex items-center gap-2"><PhoneOff className="w-4 h-4"/> Leave</button>
          </div>
        </div>

        {/* side panel - chat / participants */}
        <div className="bg-[#0f172a] border-l border-white/10 flex flex-col hidden lg:flex">
          <div className="h-10 border-b border-white/10 flex">
            <button className="flex-1 text-xs font-black text-white border-b-2 border-white">Chat</button>
            <button className="flex-1 text-xs font-bold text-white/60">Q&A</button>
            <button className="flex-1 text-xs font-bold text-white/60">People (1284)</button>
          </div>
          <div className="flex-1 p-3 space-y-3 overflow-y-auto text-sm">
            {[
              {u:'Priya', m:'Sir, will this be available as recording?'},
              {u:'Aman', m:'PYQ of 2019 is also from this topic 🙌'},
              {u:'Host', m:'Yes recording + notes PDF will be uploaded in My Learning within 2 hrs.', system:true},
              {u:'Rahul', m:'Article 32 explanation was 🔥'},
            ].map((c,i)=>(
              <div key={i} className={`rounded-xl p-2.5 ${c.system?'bg-[#4338ca]/20 border border-[#4338ca]/30 text-white':'bg-white/5 text-white/90'}`}>
                <span className="font-black text-xs">{c.u}:</span> <span className="text-xs">{c.m}</span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input placeholder="Ask a question..." className="flex-1 h-10 rounded-full bg-white/10 border border-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none focus:bg-white/20"/>
            <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">›</button>
          </div>
          <div className="px-3 pb-3 text-[11px] text-white/50 text-center">Zoom Webinar • End-to-end encrypted • Cloud recording on</div>
        </div>
      </div>

      {/* fallback notice */}
      <div className="bg-[#1e1b4b] text-white/80 text-xs px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <span>This is a <b className="text-white">mock Zoom UI</b> for demo. To enable real Zoom, add <code className="bg-white/10 px-1.5 py-0.5 rounded">NEXT_PUBLIC_ZOOM_SDK_KEY</code> + <code className="bg-white/10 px-1.5 py-0.5 rounded">ZOOM_SDK_SECRET</code> in env and implement signature endpoint.</span>
        <a href="https://developers.zoom.us/docs/meeting-sdk/web/" target="_blank" className="text-[#f59e0b] font-bold hover:underline">Docs ↗</a>
      </div>
    </div>
  );
}
