import type { UniqloCategory, UniqloProduct, HeroSection, TickerConfig, Coupon, UniqloSectionImage } from './types';

export const DEFAULT_CATEGORIES: UniqloCategory[] = [
  { id:'cat_outer', slug:'outerwear', name:'Outerwear', gender:'UNISEX', image:'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600', sortOrder:1, isActive:true },
  { id:'cat_tops', slug:'tops', name:'Tops', gender:'UNISEX', image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', sortOrder:2, isActive:true },
  { id:'cat_bottoms', slug:'bottoms', name:'Bottoms', gender:'UNISEX', image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', sortOrder:3, isActive:true },
  { id:'cat_dresses', slug:'dresses', name:'Dresses', gender:'WOMEN', image:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600', sortOrder:4, isActive:true },
  { id:'cat_knitwear', slug:'knitwear', name:'Knitwear', gender:'UNISEX', image:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600', sortOrder:5, isActive:true },
  { id:'cat_loungewear', slug:'loungewear', name:'Loungewear', gender:'UNISEX', image:'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600', sortOrder:6, isActive:true },
  { id:'cat_sport', slug:'sport-utility', name:'Sport Utility', gender:'UNISEX', image:'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=600', sortOrder:7, isActive:true },
  { id:'cat_accessories', slug:'accessories', name:'Accessories', gender:'UNISEX', image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', sortOrder:8, isActive:true },
];

export const GENDER_TABS = ['WOMEN','MEN','KIDS','BABY'] as const;

function slugify(s:string){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}

const FIXED_TS = 1700000000000;
function mk(p: Omit<UniqloProduct,'slug'|'createdAt'|'updatedAt'>): UniqloProduct {
  return {
    ...p,
    slug: slugify(p.name)+'-'+p.id,
    createdAt: FIXED_TS,
    updatedAt: FIXED_TS,
  };
}

export const DEFAULT_PRODUCTS: UniqloProduct[] = [
  mk({ id:'p001', name:'U Crew Neck Short Sleeve T-Shirt', description:'Supima Cotton. Smooth, lightweight and breathable.', categoryId:'cat_tops', gender:'UNISEX', price:14.90, compareAtPrice:19.90, images:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'], colors:[{name:'White',hex:'#ffffff'},{name:'Black',hex:'#111111'},{name:'Natural',hex:'#d6c7b8'}], sizes:['XS','S','M','L','XL','XXL'], inStock:true, available:true, isFeatured:true, rating:4.7, reviewCount:812 }),
  mk({ id:'p002', name:'Ultra Light Down Jacket', description:'Incredibly light, warm and compact. Packs into included pouch.', categoryId:'cat_outer', gender:'UNISEX', price:69.90, images:['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800','https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800'], colors:[{name:'Navy',hex:'#1e2a4a'},{name:'Olive',hex:'#6b7c5a'},{name:'Black',hex:'#111'}], sizes:['S','M','L','XL'], inStock:true, available:true, isFeatured:true, rating:4.8, reviewCount:1243 }),
  mk({ id:'p003', name:'High Waisted Wide Leg Jeans', description:'Curved silhouette with vintage wash. Made for everyday ease.', categoryId:'cat_bottoms', gender:'WOMEN', price:39.90, images:['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800','https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800'], colors:[{name:'Blue',hex:'#5b7ca6'},{name:'Black',hex:'#222'}], sizes:['24','26','28','30','32'], inStock:true, available:true, isNew:true, rating:4.6, reviewCount:521 }),
  mk({ id:'p004', name:'Fluffy Fleece Full-Zip Jacket', description:'Soft, fluffy fleece with warm and lightweight comfort.', categoryId:'cat_outer', gender:'UNISEX', price:29.90, compareAtPrice:39.90, images:['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'], colors:[{name:'Beige',hex:'#c9b8a3'},{name:'Grey',hex:'#9aa0a6'}], sizes:['S','M','L','XL'], inStock:true, available:true, rating:4.5, reviewCount:402 }),
  mk({ id:'p005', name:'AIRism Cotton Crew Neck T-Shirt', description:'AIRism with DRY technology keeps you cool and dry.', categoryId:'cat_tops', gender:'MEN', price:19.90, images:['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800'], colors:[{name:'White',hex:'#fff'},{name:'Grey',hex:'#888'}], sizes:['S','M','L','XL','XXL'], inStock:true, available:true, rating:4.6, reviewCount:330 }),
  mk({ id:'p006', name:'Merino Wool Sweater', description:'100% extra fine merino wool. Light, warm and non-itch.', categoryId:'cat_knitwear', gender:'WOMEN', price:39.90, images:['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800'], colors:[{name:'Camel',hex:'#b68a5a'},{name:'Black',hex:'#111'}], sizes:['S','M','L'], inStock:true, available:true, isNew:true, rating:4.9, reviewCount:210 }),
  mk({ id:'p007', name:'EZY Ankle Pants', description:'Stretchy, comfortable and polished. Smart meets casual.', categoryId:'cat_bottoms', gender:'MEN', price:29.90, images:['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'], colors:[{name:'Black',hex:'#111'},{name:'Navy',hex:'#1e2a4a'}], sizes:['S','M','L','XL'], inStock:true, available:true, rating:4.4, reviewCount:189 }),
  mk({ id:'p008', name:'Pocketable Parka', description:'Water-repellent, packable. Your travel companion.', categoryId:'cat_outer', gender:'UNISEX', price:49.90, images:['https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=800'], colors:[{name:'Olive',hex:'#6b7c3a'},{name:'Natural',hex:'#c2b280'}], sizes:['S','M','L','XL'], inStock:false, available:false, rating:4.3, reviewCount:98 }),
  mk({ id:'p009', name:'Linen Blend Long Dress', description:'Breezy linen blend perfect for spring.', categoryId:'cat_dresses', gender:'WOMEN', price:39.90, images:['https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800'], colors:[{name:'White',hex:'#fff'},{name:'Blue',hex:'#6ea8c7'}], sizes:['XS','S','M','L'], inStock:true, available:true, isFeatured:true, rating:4.7, reviewCount:274 }),
  mk({ id:'p010', name:'HEATTECH Crew Neck Long Sleeve', description:'Generates heat using body moisture. Ultra thin warmth.', categoryId:'cat_tops', gender:'UNISEX', price:19.90, images:['https://images.unsplash.com/photo-1618354691321-e851c56960d1?w=800'], colors:[{name:'Black',hex:'#111'},{name:'White',hex:'#fff'}], sizes:['S','M','L','XL'], inStock:true, available:true, rating:4.8, reviewCount:902 }),
  mk({ id:'p011', name:'Kids Soft Fleece Set', description:'Cozy fleece set for play and lounging.', categoryId:'cat_loungewear', gender:'KIDS', price:24.90, images:['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800'], colors:[{name:'Pink',hex:'#e8a0a8'},{name:'Blue',hex:'#7aa9d6'}], sizes:['4Y','6Y','8Y','10Y'], inStock:true, available:true, isNew:true, rating:4.8, reviewCount:112 }),
  mk({ id:'p012', name:'Baby Cotton Bodysuit 3 Pack', description:'Soft organic cotton with snap buttons.', categoryId:'cat_tops', gender:'BABY', price:14.90, images:['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800'], colors:[{name:'White',hex:'#fff'},{name:'Beige',hex:'#d9c7b8'}], sizes:['60','70','80','90'], inStock:true, available:true, rating:4.9, reviewCount:76 }),
  mk({ id:'p013', name:'Cross Body Bag', description:'Minimal, durable water-repellent bag.', categoryId:'cat_accessories', gender:'UNISEX', price:19.90, images:['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'], colors:[{name:'Black',hex:'#111'},{name:'Natural',hex:'#c2b280'}], sizes:['One Size'], inStock:true, available:true, rating:4.5, reviewCount:430 }),
  mk({ id:'p014', name:'Supima Cotton Lounge Pants', description:'Sleepwear comfort for everyday living.', categoryId:'cat_loungewear', gender:'UNISEX', price:29.90, images:['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800'], colors:[{name:'Grey',hex:'#9aa0a6'},{name:'Navy',hex:'#1e2a4a'}], sizes:['S','M','L','XL'], inStock:true, available:true, rating:4.6, reviewCount:221 }),
  mk({ id:'p015', name:'Blocktech Coat', description:'Windproof, water-repellent 3D Cut coat.', categoryId:'cat_outer', gender:'MEN', price:89.90, images:['https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=800'], colors:[{name:'Black',hex:'#111'},{name:'Beige',hex:'#c9b8a3'}], sizes:['S','M','L','XL'], inStock:true, available:true, isFeatured:true, rating:4.7, reviewCount:348 }),
  mk({ id:'p016', name:'Wide Fit Curved Pants', description:'Workwear-inspired, wide fit ease.', categoryId:'cat_bottoms', gender:'WOMEN', price:39.90, images:['https://images.unsplash.com/photo-1506629903106-e46132dba7a5?w=800'], colors:[{name:'Olive',hex:'#6b7c5a'},{name:'Black',hex:'#111'}], sizes:['XS','S','M','L'], inStock:true, available:true, rating:4.4, reviewCount:167 }),
];

export const DEFAULT_HERO: HeroSection = {
  id:'hero_01',
  type:'image',
  src:'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600',
  title:'PlanetFashion — Wear Your Planet',
  subtitle:'Minimal, modern, timeless LifeWear. New Planet collection available now — Pay with UPI / GPay.',
  ctaLabel:'Shop PlanetFashion',
  ctaLink:'/collection/all',
  alignment:'left',
  overlayOpacity:0.35,
  isActive:true,
};

export const DEFAULT_TICKER: TickerConfig = {
  enabled:true,
  text:'★ PLANETFASHION • FREE SHIPPING OVER €99  •  USE CODE PLANET10 FOR 10% OFF  •  PAY WITH UPI / GPay  •  FREE RETURNS 30 DAYS  •',
  speed:18,
  bgColor:'#e10600',
  textColor:'#ffffff',
  link:'/collection/all',
};

export const DEFAULT_COUPONS: Coupon[] = [
  { id:'c1', code:'WELCOME10', type:'percent', value:10, minBasket:50, isActive:true, usedCount:0, description:'10% off first order over €50 — PlanetFashion' },
  { id:'c2', code:'PLANET10', type:'percent', value:10, minBasket:0, isActive:true, usedCount:0, description:'PlanetFashion 10% sale — apply at checkout' },
  { id:'c3', code:'FREEDEL', type:'free_shipping', value:0, minBasket:99, isActive:true, usedCount:0, description:'Free shipping over €99' },
  { id:'c4', code:'SAVE20', type:'fixed', value:20, minBasket:100, maxDiscount:20, isActive:true, usedCount:0, description:'€20 off over €100' },
  { id:'c5', code:'SPRING15', type:'percent', value:15, minBasket:0, isActive:true, usedCount:0, description:'Spring 15% off' },
];

export const DEFAULT_SECTION_IMAGES: UniqloSectionImage[] = [
  { id:'s1', title:'Shop Women', image:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800', link:'/collection/women', sortOrder:1, isActive:true },
  { id:'s2', title:'Shop Men', image:'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800', link:'/collection/men', sortOrder:2, isActive:true },
  { id:'s3', title:'Shop Kids', image:'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800', link:'/collection/kids', sortOrder:3, isActive:true },
  { id:'s4', title:'Shop Baby', image:'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800', link:'/collection/baby', sortOrder:4, isActive:true },
];
