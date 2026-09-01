'use client';
import Link from 'next/link';
import { useState } from 'react';
import UniqloHeader from '@/components/uniqlo/Header';
import Ticker from '@/components/uniqlo/Ticker';
import UniqloFooter from '@/components/uniqlo/Footer';
import { useUniqloStore, calcCartTotals } from '@/lib/uniqlo/store';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartPage(){
  const cart=useUniqloStore(s=>s.cart);
  const updateQty=useUniqloStore(s=>s.updateQty);
  const remove=useUniqloStore(s=>s.removeFromCart);
  const clear=useUniqloStore(s=>s.clearCart);
  const coupons=useUniqloStore(s=>s.coupons);
  const [code,setCode]=useState('');
  const [applied,setApplied]=useState<string|undefined>(undefined);
  const [msg,setMsg]=useState('');

  const totals = calcCartTotals(cart, coupons, applied);

  const apply=()=>{
    const found = coupons.find(c=> c.code.toUpperCase()===code.toUpperCase() && c.isActive);
    if(!found){ setMsg('Invalid coupon — generate in Admin → Coupons'); return; }
    const chk = calcCartTotals(cart, coupons, code);
    if(found.type!=='free_shipping' && chk.discount===0 && !chk.freeShipping){ setMsg('Requirements not met (min basket?)'); return; }
    setApplied(code.toUpperCase()); setMsg('Coupon applied: '+code.toUpperCase()+' — see checkout to pay via UPI/GPay');
  };

  if(cart.length===0){
    return <div className="min-h-screen bg-white"><UniqloHeader /><Ticker /><div className="max-w-[1420px] mx-auto px-4 py-16 text-center"><p className="text-xl font-black" style={{ fontFamily: 'var(--font-space-grotesk)' }}>YOUR CART IS EMPTY</p><p className="text-sm text-neutral-500 mt-2">PlanetFashion — add favorites, pay with UPI / GPay / Card.</p><Link href="/collection/all" className="inline-block mt-6 bg-[#e10600] text-white px-8 py-3 text-xs font-black">CONTINUE SHOPPING</Link></div><UniqloFooter /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <UniqloHeader /><Ticker />
      <div className="max-w-[1420px] mx-auto px-3 sm:px-4 py-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-3"><h1 className="font-black" style={{ fontFamily: 'var(--font-space-grotesk)' }}>SHOPPING CART ({cart.length}) • PlanetFashion</h1><button onClick={clear} className="text-xs underline">Clear all</button></div>
          <div className="space-y-3">
            {cart.map(item=>(
              <div key={item.product.id+item.size+item.color} className="bg-white border border-neutral-200 p-3 flex gap-3">
                <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-32 object-cover bg-neutral-50 border border-neutral-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">{item.product.gender} • PF</p>
                      <Link href={`/product/${item.product.id}`} className="font-bold text-sm leading-tight hover:underline">{item.product.name}</Link>
                      <p className="text-xs text-neutral-500 mt-1">Size: {item.size} • Color: {item.color}</p>
                      {!item.product.available && <span className="inline-block mt-1 bg-[#e10600] text-white text-[10px] px-2 py-0.5 font-bold">NOT AVAILABLE</span>}
                    </div>
                    <button onClick={()=>remove(item.product.id,item.size,item.color)} className="p-1 text-neutral-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-neutral-300">
                      <button onClick={()=>updateQty(item.product.id, item.quantity-1, item.size, item.color)} className="w-8 h-8 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={()=>updateQty(item.product.id, item.quantity+1, item.size, item.color)} className="w-8 h-8 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="font-black">€{(item.product.price*item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-4 h-fit sticky top-[80px]">
          <h3 className="font-black text-sm" style={{ fontFamily: 'var(--font-space-grotesk)' }}>ORDER SUMMARY</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>€{totals.subtotal.toFixed(2)}</span></div>
            {totals.savings>0 && <div className="flex justify-between text-[#e10600]"><span>You save</span><span>−€{totals.savings.toFixed(2)}</span></div>}
            {totals.discount>0 && <div className="flex justify-between text-green-700 font-bold"><span>Coupon ({applied})</span><span>−€{totals.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-neutral-600">Shipping</span><span>{totals.shipping===0 ? 'FREE' : `€${totals.shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Tax (10%)</span><span>€{totals.tax.toFixed(2)}</span></div>
            <div className="flex gap-2 py-2">
              <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Discount code" className="flex-1 border border-neutral-300 px-3 py-2 text-sm uppercase font-mono" />
              <button onClick={apply} className="bg-black text-white px-4 py-2 text-xs font-black">APPLY</button>
            </div>
            {msg && <p className={`text-xs font-bold ${msg.includes('applied') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
            <p className="text-xs text-neutral-500">Generate 10% codes in <Link href="/admin" className="underline font-bold">Admin → Coupons</Link> • Then pay via UPI / GPay at checkout.</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {coupons.filter(c=>c.isActive).slice(0,4).map(c=>(
                <button key={c.id} onClick={()=>setCode(c.code)} className="text-[11px] border border-dashed px-2 py-1 hover:border-black">{c.code}</button>
              ))}
            </div>
            <div className="flex justify-between font-black text-lg border-t border-neutral-200 pt-2" style={{ fontFamily: 'var(--font-space-grotesk)' }}><span>TOTAL</span><span>€{totals.total.toFixed(2)}</span></div>
          </div>
          <Link href="/checkout" className="block w-full bg-[#e10600] hover:bg-[#b80500] text-white text-center py-3.5 text-xs font-black tracking-[0.12em] mt-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>PROCEED TO CHECKOUT • UPI / GPay</Link>
          <Link href="/collection/all" className="block text-center text-xs underline mt-2">Continue shopping</Link>
          <p className="text-[11px] text-neutral-500 mt-3 text-center">PlanetFashion • Pay with UPI • GPay • Card</p>
        </div>
      </div>
      <UniqloFooter />
    </div>
  );
}
