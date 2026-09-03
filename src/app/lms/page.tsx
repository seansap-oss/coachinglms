'use client';
import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLmsStore } from '@/lib/lms/store';
import { EXAM_PATTERN } from '@/lib/lms/data';
import CourseCard from '@/components/lms/CourseCard';
import PackageCard from '@/components/lms/PackageCard';
import { Search, Play, Award, Users, BookOpen, Clock, Video, FileText, ShieldCheck, Sparkles, ArrowRight, Star, Quote, MapPin, Phone, Mail, ChevronRight, GraduationCap, Target, Library } from 'lucide-react';

function LandingContent(){
  const courses = useLmsStore(s=>s.courses);
  const packages = useLmsStore(s=>s.packages);
  const liveClasses = useLmsStore(s=>s.liveClasses);
  const enrollments = useLmsStore(s=>s.enrollments);
  const currentUser = useLmsStore(s=>s.currentUser);
  const searchParams = useSearchParams();
  const q = searchParams.get('search') || '';
  const cat = searchParams.get('category') || '';
  const filtered = useMemo(()=>{
    let list=[...courses];
    if(q) list=list.filter(c=> (c.title+c.subtitle+c.tags.join(' ')).toLowerCase().includes(q.toLowerCase()));
    if(cat) list=list.filter(c=> c.category.toLowerCase()===cat.toLowerCase());
    return list;
  },[courses,q,cat]);
  const enrolledIds = currentUser ? enrollments.filter(e=>e.userId===currentUser.id).map(e=>e.courseId) : [];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-[#0f172a] text-white">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=80" alt="students" className="w-full h-full object-cover opacity-[0.18]"/>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b]/80 to-[#0f172a]"/>
          <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-[#4338ca]/30 rounded-full blur-[90px]"/>
          <div className="absolute -bottom-32 -left-32 w-[640px] h-[640px] bg-[#f59e0b]/15 rounded-full blur-[100px]"/>
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/> UPSC CSE 2026 • Admissions Open • Low-fee Institute
            </div>
            <h1 className="mt-4 text-[30px] sm:text-[42px] lg:text-[52px] font-black leading-[0.95] tracking-tighter">Your <span className="text-[#f59e0b]">Journey</span> <br/> Begins Here.</h1>
            <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-white/70 max-w-[560px]">Udemy-style learning, Zoom live classes, PDFs, quizzes & 1:1 mentorship — built for UPSC. Quality guidance. Affordable fees. Real results.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#packages" className="bg-[#f59e0b] text-black px-6 py-3 rounded-full font-black text-sm hover:bg-[#fbbf24] transition flex items-center gap-2">Explore Packages <ArrowRight className="w-4 h-4"/></Link>
              <Link href="/lms/live/live1" className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-neutral-100 transition flex items-center gap-2"><Video className="w-4 h-4"/> Join Live Class</Link>
              <Link href="/lms/learn" className="hidden sm:inline-flex bg-white/10 backdrop-blur border border-white/20 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-white/20">My Learning</Link>
            </div>
            <div className="mt-6 grid grid-cols-3 sm:flex gap-4 sm:gap-8 border-t border-white/10 pt-6 max-w-[520px]">
              <div><div className="text-[22px] font-black leading-none">500+</div><div className="text-[11px] tracking-wide font-bold text-white/60">SELECTIONS</div></div>
              <div><div className="text-[22px] font-black leading-none">10k+</div><div className="text-[11px] tracking-wide font-bold text-white/60">ASPIRANTS</div></div>
              <div><div className="text-[22px] font-black leading-none">100+</div><div className="text-[11px] tracking-wide font-bold text-white/60">COURSES</div></div>
              <div><div className="text-[22px] font-black leading-none flex items-center gap-1">4.9/5 <Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]"/></div><div className="text-[11px] tracking-wide font-bold text-white/60">RATING</div></div>
            </div>
            <div className="mt-6 bg-white rounded-[18px] p-2 flex gap-2 max-w-[560px] shadow-xl">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-4 h-4 text-neutral-400"/>
                <input placeholder="What do you want to learn? e.g. Polity, Prelims, CA..." className="flex-1 h-10 outline-none text-sm text-neutral-900 placeholder:text-neutral-400" />
              </div>
              <button className="bg-[#0f172a] text-white px-6 rounded-full font-black text-sm hover:bg-black">Search</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold">
              <span className="text-white/50">Popular:</span>
              {['Prelims 2026','Mains Answer Writing','Current Affairs','Optional PSIR'].map(t=>(
                <Link key={t} href={`/lms?search=${encodeURIComponent(t)}`} className="bg-white/10 border border-white/15 px-2.5 py-1 rounded-full hover:bg-white hover:text-black transition">{t}</Link>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-white text-neutral-900 rounded-[24px] overflow-hidden shadow-2xl border border-white/20">
              <div className="relative aspect-[16/10] bg-neutral-900">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80" alt="live class" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5"><span className="w-2 h-2 bg-white rounded-full animate-pulse"/> LIVE</div>
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold">12:30 PM • Zoom</div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="bg-white/95 backdrop-blur rounded-2xl p-2.5 flex items-center gap-2.5">
                    <img src="https://i.pravatar.cc/150?img=5" alt="teacher" className="w-9 h-9 rounded-full"/>
                    <div className="leading-none">
                      <div className="text-xs font-black">Dr. Ibemhal Devi</div>
                      <div className="text-[11px] text-neutral-500">Polity • Live now</div>
                    </div>
                    <span className="ml-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full">JOIN</span>
                  </div>
                  <Link href="/lms/live/live1" className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition"><Play className="w-5 h-5 fill-black ml-0.5"/></Link>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-black leading-tight">LIVE Interactive Teleclasses</h3>
                <p className="text-xs text-neutral-500 mt-1">Your purchased package automatically decides which live classes appear under your permanent Student ID.</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Link href="/lms/live/live1" className="bg-[#0f172a] text-white rounded-xl p-2.5 text-center hover:bg-black">
                    <div className="text-[11px] font-black">Join upcoming</div>
                    <div className="text-[10px] opacity-70">Zoom webinar</div>
                  </Link>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-center">
                    <div className="text-[11px] font-black">View schedule</div>
                    <div className="text-[10px] text-neutral-500">Calendar</div>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-center">
                    <div className="text-[11px] font-black">Watch replay</div>
                    <div className="text-[10px] text-neutral-500">Recordings</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-neutral-600">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3"/> 1,284 live</span>
                  <span className="w-1 h-1 bg-neutral-300 rounded-full"/>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> PDFs after class</span>
                  <span className="ml-auto text-emerald-600">● Live access, PDFs, reminders</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex absolute -right-4 -bottom-6 bg-white border border-neutral-200 rounded-2xl p-3 shadow-xl items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f59e0b] flex items-center justify-center text-white"><Award className="w-5 h-5"/></div>
              <div><div className="text-xs font-black">AIR 12 — Priya S.</div><div className="text-[11px] text-neutral-500">Foundation 2024 batch</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <span className="font-black tracking-widest text-neutral-400 hidden sm:inline">TRUSTED BY</span>
            <div className="flex items-center gap-5 font-bold text-neutral-700">
              <span>Manipur PSC</span><span>•</span><span>SSC</span><span>•</span><span>Banking</span><span>•</span><span>State Services</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-black"><ShieldCheck className="w-3.5 h-3.5"/> 30-day refund</span>
            <span className="inline-flex items-center gap-1.5 bg-[#0f172a] text-white px-3 py-1.5 rounded-full font-black"><Phone className="w-3 h-3"/> +91 76290 49230</span>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[22px] sm:text-[28px] font-black tracking-tighter flex items-center gap-2"><GraduationCap className="w-6 h-6 text-[#4338ca]"/> UPSC CSE 2026 — Exam pattern at a glance</h2>
            <p className="text-sm text-neutral-500 mt-1">3 stages • 11 papers • 2025 marks decide your rank. Prelims is qualifying; Mains + Interview is merit.</p>
          </div>
          <Link href="#courses" className="text-sm font-black bg-white border border-neutral-200 px-4 py-2 rounded-full hover:bg-neutral-50 hidden sm:inline-flex">Explore courses →</Link>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <div className="bg-white border border-neutral-200 rounded-[20px] p-5">
            <div className="text-xs font-black tracking-widest text-[#4338ca]">STAGE 1 • SCREENING</div>
            <h3 className="font-black text-[18px] mt-1">Preliminary</h3>
            <div className="text-xs text-neutral-500">400 marks • 2 hrs + 2 hrs • OMR</div>
            <div className="mt-4 space-y-2">
              {EXAM_PATTERN.prelims.map(p=>(
                <div key={p.paper} className="bg-[#f8fafc] border border-neutral-200 rounded-2xl p-3 flex justify-between items-center">
                  <div><div className="text-sm font-bold">{p.paper}</div><div className="text-[11px] text-neutral-500">{p.type} • {p.duration}</div></div>
                  <div className="text-right"><div className="text-sm font-black">{p.marks}</div><div className="text-[11px] font-bold text-amber-700">{p.note}</div></div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-neutral-500 mt-3">Only GS Paper-I decides cut-off; CSAT must be 33% to qualify.</p>
          </div>

          <div className="bg-[#0f172a] text-white rounded-[20px] p-5 lg:col-span-2">
            <div className="text-xs font-black tracking-widest text-[#f59e0b]">STAGE 2 • COUNTED • 7 PAPERS + 2 QUALIFYING</div>
            <h3 className="font-black text-[18px] mt-1">Mains — 1750 marks • Descriptive</h3>
            <div className="mt-4 grid sm:grid-cols-2 gap-2">
              {EXAM_PATTERN.mains.map(p=>(
                <div key={p.paper} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-3 flex justify-between items-center">
                  <div className="text-sm font-bold leading-tight">{p.paper}</div>
                  <div className="text-sm font-black">{p.marks}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-white text-black px-3 py-1.5 rounded-full text-xs font-black">+ 2 qualifying @300 each (Indian Lang + English)</span>
              <span className="bg-[#f59e0b] text-black px-3 py-1.5 rounded-full text-xs font-black">Interview 275</span>
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold">Total merit: 2025</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {k:'48', l:'Optional subjects', d:'500 marks (Paper VI-VII)'},
            {k:'11', l:'Papers total', d:'2 Prelims + 9 Mains'},
            {k:'6/9/∞', l:'Attempts', d:'Gen/OBC/SC-ST'},
            {k:'21-32', l:'Age (Gen)', d:'Relaxation by category'},
          ].map(x=>(
            <div key={x.l} className="bg-white border border-neutral-200 rounded-2xl p-4">
              <div className="text-[20px] font-black tracking-tighter">{x.k}</div>
              <div className="text-xs font-bold">{x.l}</div>
              <div className="text-[11px] text-neutral-500">{x.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fff7ed] border-y border-[#fed7aa]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1"><span className="w-2 h-2 bg-white rounded-full animate-pulse"/> LIVE NOW</span>
            <span className="text-sm font-bold">Daily Current Affairs — 02 Sep • Zoom</span>
            <span className="hidden sm:inline text-xs bg-white border border-[#fed7aa] px-2.5 py-1 rounded-full">1,284 watching</span>
          </div>
          <div className="ml-auto flex gap-2">
            {liveClasses.slice(0,3).map(l=>(
              <Link key={l.id} href={`/lms/live/${l.id}`} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${l.status==='live'?'bg-[#0f172a] text-white border-black':'bg-white border-neutral-200 hover:bg-neutral-50'}`}>{l.status==='live'?'Join live':'Upcoming'}: {l.title.slice(0,22)}...</Link>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe] px-3 py-1 rounded-full text-[11px] font-black tracking-wide"><Sparkles className="w-3.5 h-3.5"/> PACKAGES THAT SELL • CHOOSE YOUR TRACK</div>
            <h2 className="text-[24px] sm:text-[32px] font-black tracking-tighter mt-3 leading-none">Invest once, prepare <span className="text-[#4338ca]">right.</span></h2>
            <p className="text-sm text-neutral-500 mt-2 max-w-[600px]">Student pays, teacher pays, admin pays — packages to sell courses so people can buy. UPI / Card / Netbanking • EMI • 30-day refund.</p>
          </div>
          <Link href="/lms/packages" className="hidden sm:inline-flex bg-[#0f172a] text-white px-5 py-2.5 rounded-full font-black text-sm hover:bg-black">Compare all packages <ChevronRight className="w-4 h-4"/></Link>
        </div>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {packages.map(p=> <PackageCard key={p.id} pkg={p} />)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-neutral-500 justify-center">
          <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-full">✓ Live + Recorded</span>
          <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-full">✓ PDFs & Notes</span>
          <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-full">✓ Zoom Webinars</span>
          <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-full">✓ Quizzes & AIR</span>
          <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-full">✓ Mentorship slots</span>
        </div>
      </section>

      <section id="courses" className="bg-white border-y border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[22px] sm:text-[26px] font-black tracking-tighter flex items-center gap-2"><Library className="w-5 h-5"/> Courses — Udemy-style catalog</h2>
              <p className="text-sm text-neutral-500 mt-1">6 curated courses for UPSC 2026. {q? `Search: “${q}” • `:''}{cat? `Category: ${cat} • `:''}{filtered.length} results • Responsive from 320px to 4K.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/lms/learn" className="bg-neutral-900 text-white px-4 py-2 rounded-full text-sm font-black hover:bg-black">Go to My Learning</Link>
              <Link href="/lms/admin" className="hidden sm:inline-flex bg-white border border-neutral-200 px-4 py-2 rounded-full text-sm font-bold hover:bg-neutral-50">Admin →</Link>
            </div>
          </div>

          {(q || cat) && (
            <div className="mt-4 flex gap-2">
              <Link href="/lms" className="text-xs font-black bg-[#0f172a] text-white px-3 py-1.5 rounded-full">Clear filters ✕</Link>
              {q && <span className="text-xs bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full">Search: {q}</span>}
              {cat && <span className="text-xs bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full">Category: {cat}</span>}
            </div>
          )}

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map(c=>{
              const prog = enrollments.find(e=> e.courseId===c.id && e.userId===currentUser?.id)?.progress;
              const enrolled = prog!==undefined;
              return <CourseCard key={c.id} course={c} enrolled={enrolled} progress={prog} />;
            })}
          </div>
          {filtered.length===0 && (
            <div className="mt-8 text-center bg-neutral-50 border border-dashed border-neutral-300 rounded-[20px] p-8">
              <div className="text-sm font-bold">No courses found</div>
              <div className="text-xs text-neutral-500 mt-1">Try another search or clear filters.</div>
              <Link href="/lms" className="inline-flex mt-3 bg-[#0f172a] text-white px-4 py-2 rounded-full text-xs font-black">Clear filters</Link>
            </div>
          )}

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              {icon: Target, title:'Track progress', desc:'Lesson completion, streaks, time spent — calendar + analytics like Udemy.'},
              {icon: FileText, title:'PDF vault', desc:'Syllabus, NCERT summaries, CA PDFs — viewer + download + offline.'},
              {icon: Video, title:'Zoom native', desc:'Component View embedded webinar — chat, Q&A, recording without leaving LMS.'},
            ].map(f=>(
              <div key={f.title} className="bg-[#f8fafc] border border-neutral-200 rounded-[18px] p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shrink-0"><f.icon className="w-5 h-5 text-[#4338ca]"/></div>
                <div><div className="text-sm font-black">{f.title}</div><div className="text-xs text-neutral-500 mt-1 leading-relaxed">{f.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-10 grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 sm:p-6">
          <h3 className="font-black text-[18px] flex items-center gap-2"><Users className="w-5 h-5 text-[#4338ca]"/> Learn from toppers & mentors</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {name:'Dr. Ibemhal Devi', role:'Founder • Polity & History', img:'https://i.pravatar.cc/150?img=5', exp:'15 yrs • 500+ selections'},
              {name:'Anjali Mehta IAS', role:'Mains & Essay', img:'https://i.pravatar.cc/150?img=32', exp:'AIR 42 • Ethics expert'},
              {name:'R.K. Singh', role:'Prelims & CSAT', img:'https://i.pravatar.cc/150?img=12', exp:'10k+ students • Test guru'},
              {name:'Prof. Verma', role:'Optional - PSIR', img:'https://i.pravatar.cc/150?img=15', exp:'JNU • 20 yrs'},
            ].map(f=>(
              <div key={f.name} className="border border-neutral-200 rounded-2xl p-3 flex gap-3 items-center">
                <img src={f.img} alt={f.name} className="w-12 h-12 rounded-full object-cover"/>
                <div><div className="text-sm font-black leading-none">{f.name}</div><div className="text-[11px] text-neutral-500">{f.role}</div><div className="text-[11px] font-bold text-[#4338ca] mt-1">{f.exp}</div></div>
              </div>
            ))}
          </div>
          <Link href="/lms/live/live1" className="mt-4 inline-flex bg-[#0f172a] text-white px-4 py-2 rounded-full text-sm font-black hover:bg-black">Attend live class →</Link>
        </div>

        <div className="bg-[#0f172a] text-white rounded-[24px] p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#4338ca]/30 rounded-full blur-2xl"/>
          <h3 className="font-black text-[18px] flex items-center gap-2"><Quote className="w-5 h-5 text-[#f59e0b]"/> What aspirants say</h3>
          <div className="mt-4 grid gap-3">
            {[
              {name:'Priya S. • AIR 12', text:'Foundation course + daily CA PDFs + Zoom doubts saved me. Low fee but full seriousness.', stars:5},
              {name:'Aman K. • Prelims 2025 cleared', text:'Test series AIR is real. I could track my weak areas with the calendar & analytics.', stars:5},
              {name:'Lintha • Manipur PSC', text:'Mentorship slot booking is game-changer. Personal guidance, not recorded generic.', stars:5},
            ].map(t=>(
              <div key={t.name} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-3.5">
                <div className="flex gap-1">{Array.from({length:t.stars}).map((_,i)=><Star key={i} className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]"/>)}</div>
                <div className="text-sm leading-relaxed mt-2">“{t.text}”</div>
                <div className="text-xs font-bold text-white/70 mt-2">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-8">
        <div className="bg-white border border-neutral-200 rounded-[24px] p-5 sm:p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="font-black flex items-center gap-2"><MapPin className="w-4 h-4"/> Visit our centres • Imphal</h3>
            <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
              {['Keishampat','Chingmeirong','Thangmeiband'].map(p=>(
                <div key={p} className="bg-[#f8fafc] border border-neutral-200 rounded-2xl p-3">
                  <div className="font-black">{p}</div>
                  <div className="text-xs text-neutral-500">Imphal, Manipur</div>
                  <div className="text-[11px] font-bold mt-2 text-[#4338ca]">Mon–Sat 9am–6pm</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0f172a] text-white rounded-2xl p-4">
            <div className="text-sm font-black">Need guidance?</div>
            <div className="text-xs text-white/70 mt-1">Book mentorship / counselling slot.</div>
            <a href="tel:+917629049230" className="mt-3 inline-flex items-center gap-2 bg-[#f59e0b] text-black px-4 py-2 rounded-full text-xs font-black"><Phone className="w-3.5 h-3.5"/> +91 76290 49230</a>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-white/60"><Mail className="w-3 h-3"/> ibemhaliashelpdesk@gmail.com</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function LmsLanding(){
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4338ca]"/></div>}>
      <LandingContent />
    </Suspense>
  );
}