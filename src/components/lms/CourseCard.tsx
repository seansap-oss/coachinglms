'use client';
import Link from 'next/link';
import type { Course } from '@/lib/lms/types';
import { Star, Users, Clock, Video, FileText, Award, Play } from 'lucide-react';

export default function CourseCard({ course, enrolled, progress }: { course: Course; enrolled?: boolean; progress?: number }) {
  const discount = course.originalPrice ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;
  const totalLessons = course.sections.reduce((a,s)=>a+s.lessons.length,0);
  const totalDuration = course.sections.reduce((a,s)=>a+s.lessons.reduce((b,l)=>b+l.durationMin,0),0);
  const hrs = Math.floor(totalDuration/60);
  return (
    <Link href={`/lms/course/${course.id}`} className="group bg-white border border-neutral-200 rounded-[18px] overflow-hidden hover:shadow-xl hover:border-neutral-300 transition-all flex flex-col h-full">
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
        <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"/>
        {course.isBestseller && <span className="absolute top-3 left-3 bg-[#facc15] text-black text-[10px] font-black px-2.5 py-1 rounded-full tracking-wide">BESTSELLER</span>}
        {course.isFeatured && !course.isBestseller && <span className="absolute top-3 left-3 bg-[#0f172a] text-white text-[10px] font-black px-2.5 py-1 rounded-full">FEATURED</span>}
        {discount>0 && <span className="absolute top-3 right-3 bg-[#e11d48] text-white text-[11px] font-black px-2 py-1 rounded-full">-{discount}%</span>}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5"><Video className="w-3 h-3"/> {totalLessons} lessons • {hrs}h</span>
          <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition"><Play className="w-4 h-4 fill-black ml-0.5"/></span>
        </div>
        {enrolled && progress!==undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
            <div className="h-full bg-[#f59e0b] transition-all" style={{width: `${progress}%`}}/>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-black tracking-wide px-2 py-1 rounded-full bg-[#f1f5f9] text-[#334155]">{course.category}</span>
          <span className="text-[11px] font-bold text-neutral-500">{course.level}</span>
          {course.zoomWebinarEnabled && <span className="ml-auto text-[10px] font-black bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> ZOOM LIVE</span>}
        </div>
        <h3 className="font-bold leading-tight line-clamp-2 text-[14.5px] group-hover:text-[#4338ca] transition">{course.title}</h3>
        <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">{course.subtitle}</p>
        <div className="flex items-center gap-2 mt-3">
          <img src={course.instructorAvatar} alt={course.instructor} className="w-6 h-6 rounded-full object-cover"/>
          <span className="text-xs font-semibold text-neutral-700">{course.instructor}</span>
        </div>
        <div className="flex items-center gap-2 mt-3 text-[11px]">
          <span className="flex items-center gap-1 font-bold"><Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]"/> {course.rating.toFixed(1)}</span>
          <span className="text-neutral-500">({course.ratingCount.toLocaleString()})</span>
          <span className="flex items-center gap-1 text-neutral-500"><Users className="w-3 h-3"/> {course.students.toLocaleString()}</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] font-black">₹{course.price.toLocaleString('en-IN')}</span>
              {course.originalPrice && <span className="text-xs line-through text-neutral-400">₹{course.originalPrice.toLocaleString('en-IN')}</span>}
            </div>
            <div className="text-[11px] text-neutral-500 flex items-center gap-2"><Clock className="w-3 h-3"/> Updated {course.lastUpdated}</div>
          </div>
          {enrolled ? (
            <span className="bg-emerald-600 text-white text-xs font-black px-3 py-2 rounded-full">{progress}% • Continue</span>
          ) : (
            <span className="bg-[#0f172a] text-white text-xs font-black px-3.5 py-2 rounded-full group-hover:bg-black transition">View course</span>
          )}
        </div>
      </div>
    </Link>
  );
}
