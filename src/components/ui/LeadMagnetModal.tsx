'use client';

import { useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function LeadMagnetModal({ onClose }: Props) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setLoading(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'lead-magnet' }),
      });
      setStep('success');
    } catch {
      setStep('success'); // Show success anyway for UX
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: 480,
        overflow: 'hidden',
        animation: 'fadeInUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        position: 'relative',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', color: '#666', zIndex: 1,
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#0d3317,#1a5c2a)',
          padding: '2.5rem 2rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-30%', left: '-10%',
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(201,146,26,0.12)',
          }} />
          <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>📘</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(201,146,26,0.2)', border: '1px solid rgba(201,146,26,0.4)',
            borderRadius: '999px', padding: '0.25rem 0.875rem', marginBottom: '0.75rem',
          }}>
            <span style={{ color: 'var(--brand-gold-light)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              FREE Download
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            color: '#fff', fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.2,
            marginBottom: '0.5rem',
          }}>
            How to Start Small-Scale Rabbit Farming in Nigeria
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>
            A comprehensive PDF guide — yours FREE!
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '2rem' }}>
          {step === 'form' ? (
            <>
              <ul style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  '✅ Best rabbit breeds for Nigerian climate',
                  '✅ Cage setup & feeding schedules',
                  '✅ Vaccination & healthcare guide',
                  '✅ How to find buyers & set prices',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--gray-700)', fontWeight: 500 }}>{item}</li>
                ))}
              </ul>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adebayo Olamide"
                    className="form-input"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="08012345678"
                    className="form-input"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address (optional)</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="form-input"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  {loading ? '⏳ Sending...' : '📥 Send Me the Free Guide!'}
                </button>
                <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', textAlign: 'center', lineHeight: 1.5 }}>
                  By submitting, you agree to receive farming tips and updates from RABBITRY via WhatsApp. No spam — unsubscribe anytime.
                </p>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.35rem', fontWeight: 700, color: 'var(--brand-green-dark)', marginBottom: '0.75rem' }}>
                You&apos;re In!
              </h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Thank you, <strong>{form.name}</strong>! We&apos;ll send your FREE rabbit farming guide to your WhatsApp shortly.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
                While you wait, browse our current stock — new arrivals weekly! 🐇
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <a href="/shop" className="btn btn-primary">Browse Shop</a>
                <button onClick={onClose} className="btn btn-outline">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
