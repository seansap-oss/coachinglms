'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import UniqloHeader from '@/components/uniqlo/Header';
import Ticker from '@/components/uniqlo/Ticker';
import Hero from '@/components/uniqlo/Hero';
import ProductCard from '@/components/uniqlo/ProductCard';
import UniqloFooter from '@/components/uniqlo/Footer';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function HomePage(){
  const products = useUniqloStore(s=>s.products);
  const sectionsRaw = useUniqloStore(s=>s.sections);
  const sections = useMemo(() => sectionsRaw.filter(x=>x.isActive).sort((a,b)=>a.sortOrder-b.sortOrder), [sectionsRaw]);
  const newArrivals = products.filter(p=>p.isNew).slice(0,8);
  const featured = products.filter(p=>p.isFeatured).slice(0,8);
  const sale = products.filter(p=> p.compareAtPrice && p.compareAtPrice>p.price).slice(0,8);
  const all = products.slice(0,12);

  return (
    <div className="min-h-screen bg-white">
      <UniqloHeader />
      <Ticker />
      <Hero />

      {/* secondary promo strip */}
      <div className="max-w-[1420px] mx-auto px-3 sm:px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="border border-neutral-200 p-3 flex items-center gap-3 bg-[#fff8e6]"><span className="w-8 h-8 bg-black text-white flex items-center justify-center">◍</span><div><p className="font-black">Click & Collect</p><p className="text-neutral-600">Ready in 2 hours</p></div></div>
        <div className="border border-neutral-200 p-3 flex items-center gap-3 bg-[#eef6ff]"><span className="w-8 h-8 bg-[#e10600] text-white flex items-center justify-center">◎</span><div><p className="font-black">Free Delivery</p><p className="text-neutral-600">Over €99</p></div></div>
        <div className="border border-neutral-200 p-3 flex items-center gap-3 bg-[#effff2]"><span className="w-8 h-8 bg-black text-white flex items-center justify-center">✓</span><div><p className="font-black">Free Returns</p><p className="text-neutral-600">Within 30 days</p></div></div>
      </div>

      <main className="max-w-[1420px] mx-auto px-3 sm:px-4 py-6 space-y-8">
        {/* Featured Categories (sections - editable via admin) */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-[22px] font-black tracking-tighter">FEATURED CATEGORIES</h2>
            <Link href="/collection/all" className="text-xs font-bold border border-neutral-900 px-3 py-1.5 hover:bg-neutral-900 hover:text-white">VIEW ALL</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {sections.map(sec=>(
              <Link key={sec.id} href={sec.link} className="relative h-[280px] overflow-hidden group border border-neutral-200">
                <img src={sec.image} alt={sec.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-white px-3 py-2 text-xs font-black tracking-widest">{sec.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Product rows */}
        {featured.length>0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-3"><h3 className="text-lg font-black">RECOMMENDED FOR YOU</h3><span className="text-xs text-neutral-500">Editors picks</span></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{featured.map(p=> <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}
        {newArrivals.length>0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-3"><h3 className="text-lg font-black">NEW ARRIVALS</h3><span className="text-xs bg-black text-white px-2 py-0.5 font-bold">NEW</span></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{newArrivals.map(p=> <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}
        {sale.length>0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-3"><h3 className="text-lg font-black" style={{ fontFamily: 'var(--font-space-grotesk)' }}>SALE — LIMITED TIME</h3><span className="text-xs bg-[#e10600] text-white px-2 py-0.5 font-bold">UP TO 50% OFF</span></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{sale.map(p=> <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}

        <section>
          <div className="flex items-baseline gap-3 mb-3"><h3 className="text-lg font-black">MORE TO EXPLORE</h3></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{all.map(p=> <ProductCard key={p.id} product={p} />)}</div>
          <div className="text-center mt-6"><Link href="/collection/all" className="inline-block border border-neutral-900 px-10 py-3 text-xs font-black tracking-widest hover:bg-neutral-900 hover:text-white">VIEW MORE</Link></div>
        </section>

        {/* Editorial banner - also editable via admin hero */}
        <section className="grid md:grid-cols-2 gap-3">
          <div className="relative h-[320px] overflow-hidden border border-neutral-200">
            <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1000" alt="Women" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute bottom-6 left-6 text-white"><p className="text-2xl font-black">WOMEN&apos;S NEW SEASON</p><Link href="/collection/women" className="inline-block mt-3 bg-white text-black px-5 py-2 text-xs font-black">SHOP NOW</Link></div>
          </div>
          <div className="relative h-[320px] overflow-hidden border border-neutral-200">
            <img src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1000" alt="Men" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute bottom-6 left-6 text-white"><p className="text-2xl font-black">MEN&apos;S ESSENTIALS</p><Link href="/collection/men" className="inline-block mt-3 bg-white text-black px-5 py-2 text-xs font-black">SHOP NOW</Link></div>
          </div>
        </section>

        {/* App banner */}
        <div className="bg-[#e10600] text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div><p className="font-black text-lg" style={{ fontFamily: 'var(--font-space-grotesk)' }}>PlanetFashion — WEAR YOUR PLANET</p><p className="text-xs text-white/90 mt-1">Pay with UPI • GPay • Card • Download PWA — iOS & Android ready. Generate 10% codes in Admin → Coupons.</p></div>
          <Link href="/admin" className="bg-white text-[#e10600] px-6 py-3 text-xs font-black tracking-widest">GENERATE 10% CODE</Link>
        </div>
      </main>

      <UniqloFooter />

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around py-2 z-40 text-[10px] font-bold">
        <Link href="/" className="flex flex-col items-center text-[#e10600]"><span className="text-base">⌂</span>HOME</Link>
        <Link href="/collection/all" className="flex flex-col items-center text-neutral-600"><span className="text-base">▦</span>SHOP</Link>
        <Link href="/cart" className="flex flex-col items-center text-neutral-600"><span className="text-base">🛒</span>CART</Link>
        <Link href="/wishlist" className="flex flex-col items-center text-neutral-600"><span className="text-base">♡</span>WISHLIST</Link>
        <Link href="/profile" className="flex flex-col items-center text-neutral-600"><span className="text-base">◯</span>YOU</Link>
      </div>
      <div className="lg:hidden h-14" />
    </div>
  );
}
