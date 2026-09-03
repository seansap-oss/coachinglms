'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLmsStore } from '@/lib/lms/store';
import ZoomPlayer from '@/components/lms/ZoomPlayer';
import { Clock, Users, Calendar, Video, FileText, ArrowLeft } from 'lucide-react';
export default function LivePage(){
  const params = useParams();
  const id = params.id as string;
  const liveClasses = useLmsStore(s=>s.liveClasses);
  const courses = useLmsStore(s=>s.courses);
  const live = liveClasses.find(l=>l.id===id) || liveClasses[0];
  const course = live ? courses.find(c=>c.id===live.courseId) : null;
  if(!live) return <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">Live class not found</div>;
  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6 sm:py-8">
      <Link href="/lms" className="inline-flex items-center gap-1.5 text-xs font-bold bg-white border border-neutral-200 px-3 py-1.5 rounded-full hover:bg-neutral-50"><ArrowLeft className="w-3.5 h-3.5"/> Back to Explore</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2"><span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${live.status==='live'?'bg-red-600 text-white':'bg-amber-500 text-black'}`}>{live.status==='live' ? '● LIVE NOW' : 'SCHEDULED'}</span><span className="text-xs bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-bold">Zoom Webinar • ID: {live.meetingId}</span>{course && <span className="text-xs bg-[#eef2ff] border border-[#c7d2fe] text-[#4338ca] px-2.5 py-1 rounded-full font-bold">{course.category}</span>}</div>
          <h1 className="mt-3 text-[22px] sm:text-[28px] font-black leading-tight tracking-tighter">{live.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-600"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> {new Date(live.startAt).toLocaleString('en-IN', { dateStyle:'full', timeStyle:'short'})}</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {live.durationMin} min</span><span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> 1,284 registered</span><span className="hidden sm:inline">Instructor: <b>{live.instructor}</b></span></div>
        </div>
        <div className="flex gap-2"><Link href="/lms/learn" className="bg-white border border-neutral-200 px-4 py-2 rounded-full text-xs font-bold hover:bg-neutral-50">My Learning</Link>{course && <Link href={`/lms/course/${course.id}`} className="bg-[#0f172a] text-white px-4 py-2 rounded-full text-xs font-black">Open course</Link>}</div>
      </div>
      <div className="mt-6"><ZoomPlayer meetingId={live.meetingId} title={live.title} instructor={live.instructor} startAt={live.startAt} /></div>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-[18px] p-4"><div className="text-sm font-black flex items-center gap-2"><Video className="w-4 h-4"/> How to join</div><ol className="mt-2 text-xs leading-relaxed text-neutral-600 list-decimal list-inside space-y-1"><li>Click <b>Join via Zoom</b> above — no app needed (Component View).</li><li>Allow camera & mic when prompted.</li><li>Use Chat & Q&A on the right side panel.</li><li>Recording + PDFs appear in <b>My Learning</b> within 2 hrs.</li></ol></div>
        <div className="bg-white border border-neutral-200 rounded-[18px] p-4"><div className="text-sm font-black flex items-center gap-2"><FileText className="w-4 h-4"/> After this live</div><ul className="mt-2 text-xs leading-relaxed text-neutral-600 space-y-1"><li>• PDF notes & slides (admin uploads)</li><li>• Mini quiz for this topic</li><li>• Next live: Mains Answer Writing</li></ul>{course && <Link href={`/lms/course/${course.id}`} className="mt-3 inline-flex bg-[#0f172a] text-white px-3 py-1.5 rounded-full text-xs font-black">Go to course</Link>}</div>
        <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-[18px] p-4"><div className="text-sm font-black">Your Student ID matters</div><div className="text-xs text-[#9a3412] mt-1">Same Student ID unlocks: live access, PDFs, reminders & replays. This mirrors Ibemhal’s real flow — your package decides which lives you see.</div></div>
      </div>
    </div>
  );
}
