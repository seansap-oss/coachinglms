'use client';
import PackageCard from '@/components/lms/PackageCard';
import { useLmsStore } from '@/lib/lms/store';
import Link from 'next/link';
import { ShieldCheck, Clock, Video, FileText } from 'lucide-react';
export default function PackagesPage(){
  const packages = useLmsStore(s=>s.packages);
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-[28px] sm:text-[36px] font-black tracking-tighter leading-none">Packages to sell courses <span className="text-[#4338ca]">so people can buy.</span></h1>
        <p className="mt-3 text-sm text-neutral-500">Student pays, teacher pays, admin pays — but packages are what convert. Choose wisely. EMI from ₹333/mo • UPI / Card / Netbanking • 30-day refund. UPSC CSE 2026 ready.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] font-bold">
          <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-full flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600"/> 30-day refund</span>
          <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Video className="w-3.5 h-3.5"/> Zoom live included</span>
          <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-full flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> PDFs + Tests</span>
          <span className="bg-white border border-neutral-200 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Lifetime access</span>
        </div>
      </div>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {packages.map(p=> <PackageCard key={p.id} pkg={p} />)}
      </div>
      <div className="mt-8 bg-[#0f172a] text-white rounded-[24px] p-6 grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-black text-[18px]">What’s inside every package?</h3>
          <ul className="mt-3 grid gap-2 text-sm">
            <li className="flex gap-2"><span className="text-[#f59e0b]">✓</span> Live + recorded access via Zoom Webinar (Component View)</li>
            <li className="flex gap-2"><span className="text-[#f59e0b]">✓</span> PDF vault: syllabus, NCERT summaries, CA compilations</li>
            <li className="flex gap-2"><span className="text-[#f59e0b]">✓</span> Quizzes & All India Test Series with ranking</li>
            <li className="flex gap-2"><span className="text-[#f59e0b]">✓</span> Progress tracking + calendar + streaks</li>
            <li className="flex gap-2"><span className="text-[#f59e0b]">✓</span> Mentorship / counselling slot booking</li>
          </ul>
        </div>
        <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5">
          <div className="text-sm font-black">Still undecided?</div>
          <div className="text-xs opacity-70 mt-1">Talk to our counsellor — free guidance. We’ll map your optional, timeline & budget.</div>
          <div className="mt-4 flex gap-2">
            <a href="tel:+917629049230" className="bg-[#f59e0b] text-black px-5 py-2.5 rounded-full text-sm font-black">Call: +91 76290 49230</a>
            <Link href="/lms/learn" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-black">Go to My Learning</Link>
          </div>
          <div className="text-[11px] opacity-60 mt-2">Keishampat • Chingmeirong • Thangmeiband, Imphal • ibemhaliashelpdesk@gmail.com</div>
        </div>
      </div>
    </div>
  );
}
