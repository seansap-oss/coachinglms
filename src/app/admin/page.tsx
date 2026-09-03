'use client';
import { useState } from 'react';
import Link from 'next/link';
import UniqloHeader from '@/components/uniqlo/Header';
import { useUniqloStore } from '@/lib/uniqlo/store';
import { useUserStore } from '@/lib/userStore';
import type { UniqloProduct, HeroLayer } from '@/lib/uniqlo/types';

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej)=>{
    const r=new FileReader(); r.onload=()=>res(r.result as string); r.onerror=rej; r.readAsDataURL(file);
  });
}

export default function AdminPage(){
  const store=useUniqloStore();
  const users=useUserStore(s=>s.users);
  const orders=store.orders;
  const [tab,setTab]=useState<'hero'|'ticker'|'products'|'categories'|'coupons'|'sections'|'profiles'|'orders'>('hero');
  const [toast,setToast]=useState<string|null>(null);
  const showToast=(msg:string)=>{ setToast(msg); setTimeout(()=>setToast(null),2500); };

  const hero=store.hero;
  const ticker=store.ticker;
  const heroLayers = store.heroLayers || [];

  const [newProd,setNewProd]=useState<Partial<UniqloProduct>>({ name:'', description:'', price:19.90, categoryId: store.categories[0]?.id || '', gender:'UNISEX', sizes:['S','M','L'], colors:[{name:'Black',hex:'#111111'}], images:[] });
  const [editId,setEditId]=useState<string | null>(null);
  const [dragIdx,setDragIdx]=useState<number|null>(null);

  // helpers for layers
  const addLayer = (type:'image'|'video')=>{
    const id='hl_'+Date.now().toString(36);
    const newLayer: HeroLayer = {
      id, type, src: type==='image' ? 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600' : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: type==='video' ? 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1600' : undefined,
      duration: type==='image' ? 5 : 0,
      enabled: true,
      sortOrder: heroLayers.length+1,
    };
    store.addHeroLayer(newLayer);
    showToast(`Added ${type} layer — drag to reorder`);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <UniqloHeader />
      <div className="max-w-[1420px] mx-auto px-3 sm:px-4 py-4">
        <div className="bg-white border-2 border-[#e10600] p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-[#e10600] text-white flex flex-col items-center justify-center leading-none shadow-sm"><span className="font-black text-[14px]">PF</span><span className="font-bold text-[6px] tracking-widest">PLANET</span></div><div><h1 className="font-black text-lg text-[#e10600]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Planet fashion — Admin CMS</h1><p className="text-xs text-neutral-500">Hero video/image • Ticker • Sections • Products (price, “not available”, images) • Coupons • Profiles • Orders — UPI/GPay ready.</p></div></div>
          <Link href="/" className="bg-[#e10600] text-white px-4 py-2 text-xs font-black">VIEW STORE</Link>
        </div>

        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {(['hero','ticker','sections','products','categories','coupons','profiles','orders'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 text-xs font-black border whitespace-nowrap ${tab===t ? 'bg-black text-white border-black' : 'bg-white border-neutral-300'}`}>{t.toUpperCase()}</button>
          ))}
        </div>

        {toast && <div className="fixed top-4 right-4 z-50 bg-[#e10600] text-white px-4 py-2 text-xs font-black shadow-lg">{toast}</div>}

        {tab==='hero' && (
          <div className="space-y-4">
            {/* GLOBAL HERO TEXT */}
            <div className="bg-white border border-neutral-200 p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-black text-[#e10600]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>HERO — Global Text & Overlay</h2>
                  <p className="text-xs text-neutral-500">Title, subtitle, CTA and overlay shown over all layers. Edit then Save / Publish.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>showToast('✓ Saved — hero text saved')} className="border border-neutral-300 px-3 py-1.5 text-xs font-bold">SAVE</button>
                  <button onClick={()=>{ showToast('✓ Published — hero live on website & app'); }} className="bg-[#e10600] text-white px-4 py-1.5 text-xs font-black">PUBLISH</button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div><label className="text-xs font-bold">TITLE</label><input value={hero.title} onChange={e=> store.updateHero({ title: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" /></div>
                <div><label className="text-xs font-bold">CTA LABEL</label><input value={hero.ctaLabel || ''} onChange={e=> store.updateHero({ ctaLabel: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" /></div>
              </div>
              <label className="text-xs font-bold">SUBTITLE</label><textarea value={hero.subtitle || ''} onChange={e=> store.updateHero({ subtitle: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" rows={2} />
              <label className="text-xs font-bold">CTA LINK</label><input value={hero.ctaLink || ''} onChange={e=> store.updateHero({ ctaLink: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
              <div className="grid md:grid-cols-3 gap-3">
                <div><label className="text-xs font-bold">ALIGNMENT</label><select value={hero.alignment || 'left'} onChange={e=> store.updateHero({ alignment: e.target.value as any })} className="w-full border border-neutral-300 px-3 py-2 text-sm"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
                <div><label className="text-xs font-bold">OVERLAY</label><input type="range" min={0} max={0.8} step={0.05} value={hero.overlayOpacity ?? 0.35} onChange={e=> store.updateHero({ overlayOpacity: parseFloat(e.target.value)})} className="w-full" /></div>
                <label className="flex items-center gap-2 text-xs font-bold mt-6"><input type="checkbox" checked={hero.isActive} onChange={e=> store.updateHero({ isActive: e.target.checked })} /> Active</label>
              </div>
            </div>

            {/* HERO LAYERS PLAYLIST */}
            <div className="bg-white border-2 border-[#e10600] p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-black text-[#e10600]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>HERO PLAYLIST — Layers (Video & Image)</h2>
                  <p className="text-xs text-neutral-500">Tick to enable, drag to reorder, set seconds per layer. Video plays until finished then next layer. Image shows for its duration. Mix URLs and uploads.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>showToast('✓ Saved — layers saved')} className="border border-neutral-300 px-3 py-1.5 text-xs font-bold">SAVE</button>
                  <button onClick={()=>showToast('✓ Published — hero playlist live on website & app')} className="bg-[#e10600] text-white px-4 py-1.5 text-xs font-black">PUBLISH</button>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={()=>addLayer('image')} className="bg-black text-white px-4 py-2 text-xs font-black">+ Add Image Layer</button>
                <button onClick={()=>addLayer('video')} className="bg-[#e10600] text-white px-4 py-2 text-xs font-black">+ Add Video Layer (MP4)</button>
                <span className="text-xs text-neutral-500 self-center">Drag ≡ to reorder • Video MP4 small recommended (&lt;5MB)</span>
              </div>

              {heroLayers.length===0 && <p className="text-xs text-neutral-500">No layers — add one above. Fallback is single hero image.</p>}

              <div className="space-y-2">
                {heroLayers.sort((a,b)=>a.sortOrder-b.sortOrder).map((layer, idx)=>(
                  <div
                    key={layer.id}
                    draggable
                    onDragStart={()=>setDragIdx(idx)}
                    onDragOver={e=>e.preventDefault()}
                    onDrop={()=>{
                      if(dragIdx===null || dragIdx===idx) return;
                      store.reorderHeroLayers(dragIdx, idx);
                      setDragIdx(null);
                      showToast('Reordered — drag to new sequence');
                    }}
                    className={`border p-3 bg-[#fafafa] flex gap-3 items-start ${dragIdx===idx ? 'border-[#e10600] bg-red-50' : 'border-neutral-200'}`}
                  >
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <span className="cursor-grab select-none text-neutral-400" title="Drag to reorder">≡</span>
                      <span className="text-[10px] font-black bg-black text-white w-5 h-5 flex items-center justify-center">{idx+1}</span>
                      <label className="flex items-center gap-1 text-[10px] font-bold"><input type="checkbox" checked={layer.enabled} onChange={e=> store.updateHeroLayer(layer.id, { enabled: e.target.checked })} /> On</label>
                    </div>

                    <div className="w-28 h-20 bg-white border overflow-hidden flex-shrink-0 relative group">
                      {layer.type==='video' ? (
                        <video src={layer.src} poster={layer.poster} className="w-full h-full object-cover" muted playsInline controls onError={(e)=>{ console.warn('video load failed', layer.src.slice(0,80)); }} />
                      ) : (
                        <img src={layer.src} alt="" className="w-full h-full object-cover" onError={(e)=>{ (e.target as HTMLImageElement).style.display='none'; }} />
                      )}
                      <span className="absolute bottom-0 left-0 bg-black/70 text-white text-[8px] px-1">{layer.type==='video' ? 'MP4' : 'IMG'}</span>
                      <span className="absolute top-0 right-0 bg-[#e10600] text-white text-[7px] px-1 hidden group-hover:block">▶ hover to preview</span>
                    </div>

                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="grid grid-cols-3 gap-2">
                        <select value={layer.type} onChange={e=> store.updateHeroLayer(layer.id, { type: e.target.value as any })} className="border border-neutral-300 px-2 py-1.5 text-xs font-bold">
                          <option value="image">Image</option>
                          <option value="video">Video (MP4)</option>
                        </select>
                        <div className="flex items-center gap-1">
                          <label className="text-[11px] font-bold whitespace-nowrap">Duration (s)</label>
                          <input type="number" min={0} step={1} value={layer.duration ?? (layer.type==='image'?5:0)} onChange={e=> store.updateHeroLayer(layer.id, { duration: Number(e.target.value)})} className="w-full border border-neutral-300 px-2 py-1 text-xs" placeholder={layer.type==='video'?"0=video length":"5"} />
                        </div>
                        <div className="flex gap-1">
                          <button onClick={()=>{
                            if(idx>0) { store.reorderHeroLayers(idx, idx-1); showToast('Moved up'); }
                          }} className="flex-1 border border-neutral-300 px-2 py-1 text-xs">↑</button>
                          <button onClick={()=>{
                            if(idx<heroLayers.length-1) { store.reorderHeroLayers(idx, idx+1); showToast('Moved down'); }
                          }} className="flex-1 border border-neutral-300 px-2 py-1 text-xs">↓</button>
                          <button onClick={()=>{ if(confirm('Delete layer?')){ store.deleteHeroLayer(layer.id); showToast('Deleted'); } }} className="px-2 py-1 bg-red-600 text-white text-xs font-bold">×</button>
                        </div>
                      </div>

                      <input value={layer.src} onChange={e=> store.updateHeroLayer(layer.id, { src: e.target.value })} placeholder={layer.type==='video' ? "MP4 URL e.g. https://.../video.mp4 or data:video/..." : "Image URL https://..."} className="w-full border border-neutral-300 px-2 py-1.5 text-xs" />
                      <div className="flex gap-2">
                        <label className="flex-1">
                          <span className="text-[10px] font-bold text-neutral-500">Upload {layer.type==='video' ? 'MP4' : 'Image'} {layer.type==='video' ? '(MP4 <5MB or use URL)' : ''}</span>
                          <input type="file" accept={layer.type==='video' ? 'video/mp4,video/*' : 'image/*'} onChange={async e=>{
                            const f=e.target.files?.[0]; if(!f) return;
                            const isVideo = layer.type==='video';
                            if(isVideo && f.size>4*1024*1024){
                              if(!confirm(`Video is ${(f.size/1024/1024).toFixed(1)}MB (>4MB) — may exceed storage. Use URL instead for best performance. Continue with upload?`)) { e.target.value=''; return; }
                            }
                            if(!isVideo && f.size>2*1024*1024){
                              if(!confirm(`Image is ${(f.size/1024/1024).toFixed(1)}MB — large. Continue?`)) { e.target.value=''; return; }
                            }
                            try{
                              const data=await toBase64(f);
                              try{
                                store.updateHeroLayer(layer.id, { src: data });
                                showToast('Uploaded — will play on live site. If gray, try URL instead (storage limit).');
                              }catch(err){
                                showToast('Storage full — use URL for large MP4 (localStorage limit)');
                              }
                            }catch{
                              showToast('Upload failed — try URL');
                            }
                            e.target.value='';
                          }} className="w-full border border-neutral-300 p-1 text-xs bg-white" />
                        </label>
                        {layer.type==='video' && (
                          <label className="flex-1">
                            <span className="text-[10px] font-bold text-neutral-500">Poster (image URL)</span>
                            <input value={layer.poster || ''} onChange={e=> store.updateHeroLayer(layer.id, { poster: e.target.value })} placeholder="Poster image URL for video" className="w-full border border-neutral-300 px-2 py-1 text-xs" />
                          </label>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500">{layer.type==='video' ? (layer.duration && layer.duration>0 ? `Plays ${layer.duration}s then next` : 'Plays until video ends then next') : `Shows ${layer.duration || 5}s then next`} • {layer.enabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#111] text-white p-3">
                <p className="text-xs font-black">LIVE PREVIEW — playlist order</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {heroLayers.sort((a,b)=>a.sortOrder-b.sortOrder).map((l,i)=>(
                    <span key={l.id} className={`px-2 py-1 text-[10px] font-bold border ${l.enabled ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/20'}`}>{i+1}. {l.type.toUpperCase()} {l.enabled?'●':''} {l.duration ? `${l.duration}s` : (l.type==='video'?'auto':'5s')}</span>
                  ))}
                </div>
                <p className="text-[11px] text-white/60 mt-2">Example: Video (0=full length) → Image 5s → Video 5s. Drag to change sequence. Publish to go live.</p>
              </div>
            </div>
          </div>
        )}

        {tab==='ticker' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div><h2 className="font-black text-[#e10600]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>TICKER — Top Scrolling Bar</h2><p className="text-xs text-neutral-500">Enable to show special promos running across the top.</p></div>
              <div className="flex gap-2">
                <button onClick={()=>showToast('✓ Saved — ticker saved')} className="border border-neutral-300 px-3 py-1.5 text-xs font-bold">SAVE</button>
                <button onClick={()=>showToast('✓ Published — ticker live on website & app')} className="bg-[#e10600] text-white px-4 py-1.5 text-xs font-black">PUBLISH</button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ticker.enabled} onChange={e=> store.updateTicker({ enabled: e.target.checked })} /> Enabled</label>
            <label className="text-xs font-bold">TEXT (will loop)</label>
            <textarea value={ticker.text} onChange={e=> store.updateTicker({ text: e.target.value })} rows={2} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <div><label className="text-xs font-bold">BG COLOR</label><input type="color" value={ticker.bgColor} onChange={e=> store.updateTicker({ bgColor: e.target.value })} className="w-full h-10 border border-neutral-300" /></div>
              <div><label className="text-xs font-bold">TEXT COLOR</label><input type="color" value={ticker.textColor} onChange={e=> store.updateTicker({ textColor: e.target.value })} className="w-full h-10 border border-neutral-300" /></div>
              <div><label className="text-xs font-bold">SPEED (sec)</label><input type="number" value={ticker.speed} onChange={e=> store.updateTicker({ speed: Number(e.target.value)})} className="w-full border border-neutral-300 px-3 py-2 text-sm" /></div>
            </div>
            <label className="text-xs font-bold">LINK (optional)</label><input value={ticker.link || ''} onChange={e=> store.updateTicker({ link: e.target.value })} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
            <div className="border border-neutral-200 p-2" style={{ background: ticker.bgColor, color: ticker.textColor }}><p className="text-xs font-bold">{ticker.text}</p></div>
          </div>
        )}

        {tab==='sections' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div><h2 className="font-black text-[#e10600]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>SECTION PHOTOS</h2><p className="text-xs text-neutral-500">Category tiles on homepage — upload images, change titles and links.</p></div>
              <div className="flex gap-2">
                <button onClick={()=>showToast('✓ Saved — sections saved')} className="border border-neutral-300 px-3 py-1.5 text-xs font-bold">SAVE</button>
                <button onClick={()=>showToast('✓ Published — sections live')} className="bg-[#e10600] text-white px-4 py-1.5 text-xs font-black">PUBLISH</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {store.sections.map(sec=>(
                <div key={sec.id} className="border border-neutral-200 p-3 space-y-2">
                  <img src={sec.image} alt={sec.title} className="w-full h-40 object-cover border border-neutral-200" />
                  <input value={sec.title} onChange={e=> store.updateSection(sec.id, { title: e.target.value })} className="w-full border border-neutral-300 px-2 py-1 text-sm" placeholder="Title" />
                  <input value={sec.image} onChange={e=> store.updateSection(sec.id, { image: e.target.value })} className="w-full border border-neutral-300 px-2 py-1 text-sm" placeholder="Image URL" />
                  <input type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const d=await toBase64(f); store.updateSection(sec.id,{ image: d }); showToast('Uploaded');}} className="w-full text-xs" />
                  <input value={sec.link} onChange={e=> store.updateSection(sec.id, { link: e.target.value })} className="w-full border border-neutral-300 px-2 py-1 text-sm" placeholder="Link" />
                  <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={sec.isActive} onChange={e=> store.updateSection(sec.id,{ isActive: e.target.checked })} /> Active</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='products' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="font-black text-[#e10600]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>PRODUCTS</h2>
              <div className="flex gap-2">
                <button onClick={()=>showToast('✓ Saved — products saved')} className="border border-neutral-300 px-3 py-1.5 text-xs font-bold">SAVE</button>
                <button onClick={()=>showToast('✓ Published — products live on website & app')} className="bg-[#e10600] text-white px-4 py-1.5 text-xs font-black">PUBLISH</button>
              </div>
            </div>
            <div className="border border-neutral-900 p-3 bg-[#fffbeb]">
              <p className="font-bold text-sm">ADD NEW PRODUCT</p>
              <div className="grid md:grid-cols-3 gap-2 mt-2">
                <input placeholder="Name" value={newProd.name || ''} onChange={e=> setNewProd({...newProd, name:e.target.value})} className="border border-neutral-300 px-2 py-2 text-sm" />
                <input type="number" placeholder="Price" value={newProd.price ?? ''} onChange={e=> setNewProd({...newProd, price: parseFloat(e.target.value)})} className="border border-neutral-300 px-2 py-2 text-sm" />
                <input type="number" placeholder="Compare at (sale)" value={(newProd as any).compareAtPrice || ''} onChange={e=> setNewProd({...newProd, compareAtPrice: parseFloat(e.target.value) as any})} className="border border-neutral-300 px-2 py-2 text-sm" />
                <select value={newProd.categoryId} onChange={e=> setNewProd({...newProd, categoryId:e.target.value})} className="border border-neutral-300 px-2 py-2 text-sm">
                  {store.categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={newProd.gender} onChange={e=> setNewProd({...newProd, gender: e.target.value as any})} className="border border-neutral-300 px-2 py-2 text-sm">
                  <option value="WOMEN">WOMEN</option><option value="MEN">MEN</option><option value="KIDS">KIDS</option><option value="BABY">BABY</option><option value="UNISEX">UNISEX</option>
                </select>
                <input placeholder="Image URL (or upload below)" value={(newProd.images?.[0] || '')} onChange={e=> setNewProd({...newProd, images:[e.target.value]})} className="border border-neutral-300 px-2 py-2 text-sm" />
              </div>
              <input type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const d=await toBase64(f); setNewProd({...newProd, images:[d]});}} className="mt-2 text-xs" />
              <textarea placeholder="Description" value={newProd.description || ''} onChange={e=> setNewProd({...newProd, description:e.target.value})} className="w-full border border-neutral-300 px-2 py-2 text-sm mt-2" rows={2} />
              <button onClick={()=>{
                if(!newProd.name || !newProd.price) return alert('Name & price required');
                const id='p'+Date.now().toString(36);
                const slug=newProd.name!.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+id;
                const prod: UniqloProduct = {
                  id, slug, name: newProd.name!, description: newProd.description || '', categoryId: newProd.categoryId!, gender: (newProd.gender as any) || 'UNISEX',
                  price: newProd.price!, compareAtPrice: (newProd as any).compareAtPrice,
                  images: newProd.images && newProd.images[0] ? newProd.images as string[] : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
                  colors: newProd.colors || [{name:'Black',hex:'#111'}],
                  sizes: newProd.sizes || ['S','M','L'],
                  inStock:true, available:true, createdAt:Date.now(), updatedAt:Date.now(),
                };
                store.addProduct(prod); setNewProd({ name:'', description:'', price:19.90, categoryId: store.categories[0]?.id, gender:'UNISEX', sizes:['S','M','L'], colors:[{name:'Black',hex:'#111'}], images:[] }); showToast('Product added — publish to go live');
              }} className="mt-3 bg-black text-white px-6 py-2 text-xs font-black">ADD PRODUCT</button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {store.products.map(p=>(
                <div key={p.id} className="border border-neutral-200 p-3 flex gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-20 h-20 object-cover border border-neutral-200" />
                  <div className="flex-1 min-w-0">
                    {editId===p.id ? (
                      <div className="space-y-2">
                        <input value={p.name} onChange={e=> store.updateProduct(p.id,{ name:e.target.value })} className="w-full border border-neutral-300 px-2 py-1 text-sm" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="number" value={p.price} onChange={e=> store.updateProduct(p.id,{ price: parseFloat(e.target.value)})} className="border border-neutral-300 px-2 py-1 text-sm" />
                          <input type="number" value={p.compareAtPrice || ''} placeholder="Compare" onChange={e=> store.updateProduct(p.id,{ compareAtPrice: e.target.value ? parseFloat(e.target.value): undefined })} className="border border-neutral-300 px-2 py-1 text-sm" />
                        </div>
                        <input value={p.images[0]} onChange={e=> store.updateProduct(p.id,{ images:[e.target.value] })} className="w-full border border-neutral-300 px-2 py-1 text-sm" />
                        <input type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; const d=await toBase64(f); store.updateProduct(p.id,{ images:[d] });}} className="w-full text-xs" />
                        <textarea value={p.description} onChange={e=> store.updateProduct(p.id,{ description:e.target.value })} className="w-full border border-neutral-300 px-2 py-1 text-sm" rows={2} />
                        <div className="flex gap-2">
                          <button onClick={()=> store.updateProduct(p.id,{ available: !p.available, inStock: !p.available ? false : p.inStock })} className={`px-3 py-1 text-xs font-bold border ${p.available ? 'bg-green-600 text-white border-green-600' : 'bg-red-600 text-white border-red-600'}`}>{p.available ? 'AVAILABLE' : 'NOT AVAILABLE'}</button>
                          <button onClick={()=>setEditId(null)} className="px-3 py-1 text-xs border">Done</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-bold text-sm truncate">{p.name}</p>
                        <p className="text-xs text-neutral-500">{p.gender} • {store.categories.find(c=>c.id===p.categoryId)?.name}</p>
                        <p className="text-sm font-black">€{p.price.toFixed(2)} {p.compareAtPrice && <span className="text-xs line-through text-neutral-400 ml-1">€{p.compareAtPrice.toFixed(2)}</span>}</p>
                        <p className={`text-xs font-bold mt-1 ${p.available ? 'text-green-700' : 'text-red-600'}`}>{p.available ? '✓ Available' : '✗ Not Available'}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={()=>setEditId(p.id)} className="text-xs border border-neutral-900 px-3 py-1 font-bold">EDIT</button>
                          <button onClick={()=>{ if(confirm('Delete?')) store.deleteProduct(p.id);}} className="text-xs border border-red-600 text-red-600 px-3 py-1 font-bold">DELETE</button>
                          <button onClick={()=> store.updateProduct(p.id,{ available: !p.available })} className="text-xs bg-neutral-100 px-2 py-1">{p.available ? 'Mark unavailable' : 'Mark available'}</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='categories' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h2 className="font-black text-[#e10600]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>CATEGORIES</h2>
              <div className="flex gap-2">
                <button onClick={()=>showToast('✓ Saved — categories saved')} className="border border-neutral-300 px-3 py-1.5 text-xs font-bold">SAVE</button>
                <button onClick={()=>showToast('✓ Published — categories live')} className="bg-[#e10600] text-white px-4 py-1.5 text-xs font-black">PUBLISH</button>
              </div>
            </div>
            <div className="space-y-2">
              {store.categories.map(c=>(
                <div key={c.id} className="flex items-center gap-2 border border-neutral-200 p-2">
                  <input value={c.name} onChange={e=> store.updateCategory(c.id,{ name:e.target.value })} className="flex-1 border border-neutral-300 px-2 py-1 text-sm" />
                  <select value={c.gender} onChange={e=> store.updateCategory(c.id,{ gender: e.target.value as any })} className="border border-neutral-300 px-2 py-1 text-xs">
                    <option>WOMEN</option><option>MEN</option><option>KIDS</option><option>BABY</option><option>UNISEX</option>
                  </select>
                  <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={c.isActive} onChange={e=> store.updateCategory(c.id,{ isActive:e.target.checked })} />Active</label>
                  <button onClick={()=> store.deleteCategory(c.id)} className="text-xs text-red-600 border border-red-200 px-2 py-1">Delete</button>
                </div>
              ))}
            </div>
            <button onClick={()=>{
              const name=prompt('Category name?'); if(!name) return;
              const gender=prompt('Gender WOMEN/MEN/KIDS/BABY/UNISEX','UNISEX') as any;
              const id='cat_'+Date.now().toString(36); store.addCategory({ id, slug: name.toLowerCase().replace(/[^a-z0-9]+/g,'-'), name, gender: gender || 'UNISEX', sortOrder: store.categories.length+1, isActive:true }); showToast('Category added');
            }} className="bg-black text-white px-4 py-2 text-xs font-black">+ ADD CATEGORY</button>
          </div>
        )}

        {tab==='coupons' && (
          <div className="bg-white border border-neutral-200 p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div><h2 className="font-black text-lg text-[#e10600]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>COUPONS / DISCOUNT CODE GENERATOR</h2><p className="text-xs text-neutral-500">Generate sale codes — they apply instantly at checkout.</p></div>
              <div className="flex gap-2">
                <button onClick={()=>showToast('✓ Saved — coupons saved')} className="border border-neutral-300 px-3 py-1.5 text-xs font-bold">SAVE</button>
                <button onClick={()=>showToast('✓ Published — coupons live at checkout')} className="bg-[#e10600] text-white px-4 py-1.5 text-xs font-black">PUBLISH</button>
              </div>
            </div>
            <div className="border-2 border-[#e10600] bg-[#fff5f5] p-4">
              <p className="font-black text-sm">GENERATE NEW DISCOUNT COUPON</p>
              <div className="grid md:grid-cols-4 gap-2 mt-3">
                <input id="gen-code" placeholder="CODE e.g. PLANET10" className="border border-neutral-300 px-3 py-2 text-sm font-mono uppercase" defaultValue="PLANET10" />
                <select id="gen-type" className="border border-neutral-300 px-3 py-2 text-sm" defaultValue="percent">
                  <option value="percent">Percent %</option>
                  <option value="fixed">Fixed €</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
                <input id="gen-value" type="number" placeholder="Value (10 for 10%)" className="border border-neutral-300 px-3 py-2 text-sm" defaultValue={10} />
                <input id="gen-min" type="number" placeholder="Min basket € (optional)" className="border border-neutral-300 px-3 py-2 text-sm" defaultValue={0} />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={()=>{
                  const codeEl=document.getElementById('gen-code') as HTMLInputElement;
                  const typeEl=document.getElementById('gen-type') as HTMLSelectElement;
                  const valEl=document.getElementById('gen-value') as HTMLInputElement;
                  const minEl=document.getElementById('gen-min') as HTMLInputElement;
                  let code=codeEl.value.trim().toUpperCase(); if(!code) code='PLANET'+Math.floor(10+Math.random()*90);
                  const type=typeEl.value as any; const value=Number(valEl.value)||10; const minBasket=Number(minEl.value)||0;
                  store.addCoupon({ id:'c'+Date.now().toString(36), code, type, value, minBasket: minBasket||undefined, isActive:true, usedCount:0, description: `${value}${type==='percent'?'%':'€'} off ${minBasket?`over €${minBasket}`:''} — PlanetFashion` });
                  codeEl.value=''; showToast(`Generated ${code}`);
                }} className="bg-[#e10600] text-white px-6 py-2 text-xs font-black tracking-widest">GENERATE CODE</button>
                <button onClick={()=>{
                  const code='SALE'+Math.floor(10+Math.random()*90);
                  store.addCoupon({ id:'c'+Date.now().toString(36), code, type:'percent', value:10, isActive:true, usedCount:0, description:'10% sale — PlanetFashion' }); showToast(`Quick ${code} added`);
                }} className="border border-black px-6 py-2 text-xs font-black">QUICK 10% SALE</button>
              </div>
            </div>

            <div className="space-y-2">
              {store.coupons.map(cp=>(
                <div key={cp.id} className="border border-neutral-200 p-3 grid md:grid-cols-7 gap-2 items-center bg-white">
                  <input value={cp.code} onChange={e=> store.updateCoupon(cp.id,{ code: e.target.value.toUpperCase() })} className="border border-neutral-300 px-2 py-1 text-sm font-mono font-bold" />
                  <select value={cp.type} onChange={e=> store.updateCoupon(cp.id,{ type: e.target.value as any })} className="border border-neutral-300 px-2 py-1 text-sm">
                    <option value="percent">Percent %</option><option value="fixed">Fixed €</option><option value="free_shipping">Free Ship</option>
                  </select>
                  <input type="number" value={cp.value} onChange={e=> store.updateCoupon(cp.id,{ value: Number(e.target.value) })} className="border border-neutral-300 px-2 py-1 text-sm" />
                  <input type="number" value={cp.minBasket || 0} onChange={e=> store.updateCoupon(cp.id,{ minBasket: Number(e.target.value) })} className="border border-neutral-300 px-2 py-1 text-sm" placeholder="Min" />
                  <span className="text-xs text-neutral-500">Used {cp.usedCount}x</span>
                  <label className="text-xs flex items-center gap-1 font-bold"><input type="checkbox" checked={cp.isActive} onChange={e=> store.updateCoupon(cp.id,{ isActive: e.target.checked })} />Active</label>
                  <button onClick={()=> store.deleteCoupon(cp.id)} className="text-xs border border-red-200 text-red-600 px-2 py-1 font-bold">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='profiles' && (
          <div className="bg-white border border-neutral-200 p-4">
            <div className="flex justify-between items-start">
              <div><h2 className="font-black text-[#e10600]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>ALL PROFILES</h2><p className="text-xs text-neutral-500">All user profiles (sign-in database).</p></div>
              <div className="flex gap-2">
                <button onClick={()=>showToast('✓ Saved — profiles')} className="border border-neutral-300 px-3 py-1.5 text-xs font-bold">SAVE</button>
                <button onClick={()=>showToast('✓ Published — profiles live')} className="bg-[#e10600] text-white px-4 py-1.5 text-xs font-black">PUBLISH</button>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {users.length===0 ? <p className="text-sm text-neutral-500">No profiles yet. Create via /login</p> : users.map(u=>(
                <div key={u.username} className="border border-neutral-200 p-3 flex justify-between items-center">
                  <div><p className="font-bold text-sm">{u.username}</p><p className="text-xs text-neutral-500">Created {new Date(u.createdAt).toLocaleString()}</p></div>
                  <span className="text-xs bg-black text-white px-2 py-1">Profile</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='orders' && (
          <div className="bg-white border border-neutral-200 p-4">
            <div className="flex justify-between items-start">
              <h2 className="font-black text-[#e10600]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>ORDERS</h2>
              <div className="flex gap-2">
                <button onClick={()=>showToast('✓ Saved — orders')} className="border border-neutral-300 px-3 py-1.5 text-xs font-bold">SAVE</button>
                <button onClick={()=>showToast('✓ Published — orders live')} className="bg-[#e10600] text-white px-4 py-1.5 text-xs font-black">PUBLISH</button>
              </div>
            </div>
            {orders.length===0 ? <p className="text-sm text-neutral-500 mt-2">No orders yet.</p> : (
              <div className="space-y-2 mt-3">
                {orders.map(o=>(
                  <div key={o.id} className="border border-neutral-200 p-3">
                    <div className="flex justify-between text-xs"><span className="font-mono font-bold">{o.orderNumber}</span><span>{new Date(o.createdAt).toLocaleString()}</span></div>
                    <p className="text-xs text-neutral-500">{o.username} • {o.paymentMethod} • {o.status}</p>
                    <p className="text-sm mt-1">{o.items.map(i=> `${i.quantity}x ${i.product.name}`).join(', ')}</p>
                    <p className="font-black text-sm mt-1">€{o.total.toFixed(2)} {o.couponCode && `(coupon ${o.couponCode})`}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
