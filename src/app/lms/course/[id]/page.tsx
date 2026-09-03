'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useLmsStore } from '@/lib/lms/store';
import ZoomPlayer from '@/components/lms/ZoomPlayer';
import { PdfCard } from '@/components/lms/PdfViewer';
import PdfViewer from '@/components/lms/PdfViewer';
import QuizRunner from '@/components/lms/QuizRunner';
import { Clock, Video, FileText, Award, Star, Users, ChevronDown, CheckCircle2, Play, Lock, ShoppingCart } from 'lucide-react';
export default function CoursePage(){
  const params = useParams();
  const id = params.id as string;
  const courses = useLmsStore(s=>s.courses);
  const quizzes = useLmsStore(s=>s.quizzes);
  const enrollments = useLmsStore(s=>s.enrollments);
  const currentUser = useLmsStore(s=>s.currentUser);
  const toggleLessonComplete = useLmsStore(s=>s.toggleLessonComplete);
  const enroll = useLmsStore(s=>s.enroll);
  const course = useMemo(()=> courses.find(c=>c.id===id), [courses, id]);
  const enrollment = useMemo(()=> currentUser ? enrollments.find(e=>e.userId===currentUser.id && e.courseId===id) : null, [enrollments, currentUser, id]);
  const enrolled = !!enrollment;
  const [openSection, setOpenSection] = useState<string | null>(course?.sections[0]?.id || null);
  const [activeLesson, setActiveLesson] = useState(course?.sections[0]?.lessons[0] || null);
  const [activePdf, setActivePdf] = useState<any>(null);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  if(!course){ return <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">Course not found. <Link href="/lms" className="text-[#4338ca] font-bold underline">Go back</Link></div>; }
  const totalLessons = course.sections.reduce((a,s)=>a+s.lessons.length,0);
  const totalDuration = course.sections.reduce((a,s)=>a+s.lessons.reduce((b,l)=>b+l.durationMin,0),0);
  const progress = enrollment?.progress || 0;
  const handleEnroll = ()=>{ if(!currentUser){ alert('Switch to student role from header'); return; } enroll(course.id); };
  return (
    <div className="min-h-screen">
      <div className="bg-[#0f172a] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 grid lg:grid-cols-[1.2fr_380px] gap-6">
          <div>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold"><Link href="/lms" className="text-white/60 hover:text-white">Home</Link><span className="text-white/30">/</span><span className="bg-white/10 px-2 py-1 rounded-full">{course.category}</span><span className="bg-white/10 px-2 py-1 rounded-full">{course.level}</span>{course.zoomWebinarEnabled && <span className="bg-emerald-500 px-2 py-1 rounded-full">ZOOM LIVE</span>}</div>
            <h1 className="mt-3 text-[22px] sm:text-[30px] font-black leading-tight tracking-tight">{course.title}</h1>
            <p className="mt-2 text-sm text-white/70 leading-relaxed">{course.subtitle}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs"><span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]"/> {course.rating.toFixed(1)} ({course.ratingCount.toLocaleString()})</span><span className="flex items-center gap-1"><Users className="w-4 h-4"/> {course.students.toLocaleString()} students</span><span className="flex items-center gap-1"><Clock className="w-4 h-4"/> Last updated {course.lastUpdated}</span><span className="flex items-center gap-1"><Video className="w-4 h-4"/> {totalLessons} lessons • {Math.floor(totalDuration/60)}h</span></div>
            <div className="mt-3 flex items-center gap-2"><img src={course.instructorAvatar} alt={course.instructor} className="w-8 h-8 rounded-full"/><span className="text-sm">Created by <span className="font-bold underline">{course.instructor}</span></span><span className="text-xs bg-white/10 px-2 py-1 rounded-full">{course.language}</span></div>
            {enrolled && (<div className="mt-4 bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-3 flex items-center gap-3"><div className="flex-1"><div className="text-xs font-bold opacity-70">Your progress</div><div className="h-2 bg-white/20 rounded-full overflow-hidden mt-1"><div className="h-full bg-[#f59e0b]" style={{width:`${progress}%`}}/></div></div><div className="text-lg font-black">{progress}%</div><Link href="/lms/learn" className="bg-white text-black px-4 py-2 rounded-full text-xs font-black">My Learning</Link></div>)}
          </div>
          <div className="bg-white text-neutral-900 rounded-[24px] overflow-hidden shadow-2xl border border-neutral-200 h-fit lg:sticky lg:top-[84px]">
            <div className="relative aspect-video bg-neutral-900"><img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-black/20"/><button onClick={()=>setActiveLesson(course.sections[0]?.lessons[0])} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white"><span className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl"><Play className="w-6 h-6 fill-black ml-1"/></span><span className="bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">Preview this course</span></button></div>
            <div className="p-5">
              <div className="flex items-baseline gap-2"><span className="text-[26px] font-black">₹{course.price.toLocaleString('en-IN')}</span>{course.originalPrice && <span className="line-through text-sm text-neutral-500">₹{course.originalPrice.toLocaleString('en-IN')}</span>}{course.originalPrice && <span className="text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">-{Math.round(((course.originalPrice-course.price)/course.originalPrice)*100)}% off</span>}</div>
              <div className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">⏱ 2 days left at this price!</div>
              {enrolled ? (<div className="mt-4 space-y-2"><div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-sm font-bold text-center">✓ Enrolled • Go to My Learning or continue below</div><Link href="/lms/learn" className="block text-center bg-[#0f172a] text-white h-11 rounded-full font-black flex items-center justify-center">Continue learning</Link></div>) : (<div className="mt-4 space-y-2"><button onClick={handleEnroll} className="w-full h-11 rounded-full bg-[#0f172a] text-white font-black flex items-center justify-center gap-2 hover:bg-black"><ShoppingCart className="w-4 h-4"/> Enroll now</button><button className="w-full h-11 rounded-full border-2 border-neutral-900 font-black hover:bg-neutral-900 hover:text-white">Add to cart</button><div className="text-center text-[11px] text-neutral-500">30-Day Money-Back Guarantee • Full Lifetime Access</div></div>)}
              <div className="mt-4 space-y-2 text-xs"><div className="font-bold">This course includes:</div><div className="grid gap-1.5 text-neutral-700"><span className="flex items-center gap-2"><Video className="w-3.5 h-3.5"/> {Math.floor(totalDuration/60)}h on-demand + Zoom live</span><span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5"/> {course.pdfs.length} PDFs + notes</span><span className="flex items-center gap-2"><Award className="w-3.5 h-3.5"/> {course.quizIds.length} quizzes + AIR</span><span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5"/> Certificate of completion</span></div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 grid lg:grid-cols-[1.2fr_380px] gap-6 items-start">
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-[20px] overflow-hidden">
            {activeLesson?.zoomMeetingId ? (<ZoomPlayer meetingId={activeLesson.zoomMeetingId} title={activeLesson.title} instructor={course.instructor} />) : activeLesson?.videoUrl ? (<div className="aspect-video bg-black"><iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen title={activeLesson.title}/></div>) : (<div className="aspect-video bg-neutral-900 flex items-center justify-center text-white"><div className="text-center"><Video className="w-10 h-10 mx-auto opacity-50"/><div className="text-sm font-bold mt-2">Select a lesson to start</div></div></div>)}
            {activeLesson && (<div className="p-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100"><div><div className="text-sm font-black">{activeLesson.title}</div><div className="text-xs text-neutral-500">{activeLesson.durationMin} min • {enrolled ? 'Enrolled' : 'Preview'} • {activeLesson.isPreview?'Free preview':''}</div></div>{enrolled && (<button onClick={()=>toggleLessonComplete(course.id, activeLesson.id)} className={`px-4 py-2 rounded-full text-xs font-black border ${enrollment?.completedLessonIds.includes(activeLesson.id) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-neutral-300 hover:bg-neutral-50'}`}>{enrollment?.completedLessonIds.includes(activeLesson.id) ? '✓ Completed' : 'Mark as complete'}</button>)}</div>)}
          </div>
          <div className="bg-white border border-neutral-200 rounded-[20px] overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-neutral-100 flex items-center justify-between"><h3 className="font-black">Course content • {totalLessons} lessons • {Math.floor(totalDuration/60)}h</h3><button className="text-xs font-bold text-[#4338ca] hidden sm:inline">Expand all</button></div>
            <div className="divide-y divide-neutral-100">
              {course.sections.map(sec=>(
                <div key={sec.id}>
                  <button onClick={()=>setOpenSection(openSection===sec.id? null: sec.id)} className="w-full px-4 sm:px-5 py-3 flex items-center justify-between bg-[#f8fafc] hover:bg-[#f1f5f9]"><span className="font-bold text-sm text-left">{sec.title}</span><span className="flex items-center gap-2 text-xs text-neutral-500 shrink-0"><span>{sec.lessons.length} lessons</span><ChevronDown className={`w-4 h-4 transition ${openSection===sec.id?'rotate-180':''}`}/></span></button>
                  {openSection===sec.id && (<div className="divide-y divide-neutral-100">{sec.lessons.map(lesson=>{const isDone = enrollment?.completedLessonIds.includes(lesson.id); const canAccess = enrolled || lesson.isPreview; return (<div key={lesson.id} className={`px-4 sm:px-5 py-3 flex items-center gap-3 hover:bg-neutral-50 ${activeLesson?.id===lesson.id?'bg-[#eef2ff]':''}`}><button onClick={()=> canAccess && setActiveLesson(lesson)} className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-emerald-600 text-white' : canAccess ? 'bg-white border border-neutral-300' : 'bg-neutral-100 text-neutral-400'}`}>{isDone ? <CheckCircle2 className="w-4 h-4"/> : canAccess ? <Play className="w-3.5 h-3.5 ml-0.5"/> : <Lock className="w-3.5 h-3.5"/>}</button><button onClick={()=> canAccess && setActiveLesson(lesson)} className="flex-1 text-left min-w-0"><div className={`text-sm leading-tight ${canAccess?'':'text-neutral-400'}`}>{lesson.title}</div><div className="text-[11px] text-neutral-500 flex items-center gap-2">{lesson.zoomMeetingId ? <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1"><Video className="w-3 h-3"/> Zoom</span> : <Video className="w-3 h-3"/>}<span>{lesson.durationMin} min</span>{lesson.quizId && <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">Quiz</span>}{lesson.pdfs.length>0 && <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> {lesson.pdfs.length} PDFs</span>}</div></button>{lesson.isPreview && !enrolled && <span className="text-[11px] font-black bg-[#0f172a] text-white px-2 py-1 rounded-full">PREVIEW</span>}{lesson.quizId && (<button onClick={()=>{const q = quizzes.find(x=>x.id===lesson.quizId); if(q) setActiveQuiz(q);}} className="text-[11px] font-black bg-white border border-neutral-300 px-2.5 py-1 rounded-full hover:bg-neutral-900 hover:text-white">Take quiz</button>)}</div>);})}</div>)}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-[20px] p-4 sm:p-5"><h3 className="font-black flex items-center gap-2"><FileText className="w-4 h-4"/> Resources & PDFs</h3><div className="mt-3 grid gap-3">{course.pdfs.map(pdf=> <PdfCard key={pdf.id} pdf={pdf} onOpen={()=>setActivePdf(pdf)} />)}{course.pdfs.length===0 && <div className="text-sm text-neutral-500 bg-neutral-50 border border-dashed border-neutral-300 rounded-xl p-4 text-center">No PDFs yet — admin can upload from Admin → Courses.</div>}</div>{activePdf && <div className="mt-4"><PdfViewer pdf={activePdf} onClose={()=>setActivePdf(null)} /></div>}</div>
          {activeQuiz && (<div className="bg-[#f8fafc] border border-neutral-200 rounded-[20px] p-4"><QuizRunner quiz={activeQuiz} onClose={()=>setActiveQuiz(null)} /></div>)}
        </div>
        <div className="space-y-4 lg:sticky lg:top-[84px]">
          <div className="bg-white border border-neutral-200 rounded-[20px] p-4"><h4 className="font-black text-sm">What you’ll learn</h4><ul className="mt-3 grid gap-2 text-xs leading-relaxed">{['Complete Prelims + Mains coverage as per latest UPSC syllabus','Daily Zoom live classes with Chat, Q&A & recording','PDF notes, NCERT summaries, CA compilations','Regular quizzes & All India Test Series with ranking','1:1 mentorship slot booking & counselling'].map(x=>(<li key={x} className="flex gap-2"><span className="mt-1 w-1.5 h-1.5 bg-[#4338ca] rounded-full shrink-0"/> <span>{x}</span></li>))}</ul></div>
          <div className="bg-[#0f172a] text-white rounded-[20px] p-4"><div className="text-sm font-black">Instructor</div><div className="mt-3 flex gap-3 items-center"><img src={course.instructorAvatar} alt={course.instructor} className="w-12 h-12 rounded-full"/><div><div className="font-bold text-sm">{course.instructor}</div><div className="text-xs opacity-70">UPSC Mentor • 15 yrs • 500+ selections</div></div></div><div className="mt-3 text-xs opacity-80 leading-relaxed">Quality guidance at a low fee. Real results. Join live via Zoom — your Student ID unlocks everything.</div></div>
          <Link href="/lms/learn" className="block bg-white border border-neutral-200 rounded-[16px] p-3 text-center hover:bg-neutral-50"><div className="text-xs font-black">↩ Back to My Learning</div><div className="text-[11px] text-neutral-500">Track progress, calendar, PDFs</div></Link>
        </div>
      </div>
    </div>
  );
}
