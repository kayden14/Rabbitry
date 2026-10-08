'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { WHATSAPP_NUMBER, PHONE_1, formatNaira } from '@/lib/utils';
import { featuredProducts } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import LeadMagnetModal from '@/components/ui/LeadMagnetModal';
import FarmEstimatorWidget from '@/components/ui/FarmEstimatorWidget';
import DeliveryTicker from '@/components/ui/DeliveryTicker';

const CATEGORIES = [
  { icon: '🐇', title: 'Live Breeding Stock & Pets', desc: 'Dutch, NZW, Angora, Holland Lop & more', href: '/shop?cat=live-stock', color: '#1a5c2a' },
  { icon: '🥩', title: 'Processed Rabbit Meat', desc: 'Fresh & frozen, whole or cut parts', href: '/shop?cat=processed-meat', color: '#7a4f2d' },
  { icon: '🍖', title: 'Event Catering', desc: 'BBQ skewers & roasted rabbit for events', href: '/shop?cat=catering', color: '#c9921a' },
  { icon: '🌿', title: 'Organic Farm Inputs', desc: 'Bottled urine, dried manure & cured fur', href: '/shop?cat=by-products', color: '#2d8f44' },
  { icon: '🏗️', title: 'Cages & Equipment', desc: 'Custom cages, drinkers & feeders', href: '/shop?cat=equipment', color: '#4a6fa5' },
];

const STATS = [
  { value: '500+', label: 'Rabbits Sold' },
  { value: '12+', label: 'Breeds Available' },
  { value: '36', label: 'States Delivered' },
  { value: '100%', label: 'Natural & Organic' },
];

const TESTIMONIALS = [
  {
    name: 'Adebayo Olamide',
    location: 'Lagos State',
    text: 'I bought 10 NZW does and 2 bucks from RABBITRY. All arrived healthy, well-tagged and dewormed. My farm is now thriving!',
    rating: 5,
    emoji: '⭐',
  },
  {
    name: 'Mrs. Funmilayo Adeola',
    location: 'Abuja, FCT',
    text: 'Ordered the golden roasted rabbit for my daughter\'s graduation dinner. The guests were blown away! Absolutely delicious and well-presented.',
    rating: 5,
    emoji: '🍽️',
  },
  {
    name: 'Engr. Chukwuma Obi',
    location: 'Enugu State',
    text: 'The 4-hole battery cages are top quality. Galvanized mesh, very sturdy. Delivered and installed guidance provided via WhatsApp. Excellent service!',
    rating: 5,
    emoji: '🏗️',
  },
];

