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
      triggerDownload();
    }
  };

  return (
    <>
      <style>{`
        @keyframes lmFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lmSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lmSheetUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }

        .lm-overlay {
          position: fixed;
          inset: 0;
          z-index: 9000;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: lmFadeIn 0.25s ease;
        }

        .lm-modal {
          background: #ffffff;
          border-radius: 18px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          overflow-x: hidden;
          box-shadow: 0 25px 60px rgba(0,0,0,0.32);
          animation: lmSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          scrollbar-width: thin;
          scrollbar-color: #ccc transparent;
        }
        .lm-modal::-webkit-scrollbar { width: 4px; }
        .lm-modal::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

        .lm-close {
          position: absolute;
          top: 0.875rem;
          right: 0.875rem;
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 50%;
          background: rgba(0,0,0,0.22);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: #ffffff;
          cursor: pointer;
          z-index: 3;
          line-height: 1;
        }

        .lm-header {
          background: linear-gradient(135deg, #092813 0%, #155724 100%);
          padding: 2.25rem 2rem 1.75rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .lm-body {
          padding: 1.75rem 2rem 2rem;
        }

        .lm-action-col {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1.25rem;
        }

        .lm-action-col a,
        .lm-action-col button {
          min-height: 46px;
        }

        .lm-bottom-btns {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ── Tablet ── */
        @media (max-width: 600px) {
          .lm-modal { max-width: 100%; }
        }

        /* ── Phone: slide up as bottom sheet ── */
        @media (max-width: 480px) {
          .lm-overlay {
            padding: 0;
            align-items: flex-end;
          }
          .lm-modal {
            max-height: 92vh;
            border-radius: 20px 20px 0 0;
            animation: lmSheetUp 0.32s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .lm-header {
            padding: 1.5rem 1.25rem 1.25rem;
          }
          .lm-header .lm-emoji { font-size: 2rem !important; }
          .lm-header h2 { font-size: 1.1rem !important; }
          .lm-header p  { font-size: 0.8rem !important; }
          .lm-body { padding: 1.25rem 1.25rem 2rem; }
          .lm-bottom-btns { flex-direction: column; }
          .lm-bottom-btns > * { width: 100% !important; justify-content: center !important; }
        }

        /* ── Very small phones ── */
        @media (max-width: 360px) {
          .lm-header { padding: 1.25rem 1rem 1rem; }
          .lm-body   { padding: 1rem 1rem 1.5rem; }
          .lm-header h2 { font-size: 1rem !important; }
        }
      `}</style>

      <div
        className="lm-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="lm-modal">
          {/* Close button */}
          <button onClick={onClose} className="lm-close" aria-label="Close modal">
            ×
          </button>

          {/* ── Header ── */}
          <div className="lm-header">
            {/* Decorative blob */}
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                left: '-10%',
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: 'rgba(217,168,65,0.15)',
                pointerEvents: 'none',
              }}
            />

            <div className="lm-emoji" style={{ fontSize: '2.75rem', marginBottom: '0.4rem' }}>📘</div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(217,168,65,0.22)',
                border: '1px solid rgba(217,168,65,0.5)',
                borderRadius: '999px',
                padding: '0.2rem 0.875rem',
                marginBottom: '0.65rem',
              }}
            >
              <span
                style={{
                  color: '#f6d37d',
                  fontSize: '0.72rem',
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
                marginBottom: '0.35rem',
              }}
            >
              Commercial &amp; Small-Scale Rabbit Farming Handbook
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.84rem' }}>
              Comprehensive 2026 Nigerian Agri-Business Guide — 100% Free
            </p>
          </div>

          {/* ── Body ── */}
          <div className="lm-body">
            {step === 'form' ? (
              <>
                <ul
                  style={{
                    marginBottom: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
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
                      style={{ fontSize: '0.81rem', color: '#334155', fontWeight: 500, lineHeight: 1.45 }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
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
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
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
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
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
                      padding: '13px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '0.2rem',
                      boxShadow: '0 4px 15px rgba(13,51,23,0.3)',
                      minHeight: '48px',
                      width: '100%',
                    }}
                  >
                    {loading ? '⏳ Preparing Guide...' : '📥 Download Free PDF Guide Now'}
                  </button>

                  <div style={{ textAlign: 'center' }}>
                    <a
                      href="/api/guide/download"
                      download="Danethicals-Rabbit-Farming-Guide-Nigeria.pdf"
                      style={{ fontSize: '0.78rem', color: '#0d3317', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      Or click here for direct download without form
                    </a>
                  </div>

                  <p style={{ fontSize: '0.71rem', color: '#64748b', textAlign: 'center', lineHeight: 1.4, margin: 0 }}>
                    By submitting, you agree to receive agricultural insights from Danethicals Rabbitry via WhatsApp. No spam guaranteed.
                  </p>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '0.75rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.65rem' }}>🎉</div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#0d3317',
                    marginBottom: '0.4rem',
                  }}
                >
                  Download Started!
                </h3>
                <p style={{ color: '#475569', lineHeight: 1.6, marginBottom: '1.1rem', fontSize: '0.88rem' }}>
                  Thank you, <strong>{form.name}</strong>! Your download has started automatically.
                </p>

                {/* Stacked action buttons */}
                <div className="lm-action-col">
                  <a
                    href="/api/guide/download"
                    download="Danethicals-Rabbit-Farming-Guide-Nigeria.pdf"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: '#0d3317',
                      color: '#ffffff',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.9rem',
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
                      display: 'flex',
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
                      display: 'flex',
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

                <div className="lm-bottom-btns">
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
                      minHeight: '40px',
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
    </>
  );
}
