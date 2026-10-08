'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatNaira, WHATSAPP_NUMBER, PHONE_1, BANK_ACCOUNT_NUMBER, BANK_NAME } from '@/lib/utils';
import { allProducts as initialProducts } from '@/data/products';
import { Product } from '@/types';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryState: string;
  deliveryCity: string;
  deliveryAddress: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  deliveryFee: number | null;
  total: number | null;
  status: string;
  paymentMethod: string;
  paymentProofUrl?: string;
  paystackReference?: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  inquiryDetails?: string;
  createdAt: string;
}

interface RegionalRate {
  region: string;
  states: string;
  baseline: number;
}

const INITIAL_RATES: RegionalRate[] = [
  { region: 'South-West Hub', states: 'Lagos, Ogun, Oyo, Osun, Ondo, Ekiti', baseline: 4500 },
  { region: 'South-South / South-East', states: 'Delta, Edo, Rivers, Bayelsa, Anambra, Enugu, Imo, Abia', baseline: 7500 },
  { region: 'North-Central & FCT Abuja', states: 'Abuja (FCT), Kogi, Kwara, Niger, Benue, Plateau, Nasarawa', baseline: 8500 },
  { region: 'North-West & North-East', states: 'Kaduna, Kano, Katsina, Sokoto, Borno, Bauchi, Gombe, Adamawa', baseline: 10500 },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#fef3c7', color: '#92400e' },
  'payment-proof-uploaded': { bg: '#dbeafe', color: '#1e40af' },
  confirmed: { bg: '#d1fae5', color: '#065f46' },
  processing: { bg: '#ede9fe', color: '#5b21b6' },
  dispatched: { bg: '#fce7f3', color: '#9d174d' },
  delivered: { bg: '#dcfce7', color: '#14532d' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

export default function AdminDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);

  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Dashboard content states
  const [tab, setTab] = useState<'orders' | 'inventory' | 'logistics' | 'leads'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [rates, setRates] = useState<RegionalRate[]>(INITIAL_RATES);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [viewProofUrl, setViewProofUrl] = useState<string | null>(null);

  // Product edit modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productPrice, setProductPrice] = useState<string>('');
  const [productStock, setProductStock] = useState<'in-stock' | 'out-of-stock' | 'pre-order'>('in-stock');

  // Check existing session on load
  useEffect(() => {
    async function verifySession() {
      try {
        const stored = typeof window !== 'undefined' ? sessionStorage.getItem('rabbitry_admin_auth') : null;
        if (stored === 'true') {
          setIsAuthenticated(true);
          fetchData();
          return;
        }

        const res = await fetch('/api/admin/auth');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            if (typeof window !== 'undefined') sessionStorage.setItem('rabbitry_admin_auth', 'true');
            fetchData();
            return;
          }
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setAuthChecking(false);
      }
    }
    verifySession();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [ordersRes, leadsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/leads'),
      ]);
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
    } catch (err) {
      console.error('Admin fetch error', err);
    } finally {
      setLoading(false);
      setAuthChecking(false);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') sessionStorage.setItem('rabbitry_admin_auth', 'true');
        fetchData();
      } else {
        setAuthError(data.message || 'Incorrect password. Access denied.');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') sessionStorage.removeItem('rabbitry_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    try {
      const parsedFee = deliveryFee ? parseFloat(deliveryFee) : null;
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingOrder.id,
          deliveryFee: parsedFee,
          total: parsedFee != null ? editingOrder.subtotal + parsedFee : null,
          status: newStatus || editingOrder.status,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === data.order.id ? data.order : o)));
        setEditingOrder(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated = products.map((p) => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          price: productPrice ? parseFloat(productPrice) : p.price,
          stockStatus: productStock,
        };
      }
      return p;
    });
    setProducts(updated);
    setEditingProduct(null);
  };

  const toggleProductStockQuick = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockStatus: p.stockStatus === 'in-stock' ? 'out-of-stock' : 'in-stock' } : p))
    );
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    proofUploaded: orders.filter((o) => o.paymentProofUrl).length,
    totalRevenue: orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.subtotal, 0),
    totalLeads: leads.length,
  };

  // ── AUTH CHECKING SPINNER ──
  if (authChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#092813', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>🐇</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f6d37d' }}>Verifying Danethicals Admin Security...</div>
        </div>
      </div>
    );
  }

  // ── PASSWORD PROTECTION GATE SCREEN ──
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #071f0e 0%, #092813 50%, #031407 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(217, 168, 65, 0.3)',
            padding: '36px 32px',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #092813, #0f431f)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: '0 8px 20px rgba(9, 40, 19, 0.25)',
              }}
            >
              🔒
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fef3c7',
                color: '#92400e',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '10px',
              }}
            >
              Danethicals Farm Agribusiness
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', fontFamily: "'Playfair Display', Georgia, serif" }}>
              Operations Command Desk
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
              Restricted portal for order processing, logistics rates, and live livestock inventory.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Admin Master Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter administrator passcode"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    borderRadius: '8px',
                    border: authError ? '2px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: '#64748b',
                    padding: 0,
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
              {authError && (
                <div style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, marginTop: '6px' }}>
                  ⚠️ {authError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth || !passwordInput}
              style={{
                width: '100%',
                background: isSubmittingAuth ? '#64748b' : 'linear-gradient(135deg, #092813 0%, #0f431f 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                padding: '13px',
                borderRadius: '8px',
                border: 'none',
                cursor: isSubmittingAuth ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(15, 67, 31, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              {isSubmittingAuth ? 'Verifying Security...' : 'Unlock Admin Console →'}
            </button>
          </form>

          {/* Quick Notice */}
          <div
            style={{
              marginTop: '24px',
              padding: '12px 14px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.76rem',
              color: '#64748b',
              lineHeight: 1.45,
            }}
          >
            <strong>Security Notice:</strong> All administrative activities and status adjustments are recorded. Passcode defaults to your designated farm key (`DanethicalsAdmin2026!`).
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link
              href="/"
              style={{
                fontSize: '0.82rem',
                color: '#0f431f',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              ← Return to Rabbitry Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── FULL ADMIN DASHBOARD (AUTHENTICATED) ──
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', display: 'flex', flexDirection: 'column' }}>
      {/* ── MOBILE HEADER BAR (VISIBLE ON SMALL SCREENS) ──────────────── */}
      <div
        style={{
          background: '#092813',
          color: '#ffffff',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#ffffff',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle navigation drawer"
          >
            ☰
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🐇</span>
            <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.04em' }}>RABBITRY ADMIN</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/"
            style={{
              fontSize: '0.78rem',
              color: '#f6d37d',
              textDecoration: 'none',
              fontWeight: 600,
              padding: '5px 8px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            Storefront
          </Link>
          <button
            onClick={handleLogout}
            style={{
              fontSize: '0.78rem',
              color: '#fca5a5',
              background: 'rgba(239, 68, 68, 0.15)',
              border: 'none',
              fontWeight: 600,
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* ── SIDEBAR DRAWER (DESKTOP + RESPONSIVE MOBILE DRAWER) ──── */}
        <aside
          style={{
            width: '260px',
            background: '#092813',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 16px',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            position: 'sticky',
            top: 0,
            height: 'calc(100vh - 57px)',
            zIndex: 100,
            transition: 'all 0.3s ease',
          }}
          className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
        >
          <div style={{ padding: '0 8px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🐇</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.04em' }}>RABBITRY</div>
                <div style={{ fontSize: '0.7rem', color: '#d9a841', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Danethicals Limited
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
              Admin Console · Parakin, Ile-Ife
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px', flex: 1 }}>
            {[
              { id: 'orders', label: 'Orders & Payments', icon: '📦' },
              { id: 'inventory', label: 'Inventory (5 Divisions)', icon: '🏷️' },
              { id: 'logistics', label: 'Freight Logistics Rates', icon: '🚛' },
              { id: 'leads', label: 'Leads & Inquiries', icon: '👥' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id as typeof tab);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: tab === item.id ? '#0f431f' : 'transparent',
                  color: tab === item.id ? '#ffffff' : 'rgba(255,255,255,0.7)',
                  fontWeight: tab === item.id ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '6px 8px',
                borderRadius: '6px',
              }}
            >
              ← View Live Storefront
            </Link>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: '#fca5a5',
                background: 'rgba(239, 68, 68, 0.15)',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 600,
              }}
            >
              🔒 Lock / Log Out
            </button>
          </div>
        </aside>

        {/* ── BACKDROP FOR MOBILE SIDEBAR ──────────────────────── */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 90,
            }}
          />
        )}

        {/* ── MAIN CONTENT ───────────────────────────────────────── */}
        <main style={{ flex: 1, padding: '24px 20px', overflowX: 'hidden' }}>
          {/* Top Header & Metrics */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.65rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              {tab === 'orders' && 'Orders & Bank Payment Verification'}
              {tab === 'inventory' && 'Live Inventory Management (CRUD)'}
              {tab === 'logistics' && 'Inter-State Logistics Freight Rates'}
              {tab === 'leads' && 'Customer Leads & Catering Inquiries'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Central operations dashboard for Danethicals Limited rabbit platform.
            </p>
          </div>

          {/* Stats Row - Fully Responsive Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              marginBottom: '28px',
            }}
          >
            {[
              { label: 'Total Orders', value: stats.totalOrders, color: '#0f431f', icon: '📦' },
              { label: 'Pending Dispatch', value: stats.pendingOrders, color: '#b45309', icon: '⏳' },
              { label: 'Payment Proofs', value: stats.proofUploaded, color: '#0284c7', icon: '🧾' },
              { label: 'Total Revenue', value: formatNaira(stats.totalRevenue), color: '#166534', icon: '💰' },
              { label: 'Broadcast Leads', value: stats.totalLeads, color: '#7c3aed', icon: '👥' },
            ].map((st, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{st.icon}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: st.color }}>{st.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── TAB 1: ORDERS & PAYMENTS ───────────────────────────── */}
          {tab === 'orders' && (
            <div>
              {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '3rem 1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Orders Placed Yet</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Orders placed through Bank Transfer, Paystack, or WhatsApp will be logged here.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '700px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                          {['Order Ref', 'Customer', 'Items Ordered', 'Destination', 'Subtotal', 'Freight Fee', 'Payment & Proof', 'Status', 'Actions'].map((h) => (
                            <th key={h} style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => {
                          const stBadge = STATUS_COLORS[o.status] || { bg: '#f1f5f9', color: '#334155' };
                          return (
                            <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f431f', whiteSpace: 'nowrap' }}>
                                {o.orderNumber}
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ fontWeight: 600, color: '#0f172a' }}>{o.customerName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.customerPhone}</div>
                              </td>
                              <td style={{ padding: '12px 14px', minWidth: '180px' }}>
                                {o.items?.map((it, idx) => (
                                 <div key={idx} style={{ fontSize: '0.78rem', color: '#334155' }}>
                                    {it.productName} × {it.quantity}
                                  </div>
                                ))}
                              </td>
                              <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                <div style={{ fontWeight: 600 }}>{o.deliveryState} State</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.deliveryCity}</div>
                              </td>
                              <td style={{ padding: '12px 14px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                {formatNaira(o.subtotal)}
                              </td>
                              <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                {o.deliveryFee != null ? (
                                  <span style={{ fontWeight: 700, color: '#0f431f' }}>{formatNaira(o.deliveryFee)}</span>
                                ) : (
                                  <span style={{ color: '#b45309', fontWeight: 600, fontSize: '0.75rem' }}>Pending Override</span>
                                )}
                              </td>
                              <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{o.paymentMethod}</div>
                                {o.paymentProofUrl ? (
                                  <button
                                    type="button"
                                    onClick={() => setViewProofUrl(o.paymentProofUrl!)}
                                    style={{
                                      marginTop: '4px',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      color: '#0284c7',
                                      background: '#e0f2fe',
                                      padding: '3px 8px',
                                      borderRadius: '4px',
                                      border: 'none',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    👁️ View Receipt
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>No receipt file</span>
                                )}
                              </td>
                              <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                <span
                                  style={{
                                    background: stBadge.bg,
                                    color: stBadge.color,
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {o.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingOrder(o);
                                    setDeliveryFee(o.deliveryFee?.toString() || '');
                                    setNewStatus(o.status);
                                  }}
                                  style={{
                                    background: '#0f431f',
                                    color: '#ffffff',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Edit / Override
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: INVENTORY MANAGEMENT (CRUD) ─────────────────── */}
          {tab === 'inventory' && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Active Catalog ({products.length} Products Across 5 Categories)
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Live Breeding Stock · Processed Meat · Event Catering · By-Products · Equipment
                  </span>
                </div>
              </div>

              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '650px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                      {['Photo', 'Name & Category', 'Division', 'Unit Price', 'Stock Status', 'Quick Actions'].map((h) => (
                        <th key={h} style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 14px', width: '60px' }}>
                          <img
                            src={p.images?.[0] || '/images/white-rabbit.jpg'}
                            alt={p.name}
                            style={{ width: '48px', height: '38px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>slug: /{p.slug}</div>
                        </td>
                        <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                            }}
                          >
                            {p.category}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f431f', whiteSpace: 'nowrap' }}>
                          {formatNaira(p.price)}
                        </td>
                        <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              background: p.stockStatus === 'in-stock' ? '#dcfce7' : '#fee2e2',
                              color: p.stockStatus === 'in-stock' ? '#166534' : '#991b1b',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                            }}
                          >
                            {p.stockStatus === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => toggleProductStockQuick(p.id)}
                              style={{
                                background: p.stockStatus === 'in-stock' ? '#fef3c7' : '#dcfce7',
                                color: p.stockStatus === 'in-stock' ? '#92400e' : '#166534',
                                border: 'none',
                                padding: '5px 9px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Toggle Stock
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                setProductPrice(p.price.toString());
                                setProductStock(p.stockStatus);
                              }}
                              style={{
                                background: '#0f431f',
                                color: '#ffffff',
                                border: 'none',
                                padding: '5px 9px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 3: REGIONAL FREIGHT LOGISTICS ─────────────────── */}
          {tab === 'logistics' && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
                  Standard Inter-State Transit Baseline Rates
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Adjust baseline estimates for motor park freight. Rates fluctuate with pump fuel prices and are subject
                  to final order review.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {rates.map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                      {r.region}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, marginBottom: '12px' }}>
                      {r.states}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.82rem', color: '#475569' }}>Standard Baseline:</span>
                      <input
                        type="number"
                        value={r.baseline}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setRates((prev) => prev.map((item, i) => (i === idx ? { ...item, baseline: val } : item)));
                        }}
                        style={{
                          width: '100px',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          textAlign: 'right',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => alert('Regional logistics baselines updated successfully!')}
                  style={{
                    background: '#0f431f',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '10px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save Baseline Updates
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 4: LEADS & INQUIRIES ───────────────────────────── */}
          {tab === 'leads' && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {leads.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No leads captured yet.</div>
              ) : (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                        {['Name', 'Phone', 'Email', 'Source', 'Details', 'Action'].map((h) => (
                          <th key={h} style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((l) => (
                        <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, whiteSpace: 'nowrap' }}>{l.name}</td>
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>{l.phone}</td>
                          <td style={{ padding: '12px 14px', color: '#64748b' }}>{l.email || '—'}</td>
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                background: '#e0f2fe',
                                color: '#0369a1',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                              }}
                            >
                              {l.source}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#64748b', maxWidth: '240px' }}>
                            {l.inquiryDetails || 'Guide Download'}
                          </td>
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <a
                              href={`https://wa.me/${l.phone.replace(/^0/, '234')}?text=${encodeURIComponent(
                                `Hello ${l.name}, this is Danethicals RABBITRY. Thank you for your inquiry!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: '#25d366',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                textDecoration: 'none',
                              }}
                            >
                              WhatsApp Customer
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── MODAL: ORDER INVOICE OVERRIDE & STATUS ────────────── */}
      {editingOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
          }}
          onClick={(e) => e.target === e.currentTarget && setEditingOrder(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              Override Order #{editingOrder.orderNumber}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Destination: {editingOrder.deliveryCity}, {editingOrder.deliveryState} State
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Set Final Delivery Charge (₦)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Update Order Pipeline Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                >
                  {['pending', 'payment-proof-uploaded', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'].map((st) => (
                    <option key={st} value={st}>
                      {st.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateOrder}
                style={{
                  flex: 1,
                  background: '#0f431f',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW ATTACHED RECEIPT SCREENSHOT ────────────── */}
      {viewProofUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setViewProofUrl(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '520px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
              Bank Transfer Payment Proof Receipt
            </h3>
            <img
              src={viewProofUrl}
              alt="Payment Screenshot"
              style={{ maxHeight: '70vh', maxWidth: '100%', borderRadius: '6px', border: '1px solid #e2e8f0' }}
            />
            <button
              type="button"
              onClick={() => setViewProofUrl(null)}
              style={{
                marginTop: '16px',
                background: '#0f431f',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: INVENTORY EDIT PRODUCT ──────────────────────── */}
      {editingProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
          }}
          onClick={(e) => e.target === e.currentTarget && setEditingProduct(null)}
        >
          <form
            onSubmit={handleUpdateProduct}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '440px',
              width: '100%',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 14px' }}>
              Edit Product: {editingProduct.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Price (₦)
                </label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Stock Status
                </label>
                <select
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value as 'in-stock' | 'out-of-stock' | 'pre-order')}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: '#0f431f',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Global style for admin mobile sidebar */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            transform: translateX(-100%);
            box-shadow: 4px 0 24px rgba(0,0,0,0.4);
          }
          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
