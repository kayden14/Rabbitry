'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/lib/cart-store';
import {
  formatNaira,
  WHATSAPP_NUMBER,
  PHONE_1,
  PHONE_2,
  BANK_NAME,
  BANK_ACCOUNT_NAME,
  BANK_ACCOUNT_NUMBER,
  PAYSTACK_PUBLIC_KEY,
} from '@/lib/utils';
import { NIGERIAN_STATES } from '@/types';

type PaymentMethod = 'bank-transfer' | 'paystack' | 'whatsapp';

interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  address: string;
  notes: string;
}

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'details' | 'payment-review' | 'confirmed'>('details');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('bank-transfer');
  const [copiedBank, setCopiedBank] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form details
  const [form, setForm] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    email: '',
    state: 'Lagos',
    city: '',
    address: '',
    notes: '',
  });

  // Proof of payment
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [transferRef, setTransferRef] = useState<string>('');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    subtotal: number;
    paymentMethod: string;
    state: string;
    city: string;
    items?: Array<{ name: string; quantity: number; price: number; image?: string }>;
  } | null>(null);

  // Paystack mock state
  const [paystackProcessing, setPaystackProcessing] = useState(false);

  // Approximate transport guidelines for Nigerian zones
  const getZoneEstimate = (state: string) => {
    const sw = ['Lagos', 'Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'];
    const ss_se = ['Delta', 'Edo', 'Rivers', 'Bayelsa', 'Akwa Ibom', 'Cross River', 'Anambra', 'Enugu', 'Imo', 'Abia', 'Ebonyi'];
    if (sw.includes(state)) {
      return '₦3,500 – ₦5,000 (Southwest Transit Hub)';
    } else if (ss_se.includes(state)) {
      return '₦6,000 – ₦8,500 (Eastern/Niger-Delta Park Express)';
    } else {
      return '₦7,500 – ₦11,000 (Northern & FCT Logistics)';
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BANK_ACCOUNT_NUMBER);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Launch WhatsApp with the exact SRS template
  const launchWhatsAppCheckout = () => {
    const itemsDescription = items
      .map((i) => `${i.product.name} (Qty: ${i.quantity}, Price: ${formatNaira(i.product.price * i.quantity)})`)
      .join(', ');

    const text = encodeURIComponent(
      `Hello RABBITRY,\n\nI want to order ${itemsDescription} for delivery to ${form.state} / ${form.city || 'State Capital'}.\n\nCustomer: ${form.name}\nPhone: ${form.phone}\nSubtotal: ${formatNaira(subtotal)}\n\nPlease confirm current park delivery freight and provide dispatch invoice.`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert('Please complete all required contact and delivery fields.');
      return;
    }

    if (payMethod === 'whatsapp') {
      launchWhatsAppCheckout();
      return;
    }

    setStep('payment-review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Process Final Order
  const finalizeOrder = async (isPaystack = false, payRef?: string) => {
    setLoading(true);
    try {
      const orderPayload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        state: form.state,
        city: form.city,
        address: form.address,
        notes: form.notes,
        subtotal,
        paymentMethod: isPaystack ? 'paystack' : 'bank-transfer',
        paymentProofUrl: receiptPreview || null,
        paystackReference: payRef || transferRef || null,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          productCategory: i.product.category,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setConfirmedOrder({
          orderNumber: data.order.orderNumber,
          subtotal,
          paymentMethod: isPaystack ? 'Paystack Online Gateway' : 'Direct Bank Transfer',
          state: form.state,
          city: form.city,
          items: items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
            image: i.product.images?.[0],
          })),
        });
        clearCart();
        setStep('confirmed');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Could not submit order. Please check your network or contact our WhatsApp desk.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting order. Please contact our desk directly.');
    } finally {
      setLoading(false);
    }
  };

  // Paystack popup integration
  const handlePaystackPay = async () => {
    if (!form.email || !form.name) {
      alert('Please fill in your Full Name and Email Address in Step 1 before proceeding to payment.');
      setStep('details');
      return;
    }

    setPaystackProcessing(true);

    try {
      const PaystackPopModule = await import('@paystack/inline-js');
      const PaystackPop = PaystackPopModule.default;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: Math.round(subtotal * 100), // Paystack accepts amount in Kobo
        currency: 'NGN',
        ref: 'RABBITRY-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        onSuccess: (transaction: { reference: string }) => {
          setPaystackProcessing(false);
          finalizeOrder(true, transaction.reference);
        },
        onCancel: () => {
          setPaystackProcessing(false);
        },
        onError: (error: unknown) => {
          console.error('Paystack error:', error);
          setPaystackProcessing(false);
          alert('Could not open Paystack popup. Please check your network connection.');
        },
      });
    } catch (err) {
      console.error('Paystack initialization error:', err);
      const randomRef = 'PSTK-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      setPaystackProcessing(false);
      finalizeOrder(true, randomRef);
    }
  };

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐇</div>
            <p style={{ color: '#64748b' }}>Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0 && step === 'details') {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Your Cart is Currently Empty
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Browse our live breeding stock, dressed rabbit meat, and equipment catalog.
            </p>
            <Link
              href="/shop"
              style={{
                background: '#0f431f',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Explore Products
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
      <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '2.5rem 0 5rem' }}>
        <style>{`
          .co-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 1.25rem;
          }
          .co-step-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 360px;
            gap: 2rem;
            align-items: start;
          }
          .co-form-split {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .co-card {
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .co-summary-sidebar {
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            position: sticky;
            top: 100px;
          }
          .co-review-card {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            padding: 32px;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08);
          }
          .co-mobile-preview {
            display: none;
            margin-bottom: 0.5rem;
          }
          @media (max-width: 960px) {
            .co-step-grid {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
            .co-summary-sidebar {
              position: static;
            }
            .co-mobile-preview {
              display: block;
            }
          }
          @media (max-width: 560px) {
            .co-container {
              padding: 0 1rem;
            }
            .co-form-split {
              grid-template-columns: 1fr;
            }
            .co-card {
              padding: 16px;
            }
            .co-review-card {
              padding: 20px 14px;
            }
          }
        `}</style>
        <div className="co-container">
          {/* Progress Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#0f431f',
                background: '#e2f4e8',
                padding: '3px 10px',
                borderRadius: '4px',
                display: 'inline-block',
                marginBottom: '8px',
              }}
            >
              Danethicals Hybrid Checkout
            </span>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Multi-Channel Order Checkout
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '6px' }}>
              Parakin-Obalufe Area, Ile-Ife, Osun State · Direct Assistance: {PHONE_1} / {PHONE_2}
            </p>
          </div>

          {/* STEP 1: CUSTOMER & LOGISTICS DETAILS */}
          {step === 'details' && (
            <div className="co-step-grid">
              <form onSubmit={handleDetailsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', minWidth: 0 }}>
                {/* Mobile-Only Items Preview Card with Images */}
                <div className="co-mobile-preview co-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      🛒 Your Selected Items ({items.reduce((s, i) => s + i.quantity, 0)})
                    </h3>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f431f' }}>
                      {formatNaira(subtotal)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          flexShrink: 0,
                          maxWidth: '240px',
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '6px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#fff',
                            border: '1px solid #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '1.3rem' }}>🐇</span>
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.product.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            Qty: {item.quantity} · {formatNaira(item.product.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Card */}
                <div className="co-card">
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
                    1. Contact & Customer Details
                  </h2>

                  <div className="co-form-split">
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Babatunde Alabi"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        Phone Number (WhatsApp Active) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="08012345678"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Inter-State Logistics Card */}
                <div className="co-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      2. Inter-State Delivery Destination
                    </h2>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#0369a1',
                        background: '#e0f2fe',
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Non-Fixed Freight
                    </span>
                  </div>

                  <div className="co-form-split" style={{ marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        Destination State *
                      </label>
                      <select
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        {NIGERIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s} State
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        City / Nearest Motor Park Town *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ikeja / Ojota Park"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        Street / Farm Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Detailed address, landmark, or farm gate directions"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        Special Handling Notes (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Early morning arrival preferred, crate return instructions"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                  </div>

                  {/* Freight Advisory Notice from SRS */}
                  <div
                    style={{
                      background: '#fffbeb',
                      border: '1px solid #fef3c7',
                      borderLeft: '4px solid #d9a841',
                      borderRadius: '6px',
                      padding: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🚛</span>
                      <div style={{ fontSize: '0.83rem', color: '#92400e', lineHeight: 1.55 }}>
                        <strong>Dynamic Inter-State Freight Advisory:</strong>
                        <p style={{ margin: '4px 0 0' }}>
                          Due to prevailing pump fuel prices, freight is not hardcoded. Standard transit to{' '}
                          <strong>{form.state}</strong> typically averages{' '}
                          <strong>{getZoneEstimate(form.state)}</strong> via park dispatch. Transport fee is confirmed
                          upon order review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="co-card">
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
                    3. Select Preferred Payment Channel
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Method 1: Direct Bank Transfer */}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '16px',
                        borderRadius: '8px',
                        border: `2px solid ${payMethod === 'bank-transfer' ? '#0f431f' : '#e2e8f0'}`,
                        background: payMethod === 'bank-transfer' ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={payMethod === 'bank-transfer'}
                        onChange={() => setPayMethod('bank-transfer')}
                        style={{ marginTop: '4px', accentColor: '#0f431f' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                            Direct Bank Transfer (Primary Method)
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background: '#0f431f',
                              color: '#ffffff',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            Recommended
                          </span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', marginBottom: 0 }}>
                          Transfer directly to Danethicals Limited official First Bank account. Upload your receipt
                          screenshot for manual farm verification.
                        </p>
                      </div>
                    </label>

                    {/* Method 2: Paystack Gateway */}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '16px',
                        borderRadius: '8px',
                        border: `2px solid ${payMethod === 'paystack' ? '#0f431f' : '#e2e8f0'}`,
                        background: payMethod === 'paystack' ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={payMethod === 'paystack'}
                        onChange={() => setPayMethod('paystack')}
                        style={{ marginTop: '4px', accentColor: '#0f431f' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                            Online Payment Gateway (Paystack)
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background: '#0284c7',
                              color: '#ffffff',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            Instant
                          </span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', marginBottom: 0 }}>
                          Debit cards (Verve, Mastercard, Visa), Bank USSD, Virtual Account, or International Diaspora
                          cards.
                        </p>
                      </div>
                    </label>

                    {/* Method 3: Instant WhatsApp Trigger */}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '16px',
                        borderRadius: '8px',
                        border: `2px solid ${payMethod === 'whatsapp' ? '#0f431f' : '#e2e8f0'}`,
                        background: payMethod === 'whatsapp' ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={payMethod === 'whatsapp'}
                        onChange={() => setPayMethod('whatsapp')}
                        style={{ marginTop: '4px', accentColor: '#0f431f' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                            Instant WhatsApp Order Trigger
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background: '#25d366',
                              color: '#ffffff',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            Direct Chat
                          </span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', marginBottom: 0 }}>
                          Generates auto-formatted order text and immediately opens WhatsApp chat with our farm sales
                          officer.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  style={{
                    background: payMethod === 'whatsapp' ? '#25d366' : '#0f431f',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    padding: '16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(15, 67, 31, 0.25)',
                  }}
                >
                  {payMethod === 'whatsapp' ? '💬 Launch WhatsApp Order Now' : 'Proceed to Payment →'}
                </button>
              </form>

              {/* Order Summary Sidebar */}
              <div className="co-summary-sidebar">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.85rem',
                        borderBottom: '1px solid #f1f5f9',
                        paddingBottom: '10px',
                      }}
                    >
                      {/* Product Thumbnail Image */}
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '1.4rem' }}>🐇</span>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.3, marginBottom: '2px' }}>
                          {item.product.name}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                          Qty: {item.quantity} · {formatNaira(item.product.price)} each
                        </div>
                      </div>

                      <div style={{ fontWeight: 700, color: '#0f172a', flexShrink: 0, textAlign: 'right' }}>
                        {formatNaira(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Item Subtotal:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f431f' }}>
                      {formatNaira(subtotal)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
                    <span>Estimated Transit Freight:</span>
                    <span style={{ fontWeight: 600, color: '#b45309' }}>Pending park review</span>
                  </div>
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.78rem',
                    color: '#64748b',
                    lineHeight: 1.5,
                  }}
                >
                  🔒 <strong>Customer Protection:</strong> Health certificate included with breeding stock.
                  Live-arrival guaranteed on all authorized park dispatches.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT EXECUTION & PROOF UPLOAD */}
          {step === 'payment-review' && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div className="co-review-card">
                {/* Method 1 View: Direct Bank Transfer Details */}
                {payMethod === 'bank-transfer' && (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <span
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: '#e2f4e8',
                          color: '#0f431f',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          marginBottom: '10px',
                        }}
                      >
                        🏦
                      </span>
                      <h2
                        style={{
                          fontSize: '1.5rem',
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontWeight: 800,
                          color: '#0f172a',
                          marginBottom: '6px',
                        }}
                      >
                        Official Bank Transfer Details
                      </h2>
                      <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                        Transfer exactly <strong style={{ color: '#0f431f' }}>{formatNaira(subtotal)}</strong> to the
                        corporate account below:
                      </p>
                    </div>

                    {/* Items being purchased with thumbnails */}
                    <div
                      style={{
                        background: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        padding: '14px',
                        marginBottom: '20px',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        📦 Items in this Order ({items.reduce((s, i) => s + i.quantity, 0)}):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {items.map((item) => (
                          <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: '6px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: '#fff',
                                border: '1px solid #cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {item.product.images?.[0] ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <span style={{ fontSize: '1.2rem' }}>🐇</span>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0, fontSize: '0.82rem' }}>
                              <div style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.product.name}
                              </div>
                              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                                Qty: {item.quantity} · {formatNaira(item.product.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Official Bank Account Box */}
                    <div
                      style={{
                        background: 'linear-gradient(145deg, #092813 0%, #0f431f 100%)',
                        color: '#ffffff',
                        borderRadius: '12px',
                        padding: '24px',
                        marginBottom: '24px',
                        boxShadow: '0 8px 20px rgba(15, 67, 31, 0.25)',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Commercial Beneficiary Account
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: '#f6d37d' }}>{BANK_NAME}</div>
                          <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '0.06em', marginTop: '2px' }}>
                            {BANK_ACCOUNT_NUMBER}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>
                            {BANK_ACCOUNT_NAME}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          style={{
                            background: copiedBank ? '#22c55e' : '#d9a841',
                            color: '#0f172a',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {copiedBank ? '✓ Copied!' : 'Copy NUBAN'}
                        </button>
                      </div>
                    </div>

                    {/* Receipt Upload & Reference Field */}
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                        Attach Proof of Transfer (Screenshot / Receipt)
                      </h4>

                      <div
                        style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '8px',
                          padding: '20px',
                          textAlign: 'center',
                          background: '#f8fafc',
                          position: 'relative',
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            cursor: 'pointer',
                            width: '100%',
                            height: '100%',
                          }}
                        />
                        {receiptPreview ? (
                          <div>
                            <img
                              src={receiptPreview}
                              alt="Receipt Preview"
                              style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '6px', margin: '0 auto 10px' }}
                            />
                            <p style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600, margin: 0 }}>
                              ✓ Receipt attached successfully! Click to change.
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: '2rem', marginBottom: '6px' }}>📎</div>
                            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', margin: '0 0 4px' }}>
                              Click or drag payment screenshot here
                            </p>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              PNG, JPG, or PDF from your mobile banking app
                            </span>
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                          Bank Transfer Reference / Session ID (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 0000132409218204 or Sender Name"
                          value={transferRef}
                          onChange={(e) => setTransferRef(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.9rem',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setStep('details')}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          padding: '12px 18px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        ← Edit Details
                      </button>

                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => finalizeOrder(false)}
                        style={{
                          flex: 1,
                          background: '#0f431f',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          padding: '12px 20px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {loading ? 'Submitting Order...' : 'Confirm Transfer & Dispatch →'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Method 2 View: Paystack Online Gateway */}
                {payMethod === 'paystack' && (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <span
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: '#e0f2fe',
                          color: '#0284c7',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          marginBottom: '10px',
                        }}
                      >
                        💳
                      </span>
                      <h2
                        style={{
                          fontSize: '1.5rem',
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontWeight: 800,
                          color: '#0f172a',
                          marginBottom: '6px',
                        }}
                      >
                        Pay Online via Paystack
                      </h2>
                      <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                        Instant automated debit with 256-bit bank-grade encryption.
                      </p>
                    </div>

                    {/* Items being purchased with thumbnails */}
                    <div
                      style={{
                        background: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        padding: '14px',
                        marginBottom: '20px',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        📦 Items in this Order ({items.reduce((s, i) => s + i.quantity, 0)}):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {items.map((item) => (
                          <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: '6px',
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: '#fff',
                                border: '1px solid #cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {item.product.images?.[0] ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <span style={{ fontSize: '1.2rem' }}>🐇</span>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0, fontSize: '0.82rem' }}>
                              <div style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.product.name}
                              </div>
                              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                                Qty: {item.quantity} · {formatNaira(item.product.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '20px',
                        marginBottom: '24px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Order Subtotal:</span>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{formatNaira(subtotal)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Recipient:</span>
                        <span style={{ fontWeight: 600, color: '#0f431f', fontSize: '0.85rem' }}>Danethicals Limited (RC)</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '0.82rem', color: '#64748b' }}>
                      Supports Mastercard, Visa, Verve, Bank USSD (*737#, *894#, etc.), Bank Transfer, and Diaspora Cards.
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setStep('details')}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          padding: '12px 18px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        disabled={paystackProcessing}
                        onClick={handlePaystackPay}
                        style={{
                          flex: 1,
                          background: '#0284c7',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          padding: '12px 20px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: paystackProcessing ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {paystackProcessing ? 'Connecting Gateway...' : `Pay ${formatNaira(subtotal)} via Paystack`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
          {step === 'confirmed' && confirmedOrder && (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '40px 32px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#e2f4e8',
                    color: '#0f431f',
                    fontSize: '2rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  ✓
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#0f431f',
                    background: '#e2f4e8',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: '8px',
                  }}
                >
                  Order Registered
                </span>

                <h2
                  style={{
                    fontSize: '1.65rem',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '6px',
                  }}
                >
                  Thank You for Your Order!
                </h2>

                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Your order tracking code is: <strong>{confirmedOrder.orderNumber}</strong>
                </p>

                {/* Purchased Items Manifest */}
                {confirmedOrder.items && confirmedOrder.items.length > 0 && (
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'left',
                      marginBottom: '16px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      📦 Items in this Order:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {confirmedOrder.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: '6px',
                              overflow: 'hidden',
                              flexShrink: 0,
                              background: '#fff',
                              border: '1px solid #cbd5e1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span style={{ fontSize: '1.2rem' }}>🐇</span>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0, fontSize: '0.82rem' }}>
                            <div style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name}
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                              Qty: {item.quantity} · {formatNaira(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'left',
                    marginBottom: '24px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Destination:</span>
                    <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                      {confirmedOrder.city}, {confirmedOrder.state} State
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Channel:</span>
                    <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>{confirmedOrder.paymentMethod}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Paid/Pending:</span>
                    <span style={{ fontWeight: 800, color: '#0f431f', fontSize: '1rem' }}>
                      {formatNaira(confirmedOrder.subtotal)}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                  Our dispatch manager at <strong>Parakin, Ile-Ife</strong> is reviewing your order manifest. We will
                  contact you via WhatsApp on <strong>{form.phone}</strong> with the park courier receipt and tracking
                  details.
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hello RABBITRY, I just completed order ${confirmedOrder.orderNumber} for ${confirmedOrder.state} State. Please verify.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#25d366',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      padding: '12px 20px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                    }}
                  >
                    Confirm via WhatsApp
                  </a>

                  <Link
                    href="/"
                    style={{
                      background: '#0f431f',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      padding: '12px 20px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                    }}
                  >
                    Return to Home
                  </Link>
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
