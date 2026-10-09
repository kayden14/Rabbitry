'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WHATSAPP_NUMBER } from '@/lib/utils';

interface Props {
  onClose: () => void;
}

export default function LeadMagnetModal({ onClose }: Props) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  const triggerDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = '/api/guide/download';
      link.setAttribute('download', 'Danethicals-Rabbit-Farming-Guide-Nigeria.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open('/api/guide/download', '_blank');
    }
  };

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
    } catch {
      // Proceed even if background lead logging failed
    } finally {
      setLoading(false);
      setStep('success');
      // Automatically trigger download
      triggerDownload();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: 500,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          animation: 'fadeInUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.18)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            color: '#ffffff',
            cursor: 'pointer',
            zIndex: 2,
            transition: 'background 0.2s',
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #092813 0%, #155724 100%)',
            padding: '2.25rem 2rem 1.75rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              left: '-10%',
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: 'rgba(217,168,65,0.15)',
            }}
          />
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📘</div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(217,168,65,0.22)',
              border: '1px solid rgba(217,168,65,0.5)',
              borderRadius: '999px',
              padding: '0.25rem 0.9rem',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                color: '#f6d37d',
                fontSize: '0.74rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              FREE Instant PDF Download
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: '#ffffff',
              fontSize: '1.35rem',
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: '0.4rem',
            }}
          >
            Commercial &amp; Small-Scale Rabbit Farming Handbook
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
            Comprehensive 2026 Nigerian Agri-Business Guide — 100% Free
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem 2rem 2rem' }}>
          {step === 'form' ? (
            <>
              <ul
                style={{
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  listStyle: 'none',
                  padding: 0,
                }}
              >
                {[
                  '✅ Best high-yield breeds for Nigerian climate (New Zealand, Chinchilla)',
                  '✅ Battery cage blueprints & automated nipple drinker setup',
                  '✅ Daily feeding schedules & local forage selection',
                  '✅ Coccidiosis prevention & complete veterinary calendar',
                  '✅ Startup financial budget: 10-doe commercial foundation unit',
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.82rem',
                      color: '#334155',
                      fontWeight: 500,
                      lineHeight: 1.45,
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adebayo Olamide"
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08012345678"
                    className="form-input"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                    Email Address (optional)
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #0d3317 0%, #155724 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '0.25rem',
                    boxShadow: '0 4px 15px rgba(13,51,23,0.3)',
                  }}
                >
                  {loading ? '⏳ Preparing Guide...' : '📥 Download Free PDF Guide Now'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                  <a
                    href="/api/guide/download"
                    download="Danethicals-Rabbit-Farming-Guide-Nigeria.pdf"
                    style={{
                      fontSize: '0.78rem',
                      color: '#0d3317',
                      textDecoration: 'underline',
                      fontWeight: 600,
                    }}
                  >
                    Or click here for direct instant download without form
                  </a>
                </div>

                <p style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', lineHeight: 1.4, margin: '0.2rem 0 0' }}>
                  By submitting, you agree to receive agricultural insights and updates from Danethicals Rabbitry via WhatsApp. No spam guaranteed.
                </p>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🎉</div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#0d3317',
                  marginBottom: '0.5rem',
                }}
              >
                Download Started!
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                Thank you, <strong>{form.name}</strong>! Your download has started automatically.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <a
                  href="/api/guide/download"
                  download="Danethicals-Rabbit-Farming-Guide-Nigeria.pdf"
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#0d3317',
                    color: '#ffffff',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                  }}
                >
                  📥 Click Here If Download Didn&apos;t Start
                </a>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hello Danethicals Rabbitry! I just downloaded your Free Rabbit Farming Guide. My name is ${form.name || 'a fellow farmer'}. I'd like to ask a few questions about starting.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#25d366',
                    color: '#ffffff',
                    padding: '11px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  💬 Chat With Farm Specialist on WhatsApp
                </a>

                <Link
                  href="/guide"
                  onClick={onClose}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#f1f5f9',
                    color: '#0f172a',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  📖 Read Handbook Online
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <Link href="/shop" onClick={onClose} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                  Browse Shop Stock
                </Link>
                <button
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: '#64748b',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
