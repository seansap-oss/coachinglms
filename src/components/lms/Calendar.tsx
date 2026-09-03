'use client';
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Clock, BookOpen } from 'lucide-react';
import { useLmsStore } from '@/lib/lms/store';

export default function StudyCalendar(){
  const logs = useLmsStore(s=>s.studyLogs);
  const [cursor, setCursor] = useState(new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const todayStr = new Date().toISOString().slice(0,10);

  const map = useMemo(()=>{
    const m = new Map<string, number>();
    logs.forEach(l=> m.set(l.date, l.minutes));
    return m;
  },[logs]);

  const totalThisMonth = useMemo(()=>{
    let t=0;
    for(let d=1; d<=daysInMonth; d++){
      const ds = new Date(year,month,d).toISOString().slice(0,10);
      t += map.get(ds)||0;
    }
    return t;
  },[map, year, month, daysInMonth]);

  const streak = useMemo(()=>{
    let s=0;
    const d = new Date();
    while(true){
      const ds = d.toISOString().slice(0,10);
      if((map.get(ds)||0) > 0){ s++; d.setDate(d.getDate()-1); } else break;
      if(s>60) break;
    }
    return s;
  },[map]);

  const monthName = cursor.toLocaleString('en-IN', { month:'long', year:'numeric' });

  return (
    <div className="bg-white rounded-[20px] border border-neutral-200 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-[15px] flex items-center gap-2"><Clock className="w-4 h-4"/> Study Calendar</h3>
        <div className="flex items-center gap-1">
          <button onClick={()=>setCursor(new Date(year, month-1, 1))} className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50"><ChevronLeft className="w-4 h-4"/></button>
          <button onClick={()=>setCursor(new Date(year, month+1, 1))} className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50"><ChevronRight className="w-4 h-4"/></button>
        </div>
      </div>
      <div className="mt-1 text-xs font-bold text-neutral-500">{monthName} • {totalThisMonth} mins this month</div>

      <div className="mt-3 flex gap-2">
        <div className="flex-1 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"><Flame className="w-5 h-5 text-[#f59e0b]"/></div>
          <div><div className="text-[18px] font-black leading-none">{streak} days</div><div className="text-[11px] opacity-70">current streak</div></div>
        </div>
        <div className="flex-1 bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#f59e0b] flex items-center justify-center text-white"><BookOpen className="w-5 h-5"/></div>
          <div><div className="text-[18px] font-black leading-none">{Math.round(totalThisMonth/60*10)/10}h</div><div className="text-[11px] text-[#9a3412]">this month</div></div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-neutral-400">
        {['S','M','T','W','T','F','S'].map(d=> <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1">
        {Array.from({length:firstDay}).map((_,i)=><div key={'e'+i} className="h-9 sm:h-10"/>)}
        {Array.from({length:daysInMonth}).map((_,i)=>{
          const d = i+1;
          const ds = new Date(year,month,d).toISOString().slice(0,10);
          const mins = map.get(ds)||0;
          const isToday = ds===todayStr;
          const intensity = mins===0 ? 'bg-neutral-50 border border-neutral-100 text-neutral-400' : mins<30 ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : mins<60 ? 'bg-emerald-100 border border-emerald-300 text-emerald-800' : 'bg-emerald-600 text-white border border-emerald-600';
          return (
            <div key={d} className={`h-9 sm:h-10 rounded-xl flex flex-col items-center justify-center text-xs font-bold relative ${intensity} ${isToday?'ring-2 ring-[#4338ca] ring-offset-1':''}`}>
              <span>{d}</span>
              {mins>0 && <span className="text-[9px] font-black leading-none">{mins}m</span>}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-neutral-500">
        <span className="w-3 h-3 rounded bg-neutral-50 border border-neutral-200"/> No study
        <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200"/> &lt;30m
        <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"/> 30-60m
        <span className="w-3 h-3 rounded bg-emerald-600"/> 60m+
      </div>
    </div>
  );
}
