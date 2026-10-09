'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { WHATSAPP_NUMBER, PHONE_1, PHONE_2, formatNaira, FARM_LOCATION } from '@/lib/utils';
import { featuredProducts } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import LeadMagnetModal from '@/components/ui/LeadMagnetModal';
import FarmEstimatorWidget from '@/components/ui/FarmEstimatorWidget';
import DeliveryTicker from '@/components/ui/DeliveryTicker';

const CATEGORIES = [
  {
    image: '/images/white-rabbit.jpg',
    title: 'Live Breeding Stock & Pets',
    desc: 'Pedigree Dutch, New Zealand White, Flemish Giant, Angora, Netherland Dwarf & more with health records.',
    href: '/shop?cat=live-stock',
    tag: '10 Certified Breeds',
  },
  {
    image: '/images/dressed-meat.jpg',
    title: 'Processed Culinary Meat',
    desc: 'Hygienically dressed whole carcasses & frozen cut portions. Ultra-lean, low-cholesterol white meat.',
    href: '/shop?cat=processed-meat',
    tag: 'Fresh & Blast Frozen',
  },
  {
    image: '/images/bbq-skewers.jpg',
    title: 'Culinary & Event Catering',
    desc: 'Herb-marinated barbecue rabbit skewers and golden roasted whole rabbits for weddings & banquet receptions.',
    href: '/shop?cat=catering',
    tag: 'Event Catering',
  },
  {
    image: '/images/farm-fertilizer.jpg',
    title: 'By-Products & Organic Inputs',
    desc: 'High-nitrogen bottled rabbit urine foliar feed, sun-dried organic manure pellets & tanned pelts.',
    href: '/shop?cat=by-products',
    tag: '100% Organic',
  },
  {
    image: '/images/rabbit-cages.jpg',
    title: 'Equipment & Cage Fabrication',
    desc: 'Heavy-gauge galvanized wire battery cages, automated 360° nipple drinkers & anti-scratch J-feeders.',
    href: '/shop?cat=equipment',
    tag: 'Custom Welded',
  },
];

const DISPATCH_RECORDS = [
  {
    title: '24x New Zealand Whites Dispatched to Abeokuta, Ogun State',
    desc: 'Ventilated transit crates shipped via park courier from Ile-Ife. Received healthy by farm owner.',
    image: '/images/dispatch-crate.jpg',
    tag: 'Live Transit',
    time: 'Yesterday',
  },
  {
    title: '50kg Dressed Rabbit Meat for Banquet in Lekki Phase 1, Lagos',
    desc: 'Insulated cooler boxes with dry-ice gel packs dispatched for wedding reception banquet.',
    image: '/images/dressed-meat.jpg',
    tag: 'Frozen Freight',
    time: '2 days ago',
  },
  {
    title: '8-Hole Commercial Battery Cage Unit Delivered to Ibadan, Oyo',
    desc: 'Welded 12-gauge galvanized framework safely offloaded at customer rabbitry site.',
    image: '/images/rabbit-cages.jpg',
    tag: 'Fabrication',
    time: '3 days ago',
  },
  {
    title: '15 Liters Organic Foliar Rabbit Urine Shipped to Gwagwalada, Abuja',
    desc: 'Secure sealed jerrycans dispatched via motor park logistics to horticulturist farm.',
    image: '/images/farm-fertilizer.jpg',
    tag: 'Organic Input',
    time: '4 days ago',
  },
];

const STATS = [
  { value: '500+', label: 'Rabbits Supplied', sub: 'Across 36 States' },
  { value: '10', label: 'Pedigree Breeds', sub: 'Health-Screened' },
  { value: '100%', label: 'Traceable Lineage', sub: 'Pure Bloodlines' },
  { value: '48h', label: 'Fast Park Dispatch', sub: 'Nationwide Delivery' },
];

const TESTIMONIALS = [
  {
    name: 'Engr. Babatunde Alabi',
    role: 'Commercial Rabbit Farmer',
    location: 'Ibadan, Oyo State',
    text: 'I ordered 4 New Zealand White does and 1 Flemish Giant buck from Danethicals. They arrived at the Ibadan motor park lively, clean, and in perfect health. Their customer service on WhatsApp is top-notch.',
    rating: 5,
  },
  {
    name: 'Mrs. Folashade Adeleke',
    role: 'Event Caterer & Restaurateur',
    location: 'Victoria Island, Lagos',
    text: 'The rabbit skewers for our executive banquet were the highlight of the evening! Fresh, expertly trimmed, with no gaminess. Rabbitry is now our permanent gourmet meat partner.',
    rating: 5,
  },
  {
    name: 'Dr. Chidi Okafor',
    role: 'Agronomist & Greenhouse Consultant',
    location: 'Asaba, Delta State',
    text: 'Their concentrated rabbit urine fertilizer doubled our tomato yield without chemical scorch. The best organic foliar nutrient in Nigeria.',
    rating: 5,
  },
];

