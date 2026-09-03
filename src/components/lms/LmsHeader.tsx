'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLmsStore } from '@/lib/lms/store';
import { Search, Menu, X, ShoppingCart, Bell, BookOpen, Video, LayoutDashboard, Shield, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function LmsHeader(){
  const currentUser = useLmsStore(s=>s.currentUser);
  const switchRole = useLmsStore(s=>s.switchRole);
  const enrollments = useLmsStore(s=>s.enrollments);
  const courses = useLmsStore(s=>s.courses);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = currentUser ? enrollments.filter(e=>e.userId===currentUser.id).length : 0;

  const onSearch = (e:React.FormEvent)=>{
    e.preventDefault();
    if(search.trim()) router.push(`/lms?search=${encodeURIComponent(search.trim())}`);
  };

  const myLearningLink = currentUser ? '/lms/learn' : '/lms';
  const isActive = (p:string)=> pathname===p || pathname.startsWith(p+'/');

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200/70">
      {/* top utility bar */}
      <div className="hidden lg:flex bg-[#0f172a] text-white text-[11px] tracking-wide">
        <div className="max-w-[1400px] mx-auto w-full px-4 py-1.5 flex items-center justify-between">
          <div className="flex gap-4">
            <span className="opacity-80">UPSC CSE 2026 • Prelims 24 May • Mains 21 Aug</span>
            <span className="hidden xl:inline opacity-60">•</span>
            <span className="hidden xl:inline">500+ selections • 10k+ aspirants • 4.9/5 rating</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+917629049230" className="hover:underline">+91 76290 49230</a>
            <span className="opacity-30">|</span>
            <span className="bg-[#f59e0b] text-black px-2 py-0.5 rounded font-black text-[10px]">LIVE • Admissions Open</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-4">
        <div className="h-[64px] sm:h-[72px] flex items-center gap-3 sm:gap-6">
          {/* logo */}
          <Link href="/lms" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1e1b4b] to-[#4338ca] flex items-center justify-center text-white font-black text-[14px] tracking-tighter shadow-lg">A</div>
            <div className="leading-none">
              <div className="font-black tracking-tighter text-[16px] sm:text-[18px] text-[#0f172a]">ABHYAS <span className="text-[#f59e0b]">IAS</span></div>
              <div className="text-[10px] tracking-[0.18em] font-bold text-neutral-500 hidden sm:block">BY IBEMHAL • LOW FEE • HIGH RESULT</div>
            </div>
          </Link>

          {/* search - desktop */}
          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-[560px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search UPSC courses, test series, current affairs..." className="w-full h-10 rounded-full border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-[13px] focus:bg-white focus:border-[#4338ca] focus:ring-4 focus:ring-[#4338ca]/10 outline-none transition" />
            <button type="submit" className="absolute right-1 top-1 bottom-1 bg-[#0f172a] text-white px-5 rounded-full text-xs font-bold hover:bg-black transition hidden lg:block">Search</button>
          </form>

          {/* nav - desktop */}
          <nav className="hidden lg:flex items-center gap-1 text-[13px] font-semibold">
            <Link href="/lms" className={`px-3 py-2 rounded-full ${isActive('/lms') && pathname==='/lms' ? 'bg-[#0f172a] text-white':'hover:bg-neutral-100'}`}>Explore</Link>
            <Link href="/lms/learn" className={`px-3 py-2 rounded-full flex items-center gap-1.5 ${isActive('/lms/learn')?'bg-[#0f172a] text-white':'hover:bg-neutral-100'}`}><LayoutDashboard className="w-3.5 h-3.5"/> My Learning</Link>
            <Link href="/lms/live/live1" className={`px-3 py-2 rounded-full flex items-center gap-1.5 ${isActive('/lms/live')?'bg-[#0f172a] text-white':'hover:bg-neutral-100'}`}><Video className="w-3.5 h-3.5"/> Live</Link>
            <Link href="/lms/packages" className={`px-3 py-2 rounded-full ${isActive('/lms/packages')?'bg-[#0f172a] text-white':'hover:bg-neutral-100'}`}>Packages</Link>
            <Link href="/lms/admin" className={`px-3 py-2 rounded-full flex items-center gap-1.5 ${isActive('/lms/admin')?'bg-[#4338ca] text-white':'bg-neutral-900 text-white hover:bg-black'}`}><Shield className="w-3.5 h-3.5"/> Admin</Link>
          </nav>

          {/* right */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            {/* role switcher */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-1 bg-neutral-100 rounded-full p-1">
                {(['student','teacher','admin'] as const).map(r=>(
                  <button key={r} onClick={()=>switchRole(r)} className={`px-3 py-1.5 rounded-full text-[11px] font-black capitalize transition ${currentUser.role===r ? 'bg-white shadow text-[#0f172a]' : 'text-neutral-500 hover:text-black'}`}>{r}</button>
                ))}
              </div>
            )}
            <Link href="/lms/learn" className="hidden sm:flex relative w-9 h-9 rounded-full bg-neutral-100 items-center justify-center hover:bg-neutral-200">
              <ShoppingCart className="w-4 h-4"/>
              {cartCount>0 && <span className="absolute -top-1 -right-1 bg-[#f59e0b] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>
            <button className="hidden sm:flex w-9 h-9 rounded-full bg-neutral-100 items-center justify-center hover:bg-neutral-200">
              <Bell className="w-4 h-4"/>
            </button>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border border-neutral-200" />
                <div className="hidden sm:block leading-none">
                  <div className="text-xs font-bold">{currentUser.name}</div>
                  <div className="text-[10px] text-neutral-500 capitalize">{currentUser.role}</div>
                </div>
              </div>
            ) : (
              <Link href="/lms/learn" className="hidden sm:inline-flex bg-[#4338ca] text-white px-5 py-2.5 rounded-full text-xs font-black hover:bg-[#3730a3] transition">Sign in</Link>
            )}
            <button onClick={()=>setMobileOpen(v=>!v)} className="lg:hidden w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              {mobileOpen ? <X className="w-4 h-4"/> : <Menu className="w-4 h-4"/>}
            </button>
          </div>
        </div>

        {/* mobile search */}
        <form onSubmit={onSearch} className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses..." className="w-full h-10 rounded-full border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-[#4338ca]" />
          </div>
        </form>
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white">
          <nav className="px-4 py-4 grid gap-2 text-sm font-semibold">
            <Link onClick={()=>setMobileOpen(false)} href="/lms" className="py-2.5 px-3 rounded-xl bg-neutral-50 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Explore Courses</Link>
            <Link onClick={()=>setMobileOpen(false)} href="/lms/learn" className="py-2.5 px-3 rounded-xl bg-neutral-50 flex items-center gap-2"><LayoutDashboard className="w-4 h-4"/> My Learning</Link>
            <Link onClick={()=>setMobileOpen(false)} href="/lms/live/live1" className="py-2.5 px-3 rounded-xl bg-neutral-50 flex items-center gap-2"><Video className="w-4 h-4"/> Live Classes (Zoom)</Link>
            <Link onClick={()=>setMobileOpen(false)} href="/lms/packages" className="py-2.5 px-3 rounded-xl bg-neutral-50">Packages & Pricing</Link>
            <Link onClick={()=>setMobileOpen(false)} href="/lms/admin" className="py-2.5 px-3 rounded-xl bg-[#0f172a] text-white flex items-center gap-2"><Shield className="w-4 h-4"/> Admin • Upload PDFs & Quizzes</Link>
            {currentUser && (
              <div className="flex gap-1 pt-2">
                {(['student','teacher','admin'] as const).map(r=>(
                  <button key={r} onClick={()=>{switchRole(r); setMobileOpen(false);}} className={`flex-1 py-2 rounded-full text-xs font-black capitalize ${currentUser.role===r?'bg-[#4338ca] text-white':'bg-neutral-100'}`}>{r}</button>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}

      {/* categories bar */}
      <div className="border-t border-neutral-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2.5 text-[12px] font-bold">
            <span className="shrink-0 text-neutral-400 hidden sm:inline">UPSC TRACKS:</span>
            {['Foundation','Prelims','Mains','Optional','Current Affairs','Test Series','Interview'].map(cat=>(
              <Link key={cat} href={`/lms?category=${encodeURIComponent(cat)}`} className="shrink-0 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition whitespace-nowrap">{cat}</Link>
            ))}
            <span className="shrink-0 ml-auto hidden lg:flex items-center gap-2 text-[11px] font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> LIVE now: Daily News Analysis
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
