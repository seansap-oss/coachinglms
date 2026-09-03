'use client';
import type { Package } from '@/lib/lms/types';
import { Check, Crown, Sparkles } from 'lucide-react';
import { useLmsStore } from '@/lib/lms/store';
import { useState } from 'react';

export default function PackageCard({ pkg }: { pkg: Package }) {
  const enrollPackage = useLmsStore(s=>s.enrollPackage);
  const currentUser = useLmsStore(s=>s.currentUser);
  const [purchased, setPurchased] = useState(false);
  const onBuy = ()=>{
    if(!currentUser){ alert('Please sign in as student first'); return; }
    enrollPackage(pkg.id);
    setPurchased(true);
    setTimeout(()=>setPurchased(false), 2500);
  };
  const discount = pkg.originalPrice ? Math.round(((pkg.originalPrice - pkg.price)/pkg.originalPrice)*100) : 0;
  return (
    <div className={`relative rounded-[24px] border-2 p-5 sm:p-6 flex flex-col ${pkg.popular ? 'border-[#4338ca] shadow-xl scale-[1.02] bg-white' : 'border-neutral-200 bg-white'} `}>
      {pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4338ca] text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full flex items-center gap-1"><Crown className="w-3 h-3"/> MOST POPULAR</div>}
      {pkg.badge && !pkg.popular && <span className="absolute -top-2.5 right-4 bg-[#f59e0b] text-black text-[10px] font-black px-2.5 py-1 rounded-full">{pkg.badge}</span>}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background: pkg.color}}><Sparkles className="w-5 h-5 text-white"/></div>
      <h3 className="font-black text-[18px] leading-none tracking-tight">{pkg.name}</h3>
      <p className="text-xs text-neutral-500 mt-1">{pkg.subtitle}</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-[28px] font-black tracking-tighter">₹{pkg.price.toLocaleString('en-IN')}</span>
        {pkg.originalPrice && <span className="text-sm line-through text-neutral-400">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>}
        {discount>0 && <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">-{discount}%</span>}
      </div>
      <div className="text-[11px] font-bold text-neutral-500 mt-1">{pkg.durationMonths} months • EMI from ₹{Math.round(pkg.price/pkg.durationMonths).toLocaleString('en-IN')}/mo</div>
      <ul className="mt-4 space-y-2 flex-1">
        {pkg.features.map(f=>(
          <li key={f} className="flex gap-2 text-[13px] leading-snug"><span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-emerald-600"/></span><span>{f}</span></li>
        ))}
      </ul>
      <button onClick={onBuy} className={`mt-5 w-full h-11 rounded-full font-black text-sm transition ${pkg.popular ? 'bg-[#0f172a] text-white hover:bg-black' : 'bg-white border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white'} ${purchased?'!bg-emerald-600 !border-emerald-600 !text-white':''}`}>
        {purchased ? '✓ Enrolled — Go to My Learning' : 'Enroll now'}
      </button>
      <div className="text-center text-[11px] text-neutral-500 mt-2">30-day refund • UPI / Card / Netbanking</div>
    </div>
  );
}
