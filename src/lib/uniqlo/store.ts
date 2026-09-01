'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UniqloProduct, UniqloCategory, HeroSection, TickerConfig, Coupon, UniqloCartItem, UniqloOrder, UniqloSectionImage } from './types';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_HERO, DEFAULT_TICKER, DEFAULT_COUPONS, DEFAULT_SECTION_IMAGES } from './data';

interface UniqloStore {
  products: UniqloProduct[];
  categories: UniqloCategory[];
  hero: HeroSection;
  ticker: TickerConfig;
  coupons: Coupon[];
  sections: UniqloSectionImage[];
  cart: UniqloCartItem[];
  orders: UniqloOrder[];
  wishlist: string[];
  // product
  setProducts: (p: UniqloProduct[]) => void;
  addProduct: (p: UniqloProduct) => void;
  updateProduct: (id: string, patch: Partial<UniqloProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleAvailable: (id: string) => void;
  // category
  setCategories: (c: UniqloCategory[]) => void;
  addCategory: (c: UniqloCategory) => void;
  updateCategory: (id: string, patch: Partial<UniqloCategory>) => void;
  deleteCategory: (id: string) => void;
  // hero/ticker
  updateHero: (patch: Partial<HeroSection>) => void;
  updateTicker: (patch: Partial<TickerConfig>) => void;
  // coupons
  setCoupons: (c: Coupon[]) => void;
  addCoupon: (c: Coupon) => void;
  updateCoupon: (id: string, patch: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  // sections
  setSections: (s: UniqloSectionImage[]) => void;
  updateSection: (id: string, patch: Partial<UniqloSectionImage>) => void;
  // cart
  addToCart: (product: UniqloProduct, qty?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQty: (productId: string, qty: number, size?: string, color?: string) => void;
  clearCart: () => void;
  // orders
  addOrder: (o: UniqloOrder) => void;
  // wishlist
  toggleWishlist: (productId: string) => void;
}

export const useUniqloStore = create<UniqloStore>()(
  persist(
    (set, get) => ({
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      hero: DEFAULT_HERO,
      ticker: DEFAULT_TICKER,
      coupons: DEFAULT_COUPONS,
      sections: DEFAULT_SECTION_IMAGES,
      cart: [],
      orders: [],
      wishlist: [],

      setProducts: (products) => set({ products }),
      addProduct: (p) => set((s) => ({ products: [p, ...s.products] })),
      updateProduct: (id, patch) => set((s) => ({ products: s.products.map(x => x.id===id ? {...x, ...patch, updatedAt: Date.now()} : x)})),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter(x=>x.id!==id)})),
      toggleAvailable: (id) => set((s) => ({ products: s.products.map(x=> x.id===id ? {...x, available: !x.available, inStock: !x.available ? false : x.inStock, updatedAt: Date.now()} : x)})),

      setCategories: (categories) => set({ categories }),
      addCategory: (c) => set((s)=>({ categories:[...s.categories, c]})),
      updateCategory: (id,patch)=> set((s)=>({ categories: s.categories.map(x=> x.id===id ? {...x,...patch}:x)})),
      deleteCategory: (id)=> set((s)=>({ categories: s.categories.filter(x=>x.id!==id)})),

      updateHero: (patch)=> set((s)=>({ hero:{...s.hero, ...patch}})),
      updateTicker: (patch)=> set((s)=>({ ticker:{...s.ticker, ...patch}})),

      setCoupons: (coupons)=> set({ coupons }),
      addCoupon: (c)=> set((s)=>({ coupons:[...s.coupons, c]})),
      updateCoupon: (id,patch)=> set((s)=>({ coupons: s.coupons.map(x=> x.id===id ? {...x,...patch}:x)})),
      deleteCoupon: (id)=> set((s)=>({ coupons: s.coupons.filter(x=>x.id!==id)})),

      setSections: (sections)=> set({ sections }),
      updateSection: (id,patch)=> set((s)=>({ sections: s.sections.map(x=> x.id===id ? {...x,...patch}:x)})),

      addToCart: (product, qty=1, size, color) => set((s)=>{
        const idx = s.cart.findIndex(c=> c.product.id===product.id && c.size===size && c.color===color);
        if(idx!==-1){ const copy=[...s.cart]; copy[idx].quantity+=qty; return {cart:copy};}
        return {cart:[...s.cart,{product, quantity:qty, size, color}]};
      }),
      removeFromCart: (productId, size, color)=> set((s)=>({ cart: s.cart.filter(c=> !(c.product.id===productId && c.size===size && c.color===color))})),
      updateQty: (productId, qty, size, color)=> set((s)=>{
        if(qty<=0) return {cart: s.cart.filter(c=> !(c.product.id===productId && c.size===size && c.color===color))};
        return {cart: s.cart.map(c=> c.product.id===productId && c.size===size && c.color===color ? {...c, quantity:qty}:c)};
      }),
      clearCart: ()=> set({cart:[]}),
      addOrder: (o)=> set((s)=>({ orders:[o,...s.orders]})),
      toggleWishlist: (pid)=> set((s)=> ({ wishlist: s.wishlist.includes(pid) ? s.wishlist.filter(x=>x!==pid) : [...s.wishlist, pid]})),
    }),
    {
      name:'planetfashion-store-v2',
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : undefined as any),
      skipHydration: false,
      partialize: (s)=> ({ products:s.products, categories:s.categories, hero:s.hero, ticker:s.ticker, coupons:s.coupons, sections:s.sections, cart:s.cart, orders:s.orders, wishlist:s.wishlist }),
      version: 2,
      migrate: (persisted: any, version: number) => {
        // Force fresh if old version
        if (version !== 2) return undefined as any;
        return persisted;
      },
    }
  )
);

export function calcCartTotals(cart: UniqloCartItem[], coupons: Coupon[], code?: string){
  const subtotal = cart.reduce((a,c)=> a + c.product.price * c.quantity, 0);
  let discount=0; let shipping = subtotal>0 ? 7.99 : 0;
  let freeShipping=false;
  if(code){
    const cp = coupons.find(x=> x.code.toUpperCase()===code.toUpperCase() && x.isActive);
    if(cp){
      const now = new Date(); const startOk = !cp.startDate || new Date(cp.startDate) <= now; const endOk = !cp.endDate || new Date(cp.endDate) >= now;
      const minOk = !cp.minBasket || subtotal >= cp.minBasket;
      if(startOk && endOk && minOk){
        if(cp.type==='percent'){ discount = subtotal * (cp.value/100); if(cp.maxDiscount) discount = Math.min(discount, cp.maxDiscount); }
        else if(cp.type==='fixed'){ discount = Math.min(cp.value, subtotal); }
        else if(cp.type==='free_shipping'){ freeShipping=true; }
      }
    }
  }
  if(freeShipping || subtotal>=99) shipping=0;
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * 0.1;
  const total = afterDiscount + shipping + tax;
  const savings = cart.reduce((a,c)=> {
    if(c.product.compareAtPrice) return a + (c.product.compareAtPrice - c.product.price)*c.quantity;
    return a;
  },0);
  return { subtotal, discount, shipping, tax, total, savings, freeShipping };
}
