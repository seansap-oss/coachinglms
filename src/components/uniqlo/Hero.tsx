'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function Hero(){
  const hero = useUniqloStore(s=>s.hero);
  const heroLayers = useUniqloStore(s=>s.heroLayers);
  const overlay = hero.overlayOpacity ?? 0.3;
  const layers = (heroLayers && heroLayers.length>0 ? heroLayers.filter(l=>l.enabled).sort((a,b)=>a.sortOrder-b.sortOrder) : []).length>0
    ? heroLayers.filter(l=>l.enabled).sort((a,b)=>a.sortOrder-b.sortOrder)
    : (hero.isActive ? [{ id: hero.id, type: hero.type, src: hero.src, poster: hero.poster, duration: 5, enabled:true, sortOrder:1 } as any] : []);

  const [idx, setIdx] = useState(0);
  const timerRef = useRef<any>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const cur = layers[idx % layers.length];

  useEffect(()=>{ if(idx >= layers.length) setIdx(0); }, [layers.length, idx]);

  // Auto-advance for images and video with duration override
  useEffect(()=>{
    if(!cur || layers.length<=1) return;
    if(cur.type==='image'){
      const d = (cur.duration && cur.duration>0 ? cur.duration : 5) * 1000;
      timerRef.current = setTimeout(()=> setIdx(i=> (i+1)%layers.length), d);
      return ()=> clearTimeout(timerRef.current);
    }
    if(cur.type==='video' && cur.duration && cur.duration>0){
      timerRef.current = setTimeout(()=> setIdx(i=> (i+1)%layers.length), cur.duration*1000);
      return ()=> clearTimeout(timerRef.current);
    }
  }, [cur, layers.length, idx]);

  // Play current video when idx changes
  useEffect(()=>{
    if(!cur || cur.type!=='video') return;
    const vid = videoRefs.current[cur.id];
    if(vid){
      vid.currentTime = 0;
      const p = vid.play();
      if(p && typeof (p as any).catch === 'function') (p as any).catch(()=>{});
    }
  }, [idx, cur]);

  // Pause other videos
  useEffect(()=>{
    Object.entries(videoRefs.current).forEach(([id, v])=>{
      if(!v) return;
      if(id !== cur?.id) { try{ v.pause(); }catch{} }
    });
  }, [idx, cur?.id]);

  if(!hero.isActive || layers.length===0) return null;

  const handleVideoEnded = () => {
    if(layers.length>1) setIdx(i=> (i+1)%layers.length);
  };
  const handleVideoError = () => {
    console.warn('Hero video failed to load, skipping', cur?.src?.slice(0,60));
    if(layers.length>1) setTimeout(()=> setIdx(i=> (i+1)%layers.length), 1200);
  };

  return (
    <section className="relative w-full overflow-hidden bg-neutral-100">
      <div className="w-full h-[58vh] sm:h-[64vh] lg:h-[72vh] relative bg-black">
        {layers.map((layer, i)=>(
          <div key={layer.id} className={`absolute inset-0 transition-opacity duration-700 ${i===idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {layer.type==='video' ? (
              <video
                ref={el=>{ videoRefs.current[layer.id]=el; }}
                src={layer.src}
                poster={layer.poster}
                muted
                autoPlay
                playsInline
                preload="auto"
                loop={false}
                controls
                onEnded={handleVideoEnded}
                onError={handleVideoError}
                className="w-full h-full object-cover bg-black"
              />
            ) : (
              <img
                src={layer.src}
                alt={hero.title}
                className="w-full h-full object-cover"
                onError={(e)=>{ (e.target as HTMLImageElement).style.display='none'; }}
              />
            )}
          </div>
        ))}
        {/* Fallback if no layer */}
        {layers.length===0 && <div className="w-full h-full bg-neutral-200" />}
      </div>

      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay})`}} />
      <div className={`absolute inset-0 flex items-center ${hero.alignment==='center' ? 'justify-center text-center' : hero.alignment==='right' ? 'justify-end text-right pr-6 sm:pr-12' : 'justify-start pl-6 sm:pl-12'}`}>
        <div className="max-w-xl p-6 sm:p-8">
          <h1 className="text-white text-[28px] sm:text-[40px] lg:text-[48px] font-black leading-[0.95] tracking-tighter whitespace-pre-line">{hero.title}</h1>
          {hero.subtitle && <p className="text-white/90 text-sm sm:text-base mt-3 font-medium max-w-lg">{hero.subtitle}</p>}
          {hero.ctaLabel && hero.ctaLink && (
            <Link href={hero.ctaLink} className="inline-block mt-5 bg-white text-black px-7 py-3 text-xs font-black tracking-widest hover:bg-black hover:text-white transition">
              {hero.ctaLabel}
            </Link>
          )}
          {layers.length>1 && (
            <div className="flex gap-1.5 mt-4 justify-center lg:justify-start">
              {layers.map((_,i)=>(
                <button key={i} onClick={()=>setIdx(i)} className={`h-1.5 transition-all ${i===idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} aria-label={`Go to slide ${i+1}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
