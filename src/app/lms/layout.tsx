import LmsHeader from '@/components/lms/LmsHeader';
export default function LmsLayout({ children }: { children: React.ReactNode }){
  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#f8fafc] flex flex-col">
      <LmsHeader />
      <div className="flex-1">{children}</div>
      <footer className="bg-[#0f172a] text-white mt-10">
        <div className="max-w-[1400px] mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-black text-lg">ABHYAS IAS</div>
            <div className="text-white/60 text-xs mt-1">A Low-fee Institute • Keishampat • Chingmeirong • Thangmeiband, Imphal</div>
            <div className="mt-3 text-xs leading-relaxed text-white/70">Quality guidance. Affordable fees. Real results. UPSC CSE 2026 complete preparation — Prelims, Mains, Interview + Zoom live classes.</div>
          </div>
          <div>
            <div className="font-bold text-white">Explore</div>
            <ul className="mt-3 space-y-1.5 text-white/70">
              <li><a href="/lms" className="hover:text-white">All Courses</a></li>
              <li><a href="/lms/packages" className="hover:text-white">Packages & Pricing</a></li>
              <li><a href="/lms/live/live1" className="hover:text-white">Live Classes (Zoom)</a></li>
              <li><a href="/lms/learn" className="hover:text-white">My Learning</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold">Support</div>
            <ul className="mt-3 space-y-1.5 text-white/70">
              <li>ibemhaliashelpdesk@gmail.com</li>
              <li>+91 76290 49230 • WhatsApp</li>
              <li>Mentorship / Counselling Slot Booking</li>
              <li>Student ID • Replays • PDFs</li>
            </ul>
          </div>
          <div>
            <div className="font-bold">Get the App</div>
            <div className="mt-3 flex gap-2">
              <div className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black">Google Play</div>
              <div className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black">App Store</div>
            </div>
            <div className="text-[11px] text-white/50 mt-3">PWA ready • Fits every display • From phone to 4K</div>
            <div className="text-[11px] text-white/50">© 2026 Abhyas IAS. Created for UPSC aspirants.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
