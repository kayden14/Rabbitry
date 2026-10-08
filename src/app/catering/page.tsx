'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { WHATSAPP_NUMBER, PHONE_1, PHONE_2 } from '@/lib/utils';

const EVENT_TYPES = ['Wedding', 'Burial', 'Graduation', 'Birthday', 'Corporate Event', 'Other'];

export default function CateringPage() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', eventType: '', eventDate: '',
    guestCount: '', location: '', message: '', preferredMenu: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, source: 'catering-inquiry', inquiryDetails: form.message }),
    }).catch(() => {});
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg,#4a2810,#7a4f2d)',
          padding: '6rem 0 4rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.04) 1px,transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(201,146,26,0.2)', border: '1px solid rgba(201,146,26,0.4)', borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '1.25rem', color: 'var(--brand-gold-light)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              🍖 Premium Event Catering
            </span>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Rabbit Cuisine for Your<br/>
              <span style={{ color: 'var(--brand-gold-light)' }}>Special Events</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 600, margin: '0 auto 2.5rem' }}>
              From intimate birthday dinners to large wedding banquets — we bring premium rabbit cuisine to your table. Marinated BBQ skewers and golden roasted whole rabbit, freshly prepared for your event.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <a href="#inquiry" className="btn btn-gold btn-lg">Get a Free Quote</a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello RABBITRY, I need a catering quote for my event. Can we discuss?')}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">Chat on WhatsApp</a>
            </div>
          </div>
        </div>

        {/* Menu */}
        <section className="section" style={{ background: '#fff' }}>
          <div className="container">
            <div className="section-header">
              <div className="eyebrow"><span>🍽️</span> Our Catering Menu</div>
              <h2 className="display-md">Signature Rabbit Dishes</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '2rem' }}>
              {[
                {
                  image: '/images/bbq-skewers.jpg',
                  title: 'Herb-Marinated BBQ Rabbit Skewers',
                  desc: 'Tender rabbit meat marinated for 24 hours in our signature West African spice blend — suya pepper, ginger, garlic, and secret herbs. Charcoal-grilled to perfection and served on wooden skewers.',
                  serving: '10 skewers per tray (serves 5 guests)',
                  leadTime: '3 days minimum',
                  startPrice: '₦15,000/tray',
                  events: ['Birthdays', 'Graduations', 'Corporate Events'],
                },
                {
                  image: '/images/roasted-meat.jpg',
                  title: 'Golden Roasted Whole Rabbit',
                  desc: 'A luxurious centrepiece dish — whole rabbit slow-roasted over 4 hours with aromatic herbs, citrus, and a golden honey-spice glaze. Served on a decorative platter with garnishes. A talking-point dish for high-table settings.',
                  serving: '1 whole rabbit serves 3–4 guests',
                  leadTime: '5 days minimum',
                  startPrice: '₦25,000/rabbit',
                  events: ['Weddings', 'Burials', 'Corporate Dinners', 'Graduation Parties'],
                },
              ].map((dish, i) => (
                <div key={i} className="card" style={{ overflow: 'hidden', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)' }}>
                  <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                    <img
                      src={dish.image}
                      alt={dish.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%)' }} />
                    <h3 style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                      {dish.title}
                    </h3>
                  </div>
                  <div style={{ padding: '1.75rem' }}>
                    <p style={{ color: 'var(--gray-600)', lineHeight: 1.75, marginBottom: '1.25rem', fontSize: '0.9rem' }}>{dish.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      {[
                        { label: '🍽️ Serving Size', val: dish.serving },
                        { label: '⏰ Lead Time', val: dish.leadTime },
                        { label: '💰 Starting From', val: dish.startPrice },
                      ].map(r => (
                        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.4rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                          <span style={{ color: 'var(--gray-500)' }}>{r.label}</span>
                          <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{r.val}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      {dish.events.map(ev => (
                        <span key={ev} style={{ background: 'var(--brand-cream)', color: 'var(--brand-earth)', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>{ev}</span>
                      ))}
                    </div>
                    <a href="#inquiry" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                      Request This Dish
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry" className="section" style={{ background: 'var(--brand-cream)' }}>
          <div className="container">
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <div className="section-header">
                <div className="eyebrow"><span>📋</span> Free Quote</div>
                <h2 className="display-sm">Get Your Catering Quote</h2>
                <p>Fill out the form below and we&apos;ll contact you within 24 hours with a personalised quote.</p>
              </div>

              {submitted ? (
                <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '3rem', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-green-dark)', marginBottom: '0.75rem' }}>Inquiry Sent!</h3>
                  <p style={{ color: 'var(--gray-600)', lineHeight: 1.7 }}>
                    Thank you! Our catering team will contact you within 24 hours. For faster response, WhatsApp us directly.
                  </p>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello RABBITRY, I just submitted a catering inquiry on your website for my ' + form.eventType + '. Can we discuss?')}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg" style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
                    Follow Up on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Your Name *</label>
                      <input required className="form-input" placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone / WhatsApp *</label>
                      <input required type="tel" className="form-input" placeholder="08012345678" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" placeholder="optional" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Event Type *</label>
                      <select required className="form-input form-select" value={form.eventType} onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))}>
                        <option value="">Select event type...</option>
                        {EVENT_TYPES.map(et => <option key={et} value={et}>{et}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Event Date *</label>
                      <input required type="date" className="form-input" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Approx. Guest Count *</label>
                      <input required type="number" className="form-input" placeholder="e.g. 200" value={form.guestCount} onChange={e => setForm(f => ({ ...f, guestCount: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Event Location / State</label>
                      <input className="form-input" placeholder="e.g. Ile-Ife, Osun" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Menu Item(s)</label>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      {['BBQ Skewers', 'Roasted Whole Rabbit', 'Both'].map(item => (
                        <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                          <input type="radio" name="menu" value={item} onChange={e => setForm(f => ({ ...f, preferredMenu: e.target.value }))} />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Additional Message</label>
                    <textarea className="form-input form-textarea" placeholder="Any special requirements, dietary needs, or questions..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                    📋 Submit Catering Inquiry
                  </button>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', paddingTop: '0.5rem' }}>
                    <a href={`tel:${PHONE_1}`} style={{ color: 'var(--brand-green)', fontSize: '0.875rem', fontWeight: 600 }}>📞 {PHONE_1}</a>
                    <a href={`tel:${PHONE_2}`} style={{ color: 'var(--brand-green)', fontSize: '0.875rem', fontWeight: 600 }}>📞 {PHONE_2}</a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
