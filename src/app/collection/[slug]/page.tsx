'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import UniqloHeader from '@/components/uniqlo/Header';
import Ticker from '@/components/uniqlo/Ticker';
import ProductCard from '@/components/uniqlo/ProductCard';
import UniqloFooter from '@/components/uniqlo/Footer';
import { useUniqloStore } from '@/lib/uniqlo/store';

export default function CollectionPage(){
  const params=useParams(); const slug=(params.slug as string) || 'all';
  const sp=useSearchParams(); const q=sp.get('q')?.toLowerCase() || '';
  const products=useUniqloStore(s=>s.products);
  const categories=useUniqloStore(s=>s.categories);
  const [sort,setSort]=useState('featured');
  const [onlyAvailable,setOnlyAvailable]=useState(false);

  const filtered = useMemo(()=>{
    let list=[...products];
    if(slug!=='all'){
      if(['women','men','kids','baby'].includes(slug)){
        list=list.filter(p=> p.gender.toLowerCase()===slug);
      } else {
        // category slug
        list=list.filter(p=> {
          const catSlug = categories.find(c=>c.id===p.categoryId)?.slug;
          return catSlug===slug;
        });
      }
    }
    if(q) list=list.filter(p=> p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    if(onlyAvailable) list=list.filter(p=> p.available && p.inStock);
    if(sort==='price-low') list.sort((a,b)=>a.price-b.price);
    if(sort==='price-high') list.sort((a,b)=>b.price-a.price);
    if(sort==='new') list.sort((a,b)=> Number(b.isNew?1:0)-Number(a.isNew?1:0));
    return list;
  },[products,categories,slug,q,sort,onlyAvailable]);

  const title = slug==='all' ? 'ALL PRODUCTS' : slug.toUpperCase().replace(/-/g,' ');

  return (
    <div className="min-h-screen bg-white">
      <UniqloHeader /><Ticker />
      <div className="max-w-[1420px] mx-auto px-3 sm:px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div>
            <h1 className="text-xl font-black tracking-tighter">{title}</h1>
            <p className="text-xs text-neutral-500">{filtered.length} items • {q && `Search: "${q}"`}</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)} /> In stock only</label>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="border border-neutral-300 px-2 py-1.5">
              <option value="featured">Featured</option>
              <option value="new">New arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filtered.length===0 ? (
          <p className="py-16 text-center text-sm text-neutral-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
            {filtered.map(p=> <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
      <UniqloFooter />
    </div>
  );
}
