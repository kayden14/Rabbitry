'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/lib/cart-store';
import { formatNaira, WHATSAPP_NUMBER, BANK_NAME, BANK_ACCOUNT_NAME, BANK_ACCOUNT_NUMBER } from '@/lib/utils';
import { NIGERIAN_STATES } from '@/types';

type PaymentMethod = 'bank-transfer' | 'paystack' | 'whatsapp';

interface FormData {
  name: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  address: string;
  notes: string;
}

export default function CheckoutPage() {
  const { items, getSubtotal, getTotalItems, getWhatsAppMessage, clearCart } = useCartStore();
  const [payMethod, setPayMethod] = useState<PaymentMethod>('bank-transfer');
  const [form, setForm] = useState<FormData>({ name:'', phone:'', email:'', state:'', city:'', address:'', notes:'' });
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string>('');

  const subtotal = getSubtotal();
  const waMsg = getWhatsAppMessage();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (payMethod === 'whatsapp') {
      const msg = encodeURIComponent(
        `Hello RABBITRY 🐇, I want to place an order!\n\n` +
        `*Customer:* ${form.name}\n*Phone:* ${form.phone}\n` +
        `*Delivery:* ${form.city}, ${form.state}\n*Address:* ${form.address}\n\n` +
        `*Items:*\n${items.map(i => `• ${i.product.name} × ${i.quantity} = ${formatNaira(i.product.price * i.quantity)}`).join('\n')}\n\n` +
        `*Subtotal:* ${formatNaira(subtotal)}\n*(+ delivery fee to be confirmed)*`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
      setLoading(false);
      return;
    }

    // Save order
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({
            productId: i.product.id,
            productName: i.product.name,
            productCategory: i.product.category,
            quantity: i.quantity,
            unitPrice: i.product.price,
          })),
          subtotal,
          paymentMethod: payMethod,
        }),
      });
    } catch (err) {
      console.error('Order save failed:', err);
    } finally {
      setLoading(false);
    }

    if (payMethod === 'paystack') {
      // Paystack integration would go here with real public key
      alert('Paystack integration: Add your Paystack public key to enable online payments.');
      setStep('payment');
    } else {
      setStep('payment');
    }
  };

  const handlePaymentConfirm = () => {
    clearCart();
    setStep('success');
  };

  if (items.length === 0 && step === 'form') {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--gray-800)', marginBottom: '1rem' }}>Nothing to checkout</h2>
            <a href="/shop" className="btn btn-primary">Browse Products</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: 'linear-gradient(135deg,#0d3317,#1a5c2a)', padding: '4rem 0 3rem' }}>
          <div className="container">
            <h1 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '2.25rem', fontWeight: 800 }}>
              {step === 'form' ? 'Checkout' : step === 'payment' ? 'Complete Payment' : 'Order Confirmed! 🎉'}
            </h1>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {['form', 'payment', 'success'].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: step === s ? 'var(--brand-gold)' : ((['form','payment','success'].indexOf(step) > i) ? '#fff' : 'rgba(255,255,255,0.3)'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700,
                    color: ['form','payment','success'].indexOf(step) > i ? 'var(--brand-green)' : (step === s ? '#fff' : 'rgba(255,255,255,0.7)'),
                    transition: 'all 0.3s',
                  }}>
                    {(['form','payment','success'].indexOf(step) > i) ? '✓' : (i + 1)}
                  </div>
                  <span style={{ color: step === s ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: step === s ? 600 : 400 }}>
                    {s === 'form' ? 'Details' : s === 'payment' ? 'Payment' : 'Done'}
                  </span>
                  {i < 2 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>›</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '3rem 1.25rem' }}>
          {step === 'form' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'start' }}>
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {/* Customer Info */}
                <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    📋 Your Information
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input required placeholder="Adebayo Olamide" className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input required type="tel" placeholder="08012345678" className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Email (optional)</label>
                      <input type="email" placeholder="you@email.com" className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    📍 Delivery Location
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <select required className="form-input form-select" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                        <option value="">Select State...</option>
                        {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">City / Town *</label>
                      <input required placeholder="e.g. Ile-Ife" className="form-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Delivery Address *</label>
                      <textarea required placeholder="House no., street, nearest landmark..." className="form-input form-textarea" style={{ minHeight: 80 }} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Order Notes (optional)</label>
                      <textarea placeholder="Special requests, preferred breed age, etc." className="form-input form-textarea" style={{ minHeight: 70 }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.875rem',
                    background: 'rgba(201,146,26,0.08)',
                    borderRadius: 'var(--radius)',
                    borderLeft: '3px solid var(--brand-gold)',
                    fontSize: '0.8rem',
                    color: 'var(--gray-600)',
                    lineHeight: 1.6,
                  }}>
                    🚛 <strong>Note:</strong> Transport fee is calculated based on current motor park / courier rates. Our team will confirm your exact delivery fee before processing.
                  </div>
                </div>

                {/* Payment Method */}
                <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    💳 Payment Method
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {([
                      { id: 'bank-transfer', icon: '🏦', title: 'Direct Bank Transfer', desc: 'Upload payment proof after transfer. We confirm manually.' },
                      { id: 'paystack', icon: '💳', title: 'Pay Online (Paystack)', desc: 'Debit card, USSD, bank transfer, or international card.' },
                      { id: 'whatsapp', icon: '💬', title: 'Order via WhatsApp', desc: 'Chat with us directly to arrange payment.' },
                    ] as { id: PaymentMethod; icon: string; title: string; desc: string }[]).map(method => (
                      <label
                        key={method.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          padding: '1rem',
                          border: `2px solid ${payMethod === method.id ? 'var(--brand-green)' : 'var(--gray-200)'}`,
                          borderRadius: 'var(--radius-lg)',
                          cursor: 'pointer',
                          background: payMethod === method.id ? 'rgba(26,92,42,0.04)' : '#fff',
                          transition: 'all 0.2s',
                        }}
                      >
                        <input
                          type="radio"
                          name="payMethod"
                          value={method.id}
                          checked={payMethod === method.id}
                          onChange={() => setPayMethod(method.id)}
                          style={{ marginTop: 3 }}
                        />
                        <span style={{ fontSize: '1.25rem' }}>{method.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-800)', marginBottom: '0.2rem' }}>{method.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{method.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-xl"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading ? '⏳ Processing...' : payMethod === 'whatsapp' ? '💬 Send Order via WhatsApp' : 'Continue to Payment →'}
                </button>
              </form>

              {/* Order Summary */}
              <div style={{ position: 'sticky', top: 100, background: '#fff', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-lg)' }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {items.map(item => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--gray-700)' }}>{item.product.name} × {item.quantity}</span>
                      <span style={{ fontWeight: 600 }}>{formatNaira(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '2px solid var(--gray-100)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--brand-green)' }}>{formatNaira(subtotal)}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.4rem' }}>+ delivery fee (confirmed by admin)</p>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
                {payMethod === 'bank-transfer' ? (
                  <>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏦</div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                      Make Your Transfer
                    </h2>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                      Transfer exactly <strong style={{ color: 'var(--brand-green)' }}>{formatNaira(subtotal)}</strong> to the account below:
                    </p>

                    <div style={{ background: 'var(--brand-cream)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginBottom: '2rem', textAlign: 'left' }}>
                      {[
                        { label: 'Bank Name', value: BANK_NAME },
                        { label: 'Account Name', value: BANK_ACCOUNT_NAME },
                        { label: 'Account Number', value: BANK_ACCOUNT_NUMBER },
                        { label: 'Amount', value: formatNaira(subtotal) + ' + delivery' },
                      ].map(r => (
                        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)', fontWeight: 500 }}>{r.label}</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-800)' }}>{r.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                      <label className="form-label">Upload Payment Proof / Screenshot</label>
                      <input
                        type="text"
                        placeholder="Paste transaction reference or screenshot URL"
                        className="form-input"
                        value={uploadedFile}
                        onChange={e => setUploadedFile(e.target.value)}
                      />
                      <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '0.3rem' }}>Or send your screenshot via WhatsApp after completing the transfer.</p>
                    </div>

                    <button onClick={handlePaymentConfirm} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}>
                      I&apos;ve Made the Transfer ✓
                    </button>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello RABBITRY, I have completed my bank transfer for order of: ' + items.map(i => i.product.name).join(', ') + '. Please confirm receipt.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Notify Us on WhatsApp
                    </a>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💳</div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Paystack Payment</h2>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
                      Online payment integration is active. Your Paystack public key needs to be configured in the admin settings to enable this.
                    </p>
                    <button onClick={handlePaymentConfirm} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                      Confirm Order (Demo)
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '3rem', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1.25rem' }}>🎉</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 800, color: 'var(--brand-green-dark)', marginBottom: '0.75rem' }}>
                  Order Confirmed!
                </h2>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.75, marginBottom: '2rem' }}>
                  Thank you, <strong>{form.name}</strong>! Your order has been received. Our team will contact you on <strong>{form.phone}</strong> within 2 hours to confirm delivery details.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello RABBITRY, I just placed an order on your website. My name is ' + form.name + ' (' + form.phone + '). Please confirm receipt.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-lg"
                    style={{ justifyContent: 'center' }}
                  >
                    Confirm on WhatsApp
                  </a>
                  <a href="/shop" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
