'use client';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import UniqloHeader from '@/components/uniqlo/Header';
import Ticker from '@/components/uniqlo/Ticker';
import UniqloFooter from '@/components/uniqlo/Footer';
import { useUniqloStore } from '@/lib/uniqlo/store';
import { Heart, Truck, RefreshCw } from 'lucide-react';

export default function ProductPage(){
  const params=useParams(); const id=params.id as string;
  const products = useUniqloStore(s=>s.products);
  const product = useMemo(() => products.find(p=>p.id===id), [products, id]);
  const addToCart = useUniqloStore(s=>s.addToCart);
  const wishlist = useUniqloStore(s=>s.wishlist);
  const toggleWishlist=useUniqloStore(s=>s.toggleWishlist);
  const [activeImg,setActiveImg]=useState(0);
  const [selSize,setSelSize]=useState<string | undefined>(undefined);
  const [selColor,setSelColor]=useState<string | undefined>(undefined);
  const [qty,setQty]=useState(1);

  if(!product){
    return <div className="min-h-screen bg-white"><UniqloHeader /><div className="max-w-[1420px] mx-auto px-4 py-12">Product not found. <Link href="/" className="underline">Go home</Link></div></div>;
  }
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice>product.price;
  const isWish = wishlist.includes(product.id);

  return (
    <div className="min-h-screen bg-white">
      <UniqloHeader /><Ticker />
      <div className="max-w-[1420px] mx-auto px-3 sm:px-4 py-4">
        <div className="text-xs text-neutral-500 mb-3"><Link href="/" className="hover:underline">Home</Link> / <Link href={`/collection/${product.gender.toLowerCase()}`} className="hover:underline">{product.gender}</Link> / <span className="text-black font-medium">{product.name}</span></div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="aspect-[3/4] bg-neutral-50 border border-neutral-200 overflow-hidden">
              <img src={product.images[activeImg] || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.images.map((img,i)=>(
                <button key={i} onClick={()=>setActiveImg(i)} className={`w-20 h-20 border flex-shrink-0 overflow-hidden ${i===activeImg?'border-black':'border-neutral-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="lg:pl-6">
            <h1 className="text-[22px] font-bold leading-tight">{product.name}</h1>
            <p className="text-sm text-neutral-600 mt-2">{product.description}</p>
            <div className="flex items-baseline gap-3 mt-4">
              <span className={`text-xl font-black ${hasDiscount?'text-[#ff0000]':''}`}>€{product.price.toFixed(2)}</span>
              {hasDiscount && <span className="text-sm text-neutral-400 line-through">€{product.compareAtPrice!.toFixed(2)}</span>}
              {hasDiscount && <span className="text-xs bg-[#ff0000] text-white px-2 py-1 font-bold">SAVE €{(product.compareAtPrice! - product.price).toFixed(2)}</span>}
            </div>
            <div className="text-xs text-neutral-500 mt-1">★ {product.rating} ({product.reviewCount} reviews) • SKU: {product.id}</div>

            {!product.available || !product.inStock ? (
              <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm"><p className="font-bold text-red-700">Currently not available</p><p className="text-neutral-600 text-xs mt-1">This item is temporarily out of stock. Check back soon or contact support.</p></div>
            ) : null}

            {/* color */}
            <div className="mt-6">
              <p className="text-xs font-bold tracking-widest">COLOR: <span className="font-normal">{selColor || product.colors[0]?.name}</span></p>
              <div className="flex gap-2 mt-2">
                {product.colors.map(c=>(
                  <button key={c.name} onClick={()=>setSelColor(c.name)} className={`w-8 h-8 rounded-full border-2 ${selColor===c.name || (!selColor && c.name===product.colors[0]?.name) ? 'border-black' : 'border-neutral-200'}`} style={{ background:c.hex }} title={c.name} />
                ))}
              </div>
            </div>
            {/* size */}
            <div className="mt-5">
              <p className="text-xs font-bold tracking-widest">SIZE</p>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {product.sizes.map(s=>(
                  <button key={s} onClick={()=>setSelSize(s)} className={`border py-2 text-xs font-bold ${selSize===s ? 'bg-black text-white border-black' : 'border-neutral-300 hover:border-black'}`}>{s}</button>
                ))}
              </div>
              <Link href="#" className="text-xs underline mt-2 inline-block">Size guide</Link>
            </div>

            {/* qty + add */}
            <div className="mt-6 flex gap-3">
              <div className="flex items-center border border-neutral-300">
                <button onClick={()=>setQty(Math.max(1, qty-1))} className="px-3 py-3 text-sm">−</button>
                <span className="px-4 text-sm font-bold w-10 text-center">{qty}</span>
                <button onClick={()=>setQty(qty+1)} className="px-3 py-3 text-sm">+</button>
              </div>
              <button
                onClick={()=>{
                  if(!selSize) setSelSize(product.sizes[0]);
                  if(!selColor) setSelColor(product.colors[0]?.name);
                  addToCart(product, qty, selSize || product.sizes[0], selColor || product.colors[0]?.name);
                  alert('Added to cart');
                }}
                disabled={!product.available || !product.inStock}
                className="flex-1 bg-[#ff0000] hover:bg-[#cc0000] text-white font-black tracking-widest text-xs py-3 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {!product.available || !product.inStock ? 'NOT AVAILABLE' : 'ADD TO CART'}
              </button>
              <button onClick={()=>toggleWishlist(product.id)} className={`w-12 border flex items-center justify-center ${isWish ? 'bg-black text-white border-black' : 'border-neutral-300'}`}>
                <Heart className={`w-5 h-5 ${isWish ? 'fill-white' : ''}`} />
              </button>
            </div>

            <div className="mt-6 space-y-2 text-xs border border-neutral-200 p-4 bg-[#f9fafb]">
              <p className="flex items-center gap-2"><Truck className="w-4 h-4" /> Free shipping over €99 • Click & Collect in 2 hours</p>
              <p className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Free returns within 30 days</p>
            </div>

            <div className="mt-6 text-xs leading-relaxed text-neutral-600 space-y-3">
              <p><span className="font-bold text-black">Composition:</span> Product details, care and origin are managed from Admin → Products. You can edit images, price, availability and video hero at any time.</p>
              <p><span className="font-bold text-black">Notify:</span> Admin can toggle &quot;Not Available&quot; to hide add-to-cart instantly.</p>
            </div>
          </div>
        </div>
      </div>
      <UniqloFooter />
    </div>
  );
}
