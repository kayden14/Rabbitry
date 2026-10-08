'use client';

import { useState } from 'react';
import { calculateEstimate, formatNaira } from '@/lib/utils';
import { EstimatorResult } from '@/types';

export default function FarmEstimatorWidget() {
  const [count, setCount] = useState(10);
  const [result, setResult] = useState<EstimatorResult | null>(null);

  const handleEstimate = () => {
    if (count < 1) return;
    setResult(calculateEstimate(count));
  };

  return (
    <div style={{
      maxWidth: 800,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: result ? '1fr 1fr' : '1fr',
      gap: '2rem',
      alignItems: 'start',
    }}>
      {/* Input Card */}
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
      }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Enter Your Rabbit Count
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          How many rabbits are you planning to raise?
        </p>

        {/* Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>Rabbit Count</span>
            <span style={{
              background: 'var(--brand-gold)',
              color: '#fff',
              fontWeight: 700,
              padding: '0.2rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.95rem',
            }}>{count} rabbits</span>
          </div>
          <input
            type="range"
            min={1}
            max={200}
            value={count}
            onChange={e => setCount(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: 6,
              appearance: 'none',
              background: `linear-gradient(to right, var(--brand-gold) ${(count/200)*100}%, rgba(255,255,255,0.2) ${(count/200)*100}%)`,
              borderRadius: 3,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
            <span>1</span><span>50</span><span>100</span><span>200</span>
          </div>
        </div>

        {/* Manual input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', display: 'block', marginBottom: '0.4rem' }}>Or type exact number:</label>
          <input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="form-input"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
          />
        </div>

        <button onClick={handleEstimate} className="btn btn-gold btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
          📐 Calculate My Farm Needs
        </button>
      </div>

      {/* Results Card */}
      {result && (
        <div style={{
          background: '#fff',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          animation: 'fadeInUp 0.5s ease',
        }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--brand-green-dark)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Your Farm Plan
          </h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem', marginBottom: '1.75rem' }}>
            For {result.rabbitCount} rabbit{result.rabbitCount > 1 ? 's' : ''}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '🏗️', label: 'Cage Type', value: result.cageRecommendation },
              { icon: '📦', label: 'Cages Needed', value: `${result.cageCount} cages` },
              { icon: '💧', label: 'Nipple Drinkers', value: `${result.drinkerCount} drinkers` },
              { icon: '🌾', label: 'Daily Feed', value: `${result.feedVolumeKgPerDay} kg/day` },
              { icon: '📅', label: 'Monthly Feed', value: `${result.feedVolumeKgPerMonth} kg/month` },
              { icon: '💰', label: 'Est. Cage Budget', value: result.estimatedCageCost },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.875rem 1rem',
                background: i % 2 === 0 ? 'var(--brand-cream)' : '#fff',
                borderRadius: 'var(--radius)',
              }}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-800)' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(26,92,42,0.07)',
            borderRadius: 'var(--radius)',
            borderLeft: '3px solid var(--brand-green)',
          }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
              💡 <strong>Pro Tip:</strong> Order your cages, drinkers, and feed troughs from RABBITRY for guaranteed quality and proper sizing for your rabbit count.
            </p>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <a
              href="/shop?cat=equipment"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}
            >
              Shop Equipment
            </a>
            <a
              href={`https://wa.me/2347052335766?text=${encodeURIComponent(`Hello RABBITRY, I need equipment for ${result.rabbitCount} rabbits: ${result.cageCount} cages and ${result.drinkerCount} drinkers. Please advise.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
