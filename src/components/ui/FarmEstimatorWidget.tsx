'use client';

import { useState, useRef } from 'react';
import { calculateEstimate, formatNaira, WHATSAPP_NUMBER } from '@/lib/utils';
import { EstimatorResult } from '@/types';

export default function FarmEstimatorWidget() {
  const [count, setCount] = useState(10);
  const [result, setResult] = useState<EstimatorResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleEstimate = () => {
    if (count < 1) return;
    setResult(calculateEstimate(count));
    // Scroll result into view on mobile after a short paint delay
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  return (
    <>
      <style>{`
        .fe-wrap {
          max-width: 820px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: ${result ? '1fr 1fr' : '1fr'};
          gap: 2rem;
          align-items: start;
        }
        .fe-input-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
        }
        .fe-result-card {
          background: #fff;
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          animation: fadeInUp 0.5s ease;
        }
        .fe-result-btns {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.25rem;
          flex-wrap: wrap;
        }
        .fe-result-btns a {
          flex: 1;
          min-width: 120px;
          justify-content: center;
          font-size: 0.82rem;
        }

        /* Range slider thumb — bigger on touch */
        .fe-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          outline: none;
          cursor: pointer;
          touch-action: pan-y;
        }
        .fe-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--brand-gold);
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          cursor: pointer;
          border: 3px solid #fff;
        }
        .fe-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--brand-gold);
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          cursor: pointer;
          border: 3px solid #fff;
        }

        /* Tablet */
        @media (max-width: 768px) {
          .fe-wrap {
            grid-template-columns: 1fr !important;
            gap: 1.5rem;
          }
          .fe-input-card, .fe-result-card {
            padding: 1.75rem;
          }
        }

        /* Phone */
        @media (max-width: 480px) {
          .fe-input-card, .fe-result-card {
            padding: 1.25rem;
          }
          .fe-result-btns {
            flex-direction: column;
          }
          .fe-result-btns a {
            flex: unset;
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          .fe-input-card, .fe-result-card {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="fe-wrap">
        {/* ── Input Card ── */}
        <div className="fe-input-card">
          <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Enter Your Rabbit Count
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            How many rabbits are you planning to raise?
          </p>

          {/* Slider */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>Rabbit Count</span>
              <span style={{
                background: 'var(--brand-gold)',
                color: '#fff',
                fontWeight: 700,
                padding: '0.25rem 0.875rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.95rem',
                minWidth: '90px',
                textAlign: 'center',
              }}>
                {count} rabbits
              </span>
            </div>
            <input
              type="range"
              className="fe-slider"
              min={1}
              max={200}
              value={count}
              onChange={e => setCount(parseInt(e.target.value))}
              style={{
                background: `linear-gradient(to right, var(--brand-gold) ${(count / 200) * 100}%, rgba(255,255,255,0.2) ${(count / 200) * 100}%)`,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
              <span>1</span><span>50</span><span>100</span><span>200</span>
            </div>
          </div>

          {/* Manual number input */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Or type exact number:
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="form-input"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '1rem',
                padding: '12px 14px',
              }}
            />
          </div>

          <button
            onClick={handleEstimate}
            className="btn btn-gold btn-lg"
            style={{ width: '100%', justifyContent: 'center', minHeight: '50px' }}
          >
            📐 Calculate My Farm Needs
          </button>
        </div>

        {/* ── Results Card ── */}
        {result && (
          <div className="fe-result-card" ref={resultRef}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--brand-green-dark)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Your Farm Plan
            </h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              For {result.rabbitCount} rabbit{result.rabbitCount > 1 ? 's' : ''}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { icon: '🏗️', label: 'Cage Type',      value: result.cageRecommendation },
                { icon: '📦', label: 'Cages Needed',   value: `${result.cageCount} cages` },
                { icon: '💧', label: 'Nipple Drinkers',value: `${result.drinkerCount} drinkers` },
                { icon: '🌾', label: 'Daily Feed',      value: `${result.feedVolumeKgPerDay} kg/day` },
                { icon: '📅', label: 'Monthly Feed',    value: `${result.feedVolumeKgPerMonth} kg/month` },
                { icon: '💰', label: 'Est. Cage Budget',value: result.estimatedCageCost },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.875rem 1rem',
                  background: i % 2 === 0 ? 'var(--brand-cream)' : '#fff',
                  borderRadius: 'var(--radius)',
                }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-800)', wordBreak: 'break-word' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '1.25rem',
              padding: '1rem',
              background: 'rgba(26,92,42,0.07)',
              borderRadius: 'var(--radius)',
              borderLeft: '3px solid var(--brand-green)',
            }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>
                💡 <strong>Pro Tip:</strong> Order your cages, drinkers, and feed troughs from RABBITRY for guaranteed quality and proper sizing for your rabbit count.
              </p>
            </div>

            <div className="fe-result-btns">
              <a
                href="/shop?cat=equipment"
                className="btn btn-primary"
              >
                Shop Equipment
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hello RABBITRY, I need equipment for ${result.rabbitCount} rabbits: ${result.cageCount} cages and ${result.drinkerCount} drinkers. Please advise.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                Order via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
