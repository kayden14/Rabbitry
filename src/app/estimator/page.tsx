'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatNaira, WHATSAPP_NUMBER, PHONE_1, PHONE_2 } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';
import { allProducts } from '@/data/products';
import Link from 'next/link';

export default function EstimatorPage() {
  const [rabbitCount, setRabbitCount] = useState<number>(20);
  const [purpose, setPurpose] = useState<'commercial-meat' | 'breeding-stock' | 'dual'>('commercial-meat');
  const [cageTier, setCageTier] = useState<'standard' | 'heavy-duty'>('heavy-duty');
  const [includeFeeders, setIncludeFeeders] = useState(true);
  const [includeDrinkers, setIncludeDrinkers] = useState(true);
  const [copied, setCopied] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  // Calculations
  const stats = useMemo(() => {
    const rabbits = Math.max(1, rabbitCount);
    // 2 rabbits per compartment or 1 breeder per compartment
    const compartmentsNeeded = purpose === 'breeding-stock' ? rabbits : Math.ceil(rabbits * 0.8);
    // Typical 4-hole cage module
    const cagesNeeded = Math.ceil(compartmentsNeeded / 4);
    
    // Drinker nipples: 1 per compartment + reserves
    const drinkersNeeded = compartmentsNeeded;
    
    // Feed: 130g to 150g per day per mature rabbit
    const feedPerDayKg = Math.round((rabbits * 0.14) * 10) / 10;
    const feedPerMonthKg = Math.round(feedPerDayKg * 30);
    const feedBags25kg = Math.ceil(feedPerMonthKg / 25);

    // Organic manure & urine yield estimates
    const manurePerDayKg = Math.round((rabbits * 0.08) * 10) / 10;
    const urinePerDayLiters = Math.round((rabbits * 0.12) * 10) / 10;

    // Costs
    const cageUnitCost = cageTier === 'heavy-duty' ? 85000 : 55000;
    const cagesTotalCost = cagesNeeded * cageUnitCost;
    const drinkersCost = includeDrinkers ? drinkersNeeded * 1200 : 0;
    const feedersCost = includeFeeders ? drinkersNeeded * 1800 : 0;
    const initialFeedCost = feedBags25kg * 12500; // ~12.5k per 25kg bag

    const totalEquipmentOutlay = cagesTotalCost + drinkersCost + feedersCost;
    const totalSetupWithFeed = totalEquipmentOutlay + initialFeedCost;

    return {
      rabbits,
      compartmentsNeeded,
      cagesNeeded,
      drinkersNeeded,
      feedPerDayKg,
      feedPerMonthKg,
      feedBags25kg,
      manurePerDayKg,
      urinePerDayLiters,
      cageUnitCost,
      cagesTotalCost,
      drinkersCost,
      feedersCost,
      initialFeedCost,
      totalEquipmentOutlay,
      totalSetupWithFeed,
    };
  }, [rabbitCount, purpose, cageTier, includeFeeders, includeDrinkers]);

  const handleAddEquipmentToCart = () => {
    // Find matching cage in product catalog
    const cageProduct = allProducts.find((p) => p.slug.includes('cage') || p.category === 'equipment');
    if (cageProduct) {
      addItem(cageProduct, stats.cagesNeeded);
      alert(`Added ${stats.cagesNeeded}x ${cageProduct.name} to your Cart!`);
    } else {
      alert(`Setup calculation ready! Proceed to WhatsApp or Shop to complete equipment purchase.`);
    }
  };

  const whatsappMessage = `Hello RABBITRY Danethicals,%0A%0AI used your Farm Sizing Estimator for *${stats.rabbits} Rabbits* (${purpose.replace('-', ' ')}):%0A- Recommended Cages: ${stats.cagesNeeded} units (${cageTier} galvanized)%0A- Automatic Drinker Nipples: ${stats.drinkersNeeded} units%0A- Est. Monthly Feed: ${stats.feedPerMonthKg} kg (${stats.feedBags25kg} bags)%0A- Est. Equipment Cost: ${formatNaira(stats.totalEquipmentOutlay)}%0A%0APlease provide an official quotation and delivery timeline to my state.`;

  const copySummary = () => {
    const text = `RABBITRY Farm Estimate for ${stats.rabbits} Rabbits:
• Cages: ${stats.cagesNeeded} x 4-Hole Units (${formatNaira(stats.cagesTotalCost)})
• Drinkers: ${stats.drinkersNeeded} Nipples (${formatNaira(stats.drinkersCost)})
• Monthly Feed: ${stats.feedPerMonthKg}kg (${stats.feedBags25kg} x 25kg bags)
• Total Equipment Outlay: ${formatNaira(stats.totalEquipmentOutlay)}
Consult Danethicals Rabbitry: ${PHONE_1}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--brand-cream)', paddingBottom: '5rem' }}>
        <style>{`
          .est-hero {
            background: linear-gradient(135deg, var(--brand-green-dark) 0%, var(--brand-green) 100%);
            color: #fff;
            padding: clamp(2.5rem, 5vw, 4rem) 1.25rem clamp(2.5rem, 4vw, 3.5rem);
            text-align: center;
            position: relative;
          }
          .est-container {
            max-width: 1200px;
            margin: -2.5rem auto 0;
            position: relative;
            z-index: 10;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .est-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
            gap: 2rem;
            align-items: start;
          }
          .est-card {
            background: #fff;
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            border: 1px solid rgba(0,0,0,0.06);
            padding: 2.25rem;
            min-width: 0;
          }
          .est-split-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }
          .est-metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 1.75rem;
          }
          .est-btn-subrow {
            display: flex;
            gap: 0.75rem;
          }
          .est-banner {
            background: linear-gradient(135deg, #1A5C2A 0%, #0d3815 100%);
            color: #fff;
            border-radius: var(--radius-xl);
            padding: 1.75rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1.25rem;
          }
          .est-banner-btns {
            display: flex;
            gap: 0.75rem;
          }
          @media (max-width: 900px) {
            .est-container {
              margin-top: 1rem;
            }
            .est-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
            .est-card {
              padding: 1.5rem;
            }
          }
          @media (max-width: 560px) {
            .est-card {
              padding: 1.15rem;
            }
            .est-split-2 {
              grid-template-columns: 1fr;
            }
            .est-metrics-grid {
              grid-template-columns: 1fr;
            }
            .est-btn-subrow {
              flex-direction: column;
            }
            .est-banner {
              padding: 1.25rem;
              flex-direction: column;
              align-items: stretch;
            }
            .est-banner-btns {
              flex-direction: column;
            }
            .est-banner-btns a {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
        {/* Hero Section */}
        <div className="est-hero">
          <div className="container" style={{ maxWidth: 840 }}>
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(217, 168, 65, 0.25)',
              border: '1px solid var(--brand-gold)',
              color: 'var(--brand-gold-light)',
              fontSize: '0.825rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1rem',
            }}>
              Interactive Farm Planner
            </span>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.85rem)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}>
              Rabbit Farm & Equipment Sizing Estimator
            </h1>
            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: 680,
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Calculate exact cage capacity, automated watering nipples, feed consumption, and organic fertilizer yield tailored to Nigerian commercial rabbit standards.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="est-container">
          <div className="est-grid">
            {/* Input Configuration Card */}
            <div className="est-card">
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--brand-green-dark)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}>
                <span>⚙️</span> Farm Parameters
              </h2>

              {/* Rabbit Slider */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-800)' }}>
                    Target Rabbit Flock Size
                  </label>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--brand-green)',
                    background: 'rgba(26,92,42,0.1)',
                    padding: '0.2rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    {rabbitCount} rabbits
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={250}
                  step={2}
                  value={rabbitCount}
                  onChange={(e) => setRabbitCount(parseInt(e.target.value) || 2)}
                  style={{
                    width: '100%',
                    accentColor: 'var(--brand-green)',
                    cursor: 'pointer',
                    height: 8,
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-500)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                  <span>2 (Backyard starter)</span>
                  <span>50 (Semi-commercial)</span>
                  <span>150</span>
                  <span>250+ (Commercial)</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {[6, 12, 24, 50, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRabbitCount(preset)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      border: rabbitCount === preset ? '2px solid var(--brand-green)' : '1px solid var(--gray-300)',
                      background: rabbitCount === preset ? 'rgba(26,92,42,0.08)' : '#fff',
                      color: rabbitCount === preset ? 'var(--brand-green)' : 'var(--gray-700)',
                      fontWeight: 600,
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                    }}
                  >
                    {preset} Rabbits
                  </button>
                ))}
              </div>

              {/* Production Focus */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.6rem' }}>
                  Primary Farming Objective
                </label>
                <div className="est-split-2">
                  <button
                    type="button"
                    onClick={() => setPurpose('commercial-meat')}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius)',
                      border: purpose === 'commercial-meat' ? '2px solid var(--brand-green)' : '1px solid var(--gray-300)',
                      background: purpose === 'commercial-meat' ? 'rgba(26,92,42,0.06)' : '#fff',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-900)' }}>🍖 Meat Production</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>Optimized colony & fattening spaces</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose('breeding-stock')}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius)',
                      border: purpose === 'breeding-stock' ? '2px solid var(--brand-green)' : '1px solid var(--gray-300)',
                      background: purpose === 'breeding-stock' ? 'rgba(26,92,42,0.06)' : '#fff',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-900)' }}>🐇 Purebred Breeding</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>Individual buck/doe compartments</div>
                  </button>
                </div>
              </div>

              {/* Cage Material Spec */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.6rem' }}>
                  Cage Build Quality
                </label>
                <div className="est-split-2">
                  <button
                    type="button"
                    onClick={() => setCageTier('heavy-duty')}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius)',
                      border: cageTier === 'heavy-duty' ? '2px solid var(--brand-green)' : '1px solid var(--gray-300)',
                      background: cageTier === 'heavy-duty' ? 'rgba(26,92,42,0.06)' : '#fff',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-900)' }}>🛡️ Heavy Galvanized</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>Commercial rust-proof wire (₦85,000/unit)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCageTier('standard')}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius)',
                      border: cageTier === 'standard' ? '2px solid var(--brand-green)' : '1px solid var(--gray-300)',
                      background: cageTier === 'standard' ? 'rgba(26,92,42,0.06)' : '#fff',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-900)' }}>⚙️ Standard Gauge</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>Economic residential starter (₦55,000/unit)</div>
                  </button>
                </div>
              </div>

              {/* Accessories Checkboxes */}
              <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.65rem' }}>
                  <input
                    type="checkbox"
                    checked={includeDrinkers}
                    onChange={(e) => setIncludeDrinkers(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: 'var(--brand-green)' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-800)', fontWeight: 500 }}>
                    Include Automated Stainless Nipple Drinkers (+₦1,200/hole)
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeFeeders}
                    onChange={(e) => setIncludeFeeders(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: 'var(--brand-green)' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-800)', fontWeight: 500 }}>
                    Include Waste-Proof J-Feeders (+₦1,800/hole)
                  </span>
                </label>
              </div>
            </div>

            {/* Calculations & Results Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
              <div className="est-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h2 style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--brand-green-dark)',
                    margin: 0,
                  }}>
                    📊 Equipment & Feed Output
                  </h2>
                  <span style={{
                    fontSize: '0.8rem',
                    background: 'var(--brand-gold-light)',
                    color: 'var(--brand-gold-dark)',
                    fontWeight: 700,
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    Verified Danethicals Formula
                  </span>
                </div>

                {/* Key Metric Highlights */}
                <div className="est-metrics-grid">
                  <div style={{
                    background: 'rgba(26,92,42,0.05)',
                    border: '1px solid rgba(26,92,42,0.15)',
                    borderRadius: 'var(--radius)',
                    padding: '1.25rem',
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)', display: 'block', marginBottom: '0.25rem' }}>
                      Cage Units Needed (4-Hole)
                    </span>
                    <span style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800, color: 'var(--brand-green)', wordBreak: 'break-word' }}>
                      {stats.cagesNeeded} <span style={{ fontSize: '1rem', fontWeight: 500 }}>units</span>
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'block', marginTop: '0.25rem' }}>
                      ({stats.compartmentsNeeded} separate compartments)
                    </span>
                  </div>

                  <div style={{
                    background: 'rgba(217,168,65,0.08)',
                    border: '1px solid rgba(217,168,65,0.25)',
                    borderRadius: 'var(--radius)',
                    padding: '1.25rem',
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)', display: 'block', marginBottom: '0.25rem' }}>
                      Estimated Equipment Cost
                    </span>
                    <span style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)', fontWeight: 800, color: 'var(--brand-gold-dark)', wordBreak: 'break-word' }}>
                      {formatNaira(stats.totalEquipmentOutlay)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'block', marginTop: '0.25rem' }}>
                      Fabricated at Parakin, Ile-Ife
                    </span>
                  </div>
                </div>

                {/* Detailed Table */}
                <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '1.5rem' }}>
                  <table style={{ width: '100%', minWidth: 320, borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--gray-200)', background: 'var(--brand-cream)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--gray-700)' }}>Fabricated Wire Cages</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--gray-900)', whiteSpace: 'nowrap' }}>
                          {stats.cagesNeeded} x {formatNaira(stats.cageUnitCost)} = {formatNaira(stats.cagesTotalCost)}
                        </td>
                      </tr>
                      {includeDrinkers && (
                        <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--gray-600)' }}>Automatic Drinker Nipples</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {stats.drinkersNeeded} units ({formatNaira(stats.drinkersCost)})
                          </td>
                        </tr>
                      )}
                      {includeFeeders && (
                        <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--gray-600)' }}>Galvanized J-Feeders</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {stats.drinkersNeeded} units ({formatNaira(stats.feedersCost)})
                          </td>
                        </tr>
                      )}
                      <tr style={{ borderBottom: '1px solid var(--gray-200)', background: '#fafafa' }}>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--gray-600)' }}>Daily Feed Requirement</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>
                          ~{stats.feedPerDayKg} kg / day
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--gray-600)' }}>30-Day Feed Allocation</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>
                          {stats.feedPerMonthKg} kg ({stats.feedBags25kg} bags)
                        </td>
                      </tr>
                      <tr style={{ background: 'rgba(26,92,42,0.03)' }}>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--gray-700)', fontWeight: 600 }}>Est. Organic Urine Harvest</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--brand-green)' }}>
                          ~{stats.urinePerDayLiters} L / day (~{Math.round(stats.urinePerDayLiters * 30)} L/mo)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem' }}
                  >
                    💬 Send Estimate to RABBITRY WhatsApp
                  </a>

                  <div className="est-btn-subrow">
                    <button
                      type="button"
                      onClick={handleAddEquipmentToCart}
                      className="btn btn-primary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}
                    >
                      🛒 Add Cages to Cart
                    </button>
                    <button
                      type="button"
                      onClick={copySummary}
                      className="btn btn-outline"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}
                    >
                      {copied ? '✅ Copied!' : '📋 Copy Summary'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Consultation / Advisory Banner */}
              <div className="est-banner">
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Need Custom Farm House Architecture?
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', maxWidth: 460 }}>
                    Danethicals provides on-site rabbitry installation, ventilation advice, and breeding stock supply anywhere in Osun, Oyo, Ogun, and Lagos States.
                  </p>
                </div>
                <div className="est-banner-btns">
                  <a
                    href={`tel:${PHONE_1}`}
                    className="btn btn-gold"
                    style={{ fontSize: '0.875rem', padding: '0.65rem 1.25rem' }}
                  >
                    📞 Call {PHONE_1}
                  </a>
                  <Link
                    href="/shop"
                    className="btn btn-ghost"
                    style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontSize: '0.875rem' }}
                  >
                    Browse All Stock
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
