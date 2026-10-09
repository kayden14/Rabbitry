'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/lib/cart-store';
import { formatNaira, WHATSAPP_NUMBER, NIGERIAN_STATES } from '@/lib/utils';
import { NIGERIAN_STATES as STATES } from '@/types';

export default function CartPage() {
  const { items, deliveryState, deliveryCity, updateQuantity, removeItem, getSubtotal, getTotalItems, getWhatsAppMessage, setDeliveryLocation } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [localState, setLocalState] = useState(deliveryState);
  const [localCity, setLocalCity] = useState(deliveryCity);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLocationUpdate = () => {
    setDeliveryLocation(localState, localCity);
  };

  const subtotal = getSubtotal();
  const waMessage = getWhatsAppMessage();

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main>
          <div className="container" style={{ padding: '8rem 1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐇</div>
            <p style={{ color: 'var(--gray-500)' }}>Loading your cart...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main>
          <div className="container" style={{ padding: '8rem 1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 800, color: 'var(--gray-800)', marginBottom: '1rem' }}>
              Your Cart is Empty
            </h1>
            <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', fontSize: '1rem' }}>
              Browse our products and add items to start your order.
            </p>
            <Link href="/shop" className="btn btn-primary btn-lg">
              Browse Products →
            </Link>
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
        <div style={{
          background: 'linear-gradient(135deg,#0d3317,#1a5c2a)',
          padding: '4rem 0 3rem',
        }}>
          <div className="container">
            <h1 style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '2.25rem', fontWeight: 800 }}>
              Your Cart ({getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''})
            </h1>
          </div>
        </div>

        <div className="container" style={{ padding: '3rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <div
                  key={item.product.id}
                  style={{
                    background: '#fff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'center',
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  {/* Emoji image */}
                  <div style={{
                    width: 80, height: 80, flexShrink: 0,
                    background: 'var(--brand-cream)',
                    borderRadius: 'var(--radius)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.25rem',
                  }}>
                    {item.product.category === 'live-stock' && '🐇'}
                    {item.product.category === 'processed-meat' && '🥩'}
                    {item.product.category === 'catering' && '🍖'}
                    {item.product.category === 'by-products' && '🌿'}
                    {item.product.category === 'equipment' && '🏗️'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/shop/${item.product.slug}`}>
                      <h3 style={{
                        fontFamily: "'Playfair Display',serif",
                        fontSize: '0.95rem', fontWeight: 700,
                        color: 'var(--gray-900)', lineHeight: 1.3,
                        marginBottom: '0.25rem',
                      }}>
                        {item.product.name}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>
                      {formatNaira(item.product.price)} each
                    </p>

                    {/* Qty control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        style={{
                          width: 32, height: 32,
                          background: 'var(--gray-100)', border: '2px solid var(--gray-200)',
                          borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                          fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        −
                      </button>
                      <div style={{
                        width: 44, height: 32,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid var(--gray-200)',
                        borderLeft: 'none', borderRight: 'none',
                        fontWeight: 700, fontSize: '0.9rem',
                      }}>
                        {item.quantity}
                      </div>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        style={{
                          width: 32, height: 32,
                          background: 'var(--gray-100)', border: '2px solid var(--gray-200)',
                          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                          fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontFamily: "'Playfair Display',serif",
                      fontSize: '1.1rem', fontWeight: 800,
                      color: 'var(--brand-green)',
                      marginBottom: '0.5rem',
                    }}>
                      {formatNaira(item.product.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      style={{
                        fontSize: '0.78rem', color: '#dc2626',
                        background: 'none', border: 'none',
                        cursor: 'pointer', fontWeight: 500,
                        textDecoration: 'underline',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <Link href="/shop" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                color: 'var(--brand-green)', fontSize: '0.875rem', fontWeight: 600,
                marginTop: '0.5rem',
              }}>
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{
                background: '#fff',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: 'var(--shadow-lg)',
                marginBottom: '1.25rem',
              }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                  Order Summary
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--gray-600)' }}>Subtotal ({getTotalItems()} items)</span>
                    <span style={{ fontWeight: 700 }}>{formatNaira(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--gray-600)' }}>Delivery Fee</span>
                    <span style={{ color: 'var(--brand-gold)', fontWeight: 600 }}>Quoted on review</span>
                  </div>
                </div>

                <div style={{
                  background: 'var(--brand-cream)',
                  borderRadius: 'var(--radius)',
                  padding: '0.875rem',
                  marginBottom: '1.5rem',
                  borderLeft: '3px solid var(--brand-gold)',
                }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                    🚛 <strong>Delivery fee</strong> is calculated based on your state and current motor park / courier rates. We will confirm your exact total before payment.
                  </p>
                </div>

                <div style={{
                  borderTop: '2px solid var(--gray-100)',
                  paddingTop: '1rem',
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '1.1rem', fontWeight: 800,
                  fontFamily: "'Playfair Display',serif",
                  marginBottom: '1.5rem',
                }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--brand-green)' }}>{formatNaira(subtotal)}</span>
                </div>

                {/* Delivery location */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-700)', marginBottom: '0.75rem' }}>
                    📍 Your Delivery Location
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    <select
                      value={localState}
                      onChange={e => setLocalState(e.target.value)}
                      className="form-input form-select"
                      style={{ fontSize: '0.875rem' }}
                    >
                      <option value="">Select State...</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder="City / Town"
                      value={localCity}
                      onChange={e => setLocalCity(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.875rem' }}
                    />
                    <button onClick={handleLocationUpdate} className="btn btn-outline btn-sm">
                      Save Location
                    </button>
                  </div>
                </div>

                {/* Checkout */}
                <Link href="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.875rem' }}>
                  Proceed to Checkout →
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Order via WhatsApp Instead
                </a>
              </div>

              {/* Payment methods preview */}
              <div style={{
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginBottom: '0.75rem', fontWeight: 600, textAlign: 'center' }}>
                  ACCEPTED PAYMENT METHODS
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                  {['🏦 Bank Transfer', '💳 Paystack', '💬 WhatsApp', '📱 USSD'].map(m => (
                    <span key={m} style={{
                      background: 'var(--gray-100)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--gray-600)',
                    }}>{m}</span>
                  ))}
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