export default function HomePage() {
  const [showLeadModal, setShowLeadModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLeadModal(true);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ── HERO: Full-Viewport Cinematic ──────────────────────── */}
      <section
        className="hero-section-wrap"
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 72px)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          color: '#ffffff',
        }}
      >
        {/* Background: Real farm hero image */}
        <img
          src="/images/farm-hero.jpg"
          alt="Danethicals Commercial Rabbitry Farm"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
          }}
        />

        {/* Deep layered gradient overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, rgba(4,14,7,0.92) 0%, rgba(8,35,16,0.76) 50%, rgba(6,26,11,0.48) 100%)',
            zIndex: 1,
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(to top, #fdf6ec 0%, transparent 100%)',
            zIndex: 2,
          }}
        />

        {/* Animated particles/dots backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            backgroundImage:
              'radial-gradient(circle, rgba(246,199,61,0.07) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            pointerEvents: 'none',
          }}
        />

        {/* ─ CONTENT ─ */}
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 3,
            paddingTop: '3rem',
            paddingBottom: '6rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)',
              alignItems: 'center',
              gap: '3rem',
            }}
            className="hero-grid"
          >
            {/* ── LEFT: TEXT CONTENT ── */}
            <div>
              {/* Pill badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(246,199,61,0.16)',
                  border: '1px solid rgba(246,199,61,0.42)',
                  borderRadius: '30px',
                  padding: '5px 14px 5px 8px',
                  marginBottom: '1.5rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#e8a830',
                    boxShadow: '0 0 8px #e8a830',
                    animation: 'heroPulse 2s ease-in-out infinite',
                  }}
                />
                <span
                  style={{
                    color: '#f6c73d',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                  }}
                >
                  Danethicals Limited · Parakin, Ile-Ife
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5.8vw, 4.3rem)',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 900,
                  lineHeight: 1.12,
                  marginBottom: '1.4rem',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(90deg, #f6c73d 0%, #e8a830 50%, #f6c73d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 24px rgba(0,0,0,0.5))',
                }}
              >
                Nigeria&apos;s Premier Commercial Rabbitry &amp; Farm Supply Hub
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  color: 'rgba(255,255,255,0.88)',
                  marginBottom: '2rem',
                  maxWidth: '530px',
                }}
              >
                Full-cycle rabbit agribusiness, health-certified breeding stock, hygienically
                dressed meat, gourmet event catering, organic fertilizer &amp; custom-welded
                battery cages. Nationwide delivery from Ile-Ife, Osun State.
              </p>

              {/* CTA buttons */}
              <div
                className="hero-cta-row"
                style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2.5rem' }}
              >
                <Link
                  href="/shop"
                  className="shimmer-btn"
                  style={{
                    background: 'linear-gradient(135deg, #c98a12 0%, #e8a830 100%)',
                    color: '#0a1f0d',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    padding: '14px 28px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 22px rgba(201,138,18,0.55)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  Browse Catalog →
                </Link>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    'Hello RABBITRY Danethicals, I would like to make an inquiry about your available breeding stock and products.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shimmer-btn"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    padding: '14px 22px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(34,197,94,0.40)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Order
                </a>

                <button
                  type="button"
                  onClick={() => setShowLeadModal(true)}
                  style={{
                    background: 'rgba(246,199,61,0.18)',
                    border: '1px solid rgba(246,199,61,0.60)',
                    backdropFilter: 'blur(10px)',
                    color: '#f6c73d',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    padding: '14px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  📘 Free Guide (PDF)
                </button>

                <Link
                  href="/estimator"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.28)',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    padding: '14px 22px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  Farm Sizing Tool
                </Link>
              </div>

              {/* Stats grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(255,255,255,0.14)',
                }}
                className="hero-stats"
              >
                {STATS.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      paddingRight: '1rem',
                      borderRight: idx < STATS.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                      paddingLeft: idx > 0 ? '1rem' : '0',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.65rem',
                        fontWeight: 900,
                        color: '#f6c73d',
                        fontFamily: "'Playfair Display', serif",
                        lineHeight: 1,
                        marginBottom: '4px',
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: GLASSMORPHISM SHOWCASE CARD ── */}
            <div style={{ position: 'relative' }}>
              {/* Floating badge: Nationwide Delivery */}
              <div
                style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '10px',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: 'heroFloat 3.5s ease-in-out infinite',
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>🚚</span>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a' }}>
                    Nationwide Delivery
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#64748b' }}>
                    36 States · Park Courier
                  </div>
                </div>
              </div>

              {/* Main showcase card */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px -12px rgba(0,0,0,0.50)',
                }}
              >
                {/* Main image */}
                <div style={{ position: 'relative', height: '280px' }}>
                  <img
                    src="/images/nzw-doe.jpg"
                    alt="New Zealand White Breeder Doe — Danethicals Rabbitry"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(9,40,19,0.75) 0%, transparent 60%)',
                    }}
                  />
                  {/* Featured badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      background: '#d9a841',
                      color: '#0f172a',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    ⭐ Best Seller
                  </div>
                  {/* Bottom overlay text */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '14px',
                      left: '16px',
                      right: '16px',
                    }}
                  >
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                      NZW Breeder Doe
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                      Grade-A · Dewormed · Vaccinated
                    </div>
                  </div>
                </div>

                {/* Card footer: 3 mini product thumbnails + price */}
                <div
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { src: '/images/flemish-giant-buck.png', label: 'Flemish' },
                      { src: '/images/dutch-pair.jpg', label: 'Dutch' },
                      { src: '/images/english-angora.jpg', label: 'Angora' },
                    ].map((img, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <img
                          src={img.src}
                          alt={img.label}
                          style={{
                            width: '44px',
                            height: '44px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid rgba(255,255,255,0.25)',
                          }}
                        />
                        <div
                          style={{
                            fontSize: '0.58rem',
                            color: 'rgba(255,255,255,0.7)',
                            marginTop: '3px',
                            fontWeight: 600,
                          }}
                        >
                          {img.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/shop?cat=live-stock"
                    style={{
                      background: '#d9a841',
                      color: '#0f172a',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      padding: '9px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>

              {/* Floating badge: Trust */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-18px',
                  left: '16px',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: 'heroFloat2 4s ease-in-out infinite',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a' }}>
                    Vet-Certified Stock
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#64748b' }}>
                    Dewormed &amp; Vaccinated
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero animations */}
        <style jsx global>{`
          @keyframes heroPulse {
            0%, 100% { box-shadow: 0 0 8px #e8a830; }
            50% { box-shadow: 0 0 18px #e8a830, 0 0 28px rgba(232,168,48,0.4); }
          }
          @keyframes heroFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes heroFloat2 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          .hero-grid {
            grid-template-columns: minmax(0,1.1fr) minmax(0,0.9fr);
          }
          @media (max-width: 900px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
            }
            .hero-grid > div:last-child {
              display: none;
            }
            .hero-stats {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 1rem !important;
            }
          }
          @media (max-width: 480px) {
            .hero-stats {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}</style>
      </section>

      {/* ── LIVE INTER-STATE DELIVERY DISPATCH TICKER ─────────────── */}

      {/* ── LIVE INTER-STATE DELIVERY DISPATCH TICKER ─────────────── */}
      <DeliveryTicker />

      {/* ── 5 CORE PRODUCT DIVISIONS ──────────────────────────────── */}
      <section style={{ padding: '4.5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#082e11',
                background: '#d1fae0',
                padding: '4px 12px',
                borderRadius: '4px',
                display: 'inline-block',
                marginBottom: '10px',
              }}
            >
              Enterprise Architecture
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.25,
                marginBottom: '12px',
              }}
            >
              5 Specialized Commercial Divisions
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
              A fully integrated commercial agricultural platform catering to farmers, households, culinary caterers,
              horticulturists, and researchers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {CATEGORIES.map((cat, idx) => (
              <Link key={idx} href={cat.href} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  }}
                  className="card-hover-lift"
                >
                  <div style={{ position: 'relative', height: '140px', width: '100%', background: '#f1f5f9' }}>
                    <img
                      src={cat.image}
                      alt={cat.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {cat.tag}
                    </div>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.35,
                        marginBottom: '8px',
                      }}
                    >
                      {cat.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: '#64748b',
                        lineHeight: 1.5,
                        marginBottom: '14px',
                        flex: 1,
                      }}
                    >
                      {cat.desc}
                    </p>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#082e11',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      View Catalog →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────── */}
      <section style={{ padding: '4.5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#082e11',
                  background: '#e2f4e8',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '10px',
                }}
              >
                In-Stock Livestock & Products
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.25,
                }}
              >
                Featured Farm Products
              </h2>
            </div>

            <Link
              href="/shop"
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#082e11',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Browse Full Shop ({featuredProducts.length}+ listings) →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {featuredProducts.slice(0, 8).map((product, idx) => (
              <ProductCard key={product.id} product={product} delay={idx * 0.05} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: SOCIAL PROOF & DELIVERY WALL ───────────────── */}
      <section style={{ padding: '4.5rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#082e11',
                background: '#e2f4e8',
                padding: '4px 12px',
                borderRadius: '4px',
                display: 'inline-block',
                marginBottom: '10px',
              }}
            >
              Verified Proof of Delivery
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.25,
                marginBottom: '12px',
              }}
            >
              Recent Inter-State Shipments & Dispatches
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
              Real live transit crates, meat delivery consignments, and cage units shipped from our Ile-Ife facility
              through trusted motor park logistics networks nationwide.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {DISPATCH_RECORDS.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ position: 'relative', height: '170px', width: '100%', background: '#e2e8f0' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(15,23,42,0.85)',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {item.tag}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(15,67,31,0.9)',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {item.time}
                  </span>
                </div>
                <div style={{ padding: '16px' }}>
                  <h4
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.4,
                      marginBottom: '8px',
                    }}
                  >
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE FARM ESTIMATOR TOOL ───────────────────────── */}
      <section
        style={{
          padding: '5rem 0',
          background: 'linear-gradient(135deg, #082e11 0%, #145220 100%)',
          color: '#ffffff',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#f6d37d',
                background: 'rgba(217,168,65,0.2)',
                border: '1px solid rgba(217,168,65,0.3)',
                padding: '4px 12px',
                borderRadius: '4px',
                display: 'inline-block',
                marginBottom: '10px',
              }}
            >
              Interactive Equipment Calculator
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.25,
                marginBottom: '12px',
              }}
            >
              Cage, Drinker & Feed Volume Estimator
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              Input your target herd size to instantly project cage units, automatic watering nipples, daily/monthly feed
              allowances, and fabrication costs.
            </p>
          </div>

          <FarmEstimatorWidget />
        </div>
      </section>

      {/* ── CATERING SHOWCASE BANNER ──────────────────────────────── */}
      <section style={{ padding: '4.5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              background: '#0f172a',
              color: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
            }}
          >
            <div className="catering-text-pad" style={{ padding: '3.5rem 3rem' }}>
              <span
                style={{
                  background: 'rgba(217,168,65,0.25)',
                  color: '#f6d37d',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '14px',
                }}
              >
                VIP Culinary & Banquet Catering
              </span>

              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.75rem, 3vw, 2.3rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '14px',
                }}
              >
                Gourmet Rabbit Meat for Weddings, Burials & Banquets
              </h2>

              <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: '2rem' }}>
                Herb-marinated barbecue skewers and golden wood-roasted whole rabbit prepared by our seasoned farm chefs.
                Low in cholesterol, tender, and exquisite. Custom tasting and bulk orders available.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  href="/catering"
                  style={{
                    background: '#d9a841',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    padding: '12px 22px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                  }}
                >
                  Request Catering Quote →
                </Link>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    'Hello RABBITRY Catering Team, I would like to get a quotation for an upcoming event.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#25d366',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                  }}
                >
                  Chat with Chef on WhatsApp
                </a>
              </div>
            </div>

            <div style={{ position: 'relative', height: '100%', minHeight: '340px' }}>
              <img
                src="/images/roasted-meat.jpg"
                alt="Golden Roasted Whole Rabbit Catering"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── VERIFIED CUSTOMER REVIEWS ─────────────────────────────── */}
      <section style={{ padding: '4.5rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#082e11',
                background: '#e2f4e8',
                padding: '4px 12px',
                borderRadius: '4px',
                display: 'inline-block',
                marginBottom: '10px',
              }}
            >
              Client Endorsements
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.25,
              }}
            >
              Trusted by Commercial Farmers & Households
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '2rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ color: '#d9a841', fontSize: '1.1rem', marginBottom: '12px' }}>
                  {'★'.repeat(t.rating)}
                </div>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#334155',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                    marginBottom: '1.5rem',
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#082e11', fontWeight: 600 }}>{t.role}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORPORATE CONTACT & LOCATION STRIP ───────────────────── */}
      <section style={{ background: '#082e11', color: '#ffffff', padding: '3.5rem 0' }}>
        <div className="container">
          <div
            className="contact-strip-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#f6d37d',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Danethicals Limited Headquarters
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
                Visit Our Rabbit Farm in Ile-Ife
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                {FARM_LOCATION} · Direct Calls: {PHONE_1} / {PHONE_2}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href={`tel:${PHONE_1}`}
                style={{
                  background: '#d9a841',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                }}
              >
                Call Farm Manager
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  'Hello Danethicals Rabbitry, I would like to schedule a visit or place an order.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25d366',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                }}
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Capture Popup */}
      {showLeadModal && <LeadMagnetModal onClose={() => setShowLeadModal(false)} />}
    </>
  );
}