export default function HomePage() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Show hero animation
    const t1 = setTimeout(() => setHeroVisible(true), 100);
    // Show lead magnet after 15s
    const t2 = setTimeout(() => setShowLeadModal(true), 15000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0d3317 0%, #1a5c2a 45%, #0d3317 100%)',
      }}>
        {/* Background pattern */}
        <div style={{position:'absolute',inset:0,opacity:0.06,backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',backgroundSize:'32px 32px'}}/>

        {/* Blobs */}
        <div style={{position:'absolute',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(201,146,26,0.18),transparent 70%)',top:'-10%',right:'-5%',pointerEvents:'none'}}/>
        <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(45,143,68,0.25),transparent 70%)',bottom:'-5%',left:'5%',pointerEvents:'none'}}/>

        <div className="container" style={{position:'relative',zIndex:1}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'center',gap:'4rem'}}>
            {/* Left: Copy */}
            <div className={heroVisible ? 'animate-slide-left' : ''} style={{opacity: heroVisible ? 1 : 0}}>
              <div style={{
                display:'inline-flex',alignItems:'center',gap:'0.5rem',
                background:'rgba(201,146,26,0.15)',border:'1px solid rgba(201,146,26,0.3)',
                borderRadius:'999px',padding:'0.35rem 1rem',marginBottom:'1.5rem',
              }}>
                <span style={{width:8,height:8,background:'var(--brand-gold)',borderRadius:'50%',display:'inline-block',animation:'pulse 2s infinite'}}/>
                <span style={{color:'var(--brand-gold)',fontSize:'0.8rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase'}}>
                  Fresh Stock Available Now
                </span>
              </div>

              <h1 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:'clamp(2.5rem,5vw,4rem)',
                fontWeight:900,
                color:'#fff',
                lineHeight:1.1,
                marginBottom:'1.5rem',
              }}>
                Nigeria&apos;s Premier
                <span style={{
                  display:'block',
                  background:'linear-gradient(135deg,var(--brand-gold),var(--brand-gold-light))',
                  WebkitBackgroundClip:'text',
                  WebkitTextFillColor:'transparent',
                  backgroundClip:'text',
                }}>
                  Rabbit Farm
                </span>
              </h1>

              <p style={{color:'rgba(255,255,255,0.75)',fontSize:'1.1rem',lineHeight:1.75,marginBottom:'2.5rem',maxWidth:480}}>
                From live breeding stock to farm-fresh meat, event catering, organic fertilizers, and custom-built cages — full-cycle rabbit farming at its finest. Based in Ile-Ife, delivering nationwide.
              </p>

              <div style={{display:'flex',flexWrap:'wrap',gap:'1rem',marginBottom:'3rem'}}>
                <Link href="/shop" className="btn btn-gold btn-lg">
                  Browse All Products
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello RABBITRY 🐇, I would like to place an order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-lg"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Order
                </a>
              </div>

              {/* Quick Stats */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
                {STATS.map((s, i) => (
                  <div key={i} style={{textAlign:'center'}}>
                    <div style={{
                      fontFamily:"'Playfair Display',serif",
                      fontSize:'1.75rem',
                      fontWeight:800,
                      background:'linear-gradient(135deg,var(--brand-gold),var(--brand-gold-light))',
                      WebkitBackgroundClip:'text',
                      WebkitTextFillColor:'transparent',
                      backgroundClip:'text',
                      lineHeight:1,
                      marginBottom:'0.3rem',
                    }}>{s.value}</div>
                    <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero visual */}
            <div className={heroVisible ? 'animate-slide-right' : ''} style={{opacity: heroVisible ? 1 : 0}}>
              <div style={{
                position:'relative',
                background:'rgba(255,255,255,0.06)',
                backdropFilter:'blur(20px)',
                border:'1px solid rgba(255,255,255,0.15)',
                borderRadius:'var(--radius-xl)',
                padding:'2rem',
                textAlign:'center',
              }}>
                <div style={{fontSize:'8rem',lineHeight:1,marginBottom:'1rem',animation:'float 4s ease-in-out infinite'}}>🐇</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",color:'#fff',fontSize:'1.25rem',fontWeight:700,marginBottom:'0.5rem'}}>
                  Pure. Natural. Nigerian.
                </h3>
                <p style={{color:'rgba(255,255,255,0.6)',fontSize:'0.875rem',lineHeight:1.6}}>
                  Humanely raised, antibiotic-tested, and hygienically processed. Every animal traceable from hutch to delivery.
                </p>

                {/* Floating badge cards */}
                <div style={{
                  position:'absolute', top:'1rem', right:'-1rem',
                  background:'linear-gradient(135deg,var(--brand-gold),var(--brand-gold-light))',
                  borderRadius:'var(--radius)',
                  padding:'0.6rem 1rem',
                  color:'#fff',
                  fontSize:'0.75rem',
                  fontWeight:700,
                  boxShadow:'var(--shadow-gold)',
                  animation:'float 3s ease-in-out infinite',
                  animationDelay:'1s',
                }}>
                  🚚 Ships Nationwide
                </div>
                <div style={{
                  position:'absolute', bottom:'2rem', left:'-1rem',
                  background:'#fff',
                  borderRadius:'var(--radius)',
                  padding:'0.6rem 1rem',
                  color:'var(--brand-green)',
                  fontSize:'0.75rem',
                  fontWeight:700,
                  boxShadow:'var(--shadow-md)',
                  animation:'float 3.5s ease-in-out infinite',
                  animationDelay:'0.5s',
                }}>
                  ✅ Dewormed & Vaccinated
                </div>
                <div style={{
                  position:'absolute',bottom:'4.5rem',right:'-0.5rem',
                  background:'rgba(37,211,102,0.9)',
                  borderRadius:'var(--radius)',
                  padding:'0.6rem 1rem',
                  color:'#fff',
                  fontSize:'0.75rem',
                  fontWeight:700,
                  boxShadow:'0 4px 20px rgba(37,211,102,0.4)',
                  animation:'float 4s ease-in-out infinite',
                  animationDelay:'1.5s',
                }}>
                  💬 WhatsApp Orders
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position:'absolute',
          bottom:'2rem',left:'50%',
          transform:'translateX(-50%)',
          display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem',
          color:'rgba(255,255,255,0.4)',fontSize:'0.75rem',
        }}>
          <div style={{width:24,height:38,border:'2px solid rgba(255,255,255,0.25)',borderRadius:12,display:'flex',justifyContent:'center',paddingTop:'6px'}}>
            <div style={{width:4,height:8,background:'rgba(255,255,255,0.5)',borderRadius:2,animation:'scrollDot 2s infinite'}}/>
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── DELIVERY TICKER ───────────────────────────────────── */}
      <DeliveryTicker />

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="section" style={{background:'#fff'}}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">
              <span>🛍️</span> What We Offer
            </div>
            <h2 className="display-md">5 Product Categories,<br/>One Complete Rabbit Farm</h2>
            <p>Everything you need — from live animals to processed products, catering to farming inputs.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.25rem'}}>
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.href} href={cat.href} style={{textDecoration:'none'}}>
                <div
                  className="card animate-fade-up"
                  style={{
                    padding:'1.75rem 1.25rem',
                    textAlign:'center',
                    cursor:'pointer',
                    animationDelay:`${i * 0.1}s`,
                    height:'100%',
                    border:`2px solid transparent`,
                    transition:'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = cat.color;
                    (e.currentTarget as HTMLElement).style.background = `${cat.color}08`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.background = '#fff';
                  }}
                >
                  <div style={{
                    fontSize:'3rem', marginBottom:'1rem',
                    display:'inline-flex',alignItems:'center',justifyContent:'center',
                    width:72,height:72,
                    background:`${cat.color}15`,
                    borderRadius:'50%',
                  }}>
                    {cat.icon}
                  </div>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'0.95rem',fontWeight:700,color:'var(--gray-800)',marginBottom:'0.4rem',lineHeight:1.3}}>
                    {cat.title}
                  </h3>
                  <p style={{fontSize:'0.8rem',color:'var(--gray-500)',lineHeight:1.5}}>{cat.desc}</p>
                  <div style={{
                    marginTop:'1rem',
                    display:'inline-flex',alignItems:'center',gap:'0.3rem',
                    color:cat.color,fontSize:'0.8rem',fontWeight:600,
                  }}>
                    Shop Now →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────── */}
      <section className="section" style={{background:'var(--brand-cream)'}}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">
              <span>⭐</span> Featured Listings
            </div>
            <h2 className="display-md">Our Best Sellers</h2>
            <p>Hand-picked products our customers love most. Fresh stock updated regularly.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.5rem',marginBottom:'3rem'}}>
            {featuredProducts.slice(0, 6).map((product, i) => (
              <ProductCard key={product.id} product={product} delay={i * 0.08} />
            ))}
          </div>

          <div style={{textAlign:'center'}}>
            <Link href="/shop" className="btn btn-primary btn-lg">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FARM ESTIMATOR ────────────────────────────────────── */}
      <section className="section" style={{background:'linear-gradient(135deg,#0d3317,#1a5c2a)'}}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow" style={{color:'var(--brand-gold)'}}>
              <span>📐</span> Free Planning Tool
            </div>
            <h2 className="display-md" style={{color:'#fff'}}>Cage & Feed Estimator</h2>
            <p style={{color:'rgba(255,255,255,0.65)'}}>
              Planning to start rabbit farming? Enter your rabbit count and get an instant recommendation.
            </p>
          </div>
          <FarmEstimatorWidget />
        </div>
      </section>

      {/* ── CATERING CTA ──────────────────────────────────────── */}
      <section className="section" style={{background:'#fff'}}>
        <div className="container">
          <div style={{
            background:'linear-gradient(135deg,var(--brand-earth) 0%,#4a2810 100%)',
            borderRadius:'var(--radius-xl)',
            padding:'clamp(2.5rem,6vw,4rem)',
            display:'grid',
            gridTemplateColumns:'1fr 1fr',
            alignItems:'center',
            gap:'3rem',
            overflow:'hidden',
            position:'relative',
          }}>
            <div style={{position:'absolute',top:'-30%',right:'-5%',width:400,height:400,borderRadius:'50%',background:'rgba(201,146,26,0.12)',pointerEvents:'none'}}/>
            <div>
              <div style={{
                display:'inline-flex',alignItems:'center',gap:'0.5rem',
                background:'rgba(201,146,26,0.2)',borderRadius:'999px',
                padding:'0.35rem 1rem',marginBottom:'1.25rem',
              }}>
                <span style={{color:'var(--brand-gold-light)',fontSize:'0.8rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em'}}>Event Catering Available</span>
              </div>
              <h2 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:'clamp(1.75rem,3.5vw,2.75rem)',
                fontWeight:900,color:'#fff',
                lineHeight:1.15,marginBottom:'1.25rem',
              }}>
                Make Your Event<br/>
                <span style={{color:'var(--brand-gold-light)'}}>Unforgettable</span>
              </h2>
              <p style={{color:'rgba(255,255,255,0.7)',lineHeight:1.7,marginBottom:'2rem'}}>
                Golden roasted whole rabbit, marinated BBQ skewers — premium rabbit cuisine for weddings, burials, graduations, and corporate events. Custom quotes available.
              </p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'1rem'}}>
                <Link href="/catering" className="btn btn-gold btn-lg">
                  Get a Catering Quote
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello RABBITRY, I would like a catering quote for my event.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
            <div style={{textAlign:'center',fontSize:'7rem',animation:'float 4s ease-in-out infinite',lineHeight:1}}>
              🍖
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="section" style={{background:'var(--brand-cream)'}}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow"><span>💬</span> Customer Stories</div>
            <h2 className="display-md">What Our Customers Say</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.5rem'}}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card animate-fade-up" style={{padding:'2rem',animationDelay:`${i*0.15}s`}}>
                <div style={{fontSize:'1.5rem',marginBottom:'1rem'}}>
                  {'⭐'.repeat(t.rating)}
                </div>
                <p style={{color:'var(--gray-600)',lineHeight:1.75,fontStyle:'italic',marginBottom:'1.25rem',fontSize:'0.9rem'}}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem',borderTop:'1px solid var(--gray-100)',paddingTop:'1rem'}}>
                  <div style={{
                    width:42,height:42,borderRadius:'50%',
                    background:'linear-gradient(135deg,var(--brand-green),var(--brand-green-light))',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:'#fff',fontSize:'1.1rem',flexShrink:0,
                  }}>
                    {t.emoji}
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:'0.9rem',color:'var(--gray-800)'}}>{t.name}</div>
                    <div style={{fontSize:'0.75rem',color:'var(--gray-500)'}}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT STRIP ─────────────────────────────────────── */}
      <section style={{background:'var(--brand-green-dark)',padding:'3rem 0'}}>
        <div className="container">
          <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'2rem',textAlign:'center'}}>
            <div>
              <h3 style={{fontFamily:"'Playfair Display',serif",color:'#fff',fontSize:'1.5rem',fontWeight:700}}>Ready to Order?</h3>
              <p style={{color:'rgba(255,255,255,0.6)',marginTop:'0.25rem'}}>We&apos;re just a call or message away.</p>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'1rem',justifyContent:'center'}}>
              <a href={`tel:${PHONE_1}`} className="btn btn-gold btn-lg">
                📞 {PHONE_1}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello RABBITRY 🐇, I want to place an order.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                💬 WhatsApp Now
              </a>
              <Link href="/shop" className="btn btn-outline" style={{borderColor:'rgba(255,255,255,0.4)',color:'#fff'}}>
                Browse Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Modal */}
      {showLeadModal && <LeadMagnetModal onClose={() => setShowLeadModal(false)} />}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
      `}</style>
    </>
  );
}
